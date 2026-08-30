#include <Arduino.h>
#include <ESP32Servo.h>
#include <MAX30100_PulseOximeter.h>
#include <MAX30100.h>
#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// NOTE: This is a hobby/demo control loop.
// Ventilation is safety-critical—do not use for medical/clinical purposes.

namespace {
// Hardware pins
constexpr int kServoPin = 18;
constexpr int kI2cSdaPin = 21;
constexpr int kI2cSclPin = 22;

// DS18B20 (1-Wire)
constexpr int kDs18b20DataPin = 4;

// Buzzer for alarm
constexpr int kBuzzerPin = 25;  // GPIO 25 for alarm buzzer

// Alarm thresholds
constexpr float kAlarmTempThresholdF = 80.0f;  // Below 80°F triggers alarm
constexpr float kAlarmSpo2Threshold = 80.0f;   // Below 80% triggers alarm

// ESP32 hotspot credentials
constexpr const char* kApSsid = "DIY_Ventilator";
constexpr const char* kApPassword = "12345678"; // 8+ chars required

// BPM control password
constexpr const char* kBpmPassword = "12345678";

// Your SpO2-based rule table
// < 90  -> 20 BPM
// 90-95 -> 17 BPM
// >=95  -> 15 BPM
constexpr float kSpo2LowThreshold = 90.0f;
constexpr float kSpo2MidThreshold = 95.0f;
constexpr int kBpmLowSpo2 = 20;
constexpr int kBpmMidSpo2 = 17;
constexpr int kBpmHighSpo2 = 15;
constexpr int kFallbackBpm = 15; // When sensor is not visible/invalid

// Servo settings
// "360 degree and back to 0" implies a positional move.
// Standard servos are 0-180. The user requested 90-degree range anti-clockwise.
constexpr int kMinAngle = 0;
constexpr int kMaxAngle = 90; // Modified range for 360-positional servo

// Timing model
// Inhale = Up (0 -> Max), Exhale = Down (Max -> 0)
// Smooth motion requires frequent updates, not delays.
constexpr float kInhaleFraction = 0.4f; 

Servo g_servo;
PulseOximeter g_pox;
MAX30100 g_max30100; // Raw sensor access for PPG waveform
WebServer g_server(80);

OneWire g_oneWire(kDs18b20DataPin);
DallasTemperature g_ds18b20(&g_oneWire);

bool g_ventilatorRunning = false; // Controls if breathing cycle is active
bool g_manualMode = false;        // Manual SpO2 override
float g_manualSpo2 = 90.0f;       // Default manual value

// Alarm state
bool g_alarmActive = false;
uint32_t g_lastAlarmCheckMs = 0;

// Data logging for PDF export
struct PatientDataPoint {
  uint32_t timestamp;
  float spo2;
  float heartRate;
  float tempF;
  int targetBpm;
};

constexpr size_t kMaxDataPoints = 720; // 720 points at 1/min = 12 hours max
PatientDataPoint g_dataLog[kMaxDataPoints];
size_t g_dataLogHead = 0;
size_t g_dataLogCount = 0;
uint32_t g_lastDataLogMs = 0;

// Shared variables for Inter-Task Communication (Core 0 <-> Core 1)
volatile float g_sharedSpo2 = NAN;
volatile float g_sharedHr = NAN;
volatile bool g_sharedSensorOk = false;
volatile int g_sharedTargetBpm = kBpmHighSpo2;

volatile float g_sharedTempC = NAN;
volatile bool g_sharedBeatDetected = false;
volatile uint32_t g_sharedLastBeatMs = 0;

// PPG Waveform data for real-time display
constexpr size_t kPpgBufferSize = 50; // Last 50 samples
volatile uint16_t g_ppgBuffer[kPpgBufferSize];
volatile size_t g_ppgBufferIndex = 0;
volatile bool g_ppgDataReady = false;

struct Telemetry {
  float spo2 = NAN;
  float heartRate = NAN;
  bool sensorOk = false;
  int targetBpm = kBpmHighSpo2;

  float tempC = NAN;
  bool beatDetected = false;
  uint32_t lastBeatMs = 0;
  
  // PPG waveform data
  uint16_t ppgData[kPpgBufferSize];
  size_t ppgDataCount = 0;
  
  // Timing state
  uint32_t cycleStartMs = 0;
  uint32_t cycleDurationMs = 60000 / kBpmHighSpo2;
};

Telemetry g_t;

int computeTargetBpm(float spo2) {
  if (spo2 < kSpo2LowThreshold) {
    return kBpmLowSpo2;
  }
  if (spo2 < kSpo2MidThreshold) {
    return kBpmMidSpo2;
  }
  return kBpmHighSpo2;
}

void recomputeCycle(int bpm) {
  if (bpm <= 0) return;
  g_t.cycleDurationMs = 60000UL / static_cast<uint32_t>(bpm);
}

void updateBreathing() {
  if (!g_ventilatorRunning) {
    g_servo.write(kMinAngle);
    return;
  }

  const uint32_t now = millis();
  
  if (g_t.cycleStartMs == 0) {
    g_t.cycleStartMs = now;
  }

  uint32_t elapsed = now - g_t.cycleStartMs;
  
  if (elapsed >= g_t.cycleDurationMs) {
    g_t.cycleStartMs = now;
    elapsed = 0;
  }

  const uint32_t inhaleDuration = static_cast<uint32_t>(g_t.cycleDurationMs * kInhaleFraction);
  int targetAngle = kMinAngle;

  // Sine Easing: -0.5 * (cos(PI*x) - 1)
  auto easeInOutSine = [](float t) -> float {
      return -0.5f * (cos(PI * t) - 1.0f);
  };

  if (elapsed < inhaleDuration) {
    float t = static_cast<float>(elapsed) / static_cast<float>(inhaleDuration);
    targetAngle = kMinAngle + static_cast<int>((kMaxAngle - kMinAngle) * easeInOutSine(t));
  } else {
    uint32_t exhaleElapsed = elapsed - inhaleDuration;
    uint32_t exhaleDuration = g_t.cycleDurationMs - inhaleDuration;
    float t = static_cast<float>(exhaleElapsed) / static_cast<float>(exhaleDuration);
    targetAngle = kMaxAngle - static_cast<int>((kMaxAngle - kMinAngle) * easeInOutSine(t));
  }
  g_servo.write(targetAngle);
}

void handleSetZero() {
  g_ventilatorRunning = false;
  g_servo.write(kMinAngle);
  g_server.send(200, "text/plain", "OK: Position Zero Set");
}

void handleStart() {
  g_ventilatorRunning = true;
  // Reset cycle timing so it starts fresh 0 -> 90
  g_t.cycleStartMs = 0; 
  g_server.send(200, "text/plain", "OK: Ventilator Started");
}

void handleSetSpo2() {
  if (g_server.hasArg("val")) {
    g_manualSpo2 = g_server.arg("val").toFloat();
    g_manualMode = true;
    g_server.send(200, "text/plain", "OK: Manual SpO2 Set");
  } else {
    g_server.send(400, "text/plain", "Bad Request");
  }
}

void handleSetAuto() {
  g_manualMode = false;
  g_server.send(200, "text/plain", "OK: Auto Mode");
}

void handleSetBpm() {
  if (!g_server.hasArg("password") || !g_server.hasArg("bpm")) {
    g_server.send(400, "text/plain", "Bad Request: Missing parameters");
    return;
  }
  
  String password = g_server.arg("password");
  if (password != kBpmPassword) {
    g_server.send(403, "text/plain", "Forbidden: Incorrect password");
    return;
  }
  
  int newBpm = g_server.arg("bpm").toInt();
  if (newBpm < 5 || newBpm > 40) {
    g_server.send(400, "text/plain", "Bad Request: BPM must be between 5 and 40");
    return;
  }
  
  g_sharedTargetBpm = newBpm;
  g_server.send(200, "text/plain", "OK: BPM Set to " + String(newBpm));
}

void handleGetData() {
  if (!g_server.hasArg("duration")) {
    g_server.send(400, "text/plain", "Bad Request: Missing duration parameter");
    return;
  }
  
  String durStr = g_server.arg("duration");
  uint32_t durationMin = 0;
  
  if (durStr == "1h") durationMin = 60;
  else if (durStr == "6h") durationMin = 360;
  else if (durStr == "12h") durationMin = 720;
  else if (durStr == "all") durationMin = 999999;
  else {
    g_server.send(400, "text/plain", "Bad Request: Invalid duration");
    return;
  }
  
  // Generate CSV data (client will convert to PDF using JavaScript library)
  String csv = "Timestamp,SpO2 (%),Heart Rate (BPM),Temperature (°F),Ventilation Rate (BPM)\\n";
  
  uint32_t nowMs = millis();
  uint32_t cutoffMs = nowMs - (durationMin * 60000);
  
  size_t count = 0;
  for (size_t i = 0; i < g_dataLogCount; i++) {
    size_t idx = (g_dataLogHead + kMaxDataPoints - g_dataLogCount + i) % kMaxDataPoints;
    if (durationMin < 999999 && g_dataLog[idx].timestamp < cutoffMs) {
      continue;
    }
    
    // Convert timestamp to readable format (minutes ago)
    uint32_t ageMs = nowMs - g_dataLog[idx].timestamp;
    uint32_t minAgo = ageMs / 60000;
    
    csv += String(minAgo) + " min ago,";
    csv += String(g_dataLog[idx].spo2, 1) + ",";
    csv += String(g_dataLog[idx].heartRate, 1) + ",";
    csv += String(g_dataLog[idx].tempF, 1) + ",";
    csv += String(g_dataLog[idx].targetBpm);
    csv += "\\n";
    count++;
  }
  
  g_server.send(200, "text/csv", csv);
}

void checkAlarms() {
  uint32_t now = millis();
  if (now - g_lastAlarmCheckMs < 1000) return; // Check every second
  g_lastAlarmCheckMs = now;
  
  bool shouldAlarm = false;
  
  // Check temperature (convert from C to F)
  if (!isnan(g_t.tempC)) {
    float tempF = g_t.tempC * 9.0f / 5.0f + 32.0f;
    if (tempF < kAlarmTempThresholdF) {
      shouldAlarm = true;
    }
  }
  
  // Check SpO2
  if (!isnan(g_t.spo2) && g_t.spo2 < kAlarmSpo2Threshold) {
    shouldAlarm = true;
  }
  
  if (shouldAlarm && !g_alarmActive) {
    g_alarmActive = true;
    digitalWrite(kBuzzerPin, HIGH); // Activate buzzer
  } else if (!shouldAlarm && g_alarmActive) {
    g_alarmActive = false;
    digitalWrite(kBuzzerPin, LOW); // Deactivate buzzer
  }
  
  // Beep pattern when alarm is active
  if (g_alarmActive) {
    static uint32_t lastBeepMs = 0;
    if (now - lastBeepMs > 500) { // Toggle every 500ms
      lastBeepMs = now;
      digitalWrite(kBuzzerPin, !digitalRead(kBuzzerPin));
    }
  }
}

void logPatientData() {
  uint32_t now = millis();
  if (now - g_lastDataLogMs < 60000) return; // Log every minute
  g_lastDataLogMs = now;
  
  PatientDataPoint& point = g_dataLog[g_dataLogHead];
  point.timestamp = now;
  point.spo2 = g_t.spo2;
  point.heartRate = g_t.heartRate;
  point.tempF = isnan(g_t.tempC) ? NAN : (g_t.tempC * 9.0f / 5.0f + 32.0f);
  point.targetBpm = g_t.targetBpm;
  
  g_dataLogHead = (g_dataLogHead + 1) % kMaxDataPoints;
  if (g_dataLogCount < kMaxDataPoints) {
    g_dataLogCount++;
  }
}

void handleRoot() {
  const char* html = R"raw(
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Smart Ventilator</title>
    <style>
        :root {
            /* Neobrutalism Palette */
            --bg: #E0E7F1;
            --card: #ffffff;
            --border: #000000;
            --text-main: #000000;
            --text-sub: #111111;
            
            /* Vibrant Accents */
            --primary: #8C52FF;
            --red: #FF3B30; 
            --blue: #007AFF; 
            --green: #34C759;
            --yellow: #FFCC00;
        }
        body { 
            font-family: 'Courier New', Courier, monospace; 
            font-weight: bold;
            background: var(--bg); 
            color: var(--text-main); 
            margin: 0; padding: 0; 
            min-height: 100vh; 
            display: flex; flex-direction: column; align-items: center; 
        }

        /* Navbar */
        .navbar {
            width: 100%;
            background: var(--yellow);
            border-bottom: 3px solid black;
            padding: 16px 20px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .nav-brand { font-weight: 900; font-size: 1.2rem; text-transform: uppercase; letter-spacing: -1px; }
        .nav-links { display: flex; gap: 20px; }
        .nav-link { 
            text-decoration: none; color: black; font-weight: 900; 
            text-transform: uppercase; font-size: 0.9rem;
            padding: 4px 8px;
            border: 2px solid transparent;
        }
        .nav-link:hover { border: 2px solid black; background: white; }
        .status-badge { 
             padding: 4px 10px; border: 2px solid black; font-size: 0.75rem; 
             font-weight: 900; text-transform: uppercase; background: var(--green);
        }

        .container { 
            width: 100%; 
            max-width: 1000px; 
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        /* Desktop Grid for Vitals & Controls */
        /* We want: ECG (Full) -> Vitals (Row) -> Resp (Full) -> Controls (Halves) */
        
        .card { 
            background: var(--card); padding: 16px; 
            border: 3px solid var(--border);
            box-shadow: 6px 6px 0px var(--border);
            text-align: center; position: relative; overflow: hidden;
            transition: all 0.1s;
            cursor: default;
        }
        .card:hover { 
            transform: translate(-2px, -2px); 
            box-shadow: 8px 8px 0px var(--border);
        }

        .label { font-size: 0.8rem; color: black; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; border-bottom: 2px solid black; display: inline-block; padding-bottom: 2px; }
        .value { font-size: 2.5rem; font-weight: 900; line-height: 1; margin: 8px 0; font-family: sans-serif; }
        .unit { font-size: 0.9rem; font-weight: 700; color: black; }
        
        /* Vitals Row */
        .vitals-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }
        @media (min-width: 768px) {
            .vitals-grid { grid-template-columns: 1fr 1fr 1fr; }
            .controls-grid { grid-template-columns: 1fr 1fr; }
        }

        /* Controls Row */
        .controls-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        /* Colors & Anims */
        .c-spo2 { color: var(--blue); text-shadow: 2px 2px 0px #eee; }
        .c-hr { color: var(--red); text-shadow: 2px 2px 0px #eee; }
        .c-vent { color: var(--green); text-shadow: 2px 2px 0px #eee;}
        .c-temp { color: var(--yellow); text-shadow: 2px 2px 0px black; -webkit-text-stroke: 1px black; }
        
        @keyframes pulse { 0% { transform: scale(1);} 50% { transform: scale(1.3);} 100% { transform: scale(1);} }
        .icon-heart { display: inline-block; animation: pulse 0.8s infinite steps(2); } 
        
        /* Ventilation Visualizer */
        .lung-container { width: 50px; height: 50px; position: relative; display: flex; align-items: center; justify-content: center; border: 2px solid black; border-radius: 50%; background: white; margin: 0 auto; }
        .lung-circle { width: 100%; height: 100%; border-radius: 50%; background: var(--green); width:80%; height:80%; border: 2px solid black; animation: breath 4s ease-in-out infinite; }
        @keyframes breath { 0% { transform: scale(0.6); } 50% { transform: scale(1); } 100% { transform: scale(0.6); } }

        /* ECG */
        .ecg-canvas { width: 100%; height: 200px; pointer-events: none; border: 2px solid black; background: #0a0a0a; display: block; }
        .ecg-card { padding: 0 !important; text-align: left !important; }
        .ecg-header { padding: 8px 16px; background: #1a1a1a; color: #00ff00; border-bottom: 3px solid black; display: flex; justify-content: space-between; align-items: center; }
        .ecg-grid { 
            background-image: 
                repeating-linear-gradient(0deg, transparent, transparent 19px, #1a3a1a 19px, #1a3a1a 20px),
                repeating-linear-gradient(90deg, transparent, transparent 19px, #1a3a1a 19px, #1a3a1a 20px),
                repeating-linear-gradient(0deg, transparent, transparent 99px, #2a5a2a 99px, #2a5a2a 100px),
                repeating-linear-gradient(90deg, transparent, transparent 99px, #2a5a2a 99px, #2a5a2a 100px);
        }

        /* Controls Styles */
        .section-head { font-size: 1rem; font-weight: 900; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; color: black; text-transform: uppercase; }
        
        .btn-group { display: flex; gap: 12px; flex-wrap: wrap; }
        button { 
            flex: 1; padding: 14px; 
            border: 3px solid black; 
            font-weight: 900; cursor: pointer; font-size: 0.9rem; 
            transition: all 0.1s; 
            position: relative; overflow: hidden;
            box-shadow: 4px 4px 0px black;
            text-transform: uppercase;
            font-family: inherit;
            min-width: 100px;
        }
        button:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0px black; }
        button:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px black; }
        
        .btn-pri { background: var(--primary); color: white; }
        .btn-pri:hover { background: #7b45e6; }
        .btn-sec { background: white; color: black; }
        .btn-sec:hover { background: #eee; }
        .btn-hot { background: #E0E7F1; color: black; }
        .btn-hot:hover { background: #d1d9e6; }

        /* Alarm Styles */
        .alarm-indicator {
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 16px 24px;
            background: var(--red);
            color: white;
            border: 4px solid black;
            box-shadow: 6px 6px 0px black;
            font-weight: 900;
            text-transform: uppercase;
            animation: alarm-flash 0.5s infinite;
            display: none;
            z-index: 1001;
            font-size: 1.1rem;
        }
        @keyframes alarm-flash { 
            0%, 100% { 
                opacity: 1; 
                transform: scale(1);
                box-shadow: 6px 6px 0px black;
            } 
            50% { 
                opacity: 0.7; 
                transform: scale(1.05);
                box-shadow: 8px 8px 0px black;
            } 
        }
        
        /* Audio Notice Banner */
        .audio-notice {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: #8C52FF;
            color: white;
            border: 3px solid black;
            box-shadow: 4px 4px 0px black;
            font-weight: 900;
            font-size: 0.9rem;
            z-index: 1002;
            cursor: pointer;
            display: none;
        }
        .audio-notice:hover {
            transform: translateX(-50%) translateY(-2px);
            box-shadow: 6px 6px 0px black;
        }
        
        /* Input Styles */
        input[type="number"], input[type="password"] {
            padding: 10px;
            border: 3px solid black;
            font-weight: 900;
            font-family: inherit;
            font-size: 0.9rem;
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 12px;
        }

    </style>
</head>
<body>
    
    <!-- Alarm Indicator -->
    <div id="alarm-indicator" class="alarm-indicator">🚨 CRITICAL ALERT - CHECK VITALS!</div>
    
    <!-- Audio Notice Banner -->
    <div id="audio-notice" class="audio-notice" onclick="enableAudioNotice()">
        🔊 Click to Enable Alert Sounds
    </div>
    
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-brand">❤️ AutoVent AI</div>
        <!-- Simple Desktop Links (hidden on small mobile purely for simlicity in this demo) -->
        <div class="nav-links" style="display:none;"> 
            <a href="#" class="nav-link">Dashboard</a>
            <a href="#" class="nav-link">Settings</a>
        </div>
        <div id="status" class="status-badge">Connecting...</div>
    </nav>
    
    <!-- Mobile Menu Toggle Simulation (Visible on Desktop via Media Query logic in real app, here inline style) -->
    <script>
        if(window.innerWidth > 600) document.querySelector('.nav-links').style.display = 'flex';
    </script>

    <div class="container">
        
        <!-- 1. ECG (Top) -->
        <div class="card ecg-card">
            <div class="ecg-header">
                <div class="label" style="border:none; margin:0; color:#00ff00;">
                    💓 Live PPG Waveform 
                    <span id="ppg-mode" style="font-size:0.7rem; opacity:0.7;">(Sensor)</span>
                </div>
            <div class="status-badge" style="font-size:0.6rem; background:#00ff00; color:black;">Heart Rate: <span id="ecg-hr">--</span> BPM</div>
            </div>
            <canvas id="ecg" class="ecg-canvas ecg-grid"></canvas>
        </div>

        <!-- 2. Vitals (Row of 3) -->
        <div class="vitals-grid">
            <!-- SpO2 -->
            <div class="card">
                <div class="label">Oxygen (SpO2)</div>
                <div class="value c-spo2"><span id="spo2">--</span><span style="font-size:1rem">%</span></div>
            </div>

            <!-- HR -->
            <div class="card">
                <div class="label">Heart Rate</div>
                <div class="value c-hr"><span class="icon-heart">♥</span> <span id="hr">--</span></div>
            </div>

            <!-- Temp -->
            <div class="card">
                <div class="label">Body Temp</div>
                <div class="value c-temp"><span id="temp">--</span><span style="font-size:1.5rem">°F</span></div>
            </div>
        </div>

        <!-- 3. Respiration Rate (Full Row) -->
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px;">
            <div style="text-align: left;">
                <div class="label">Respiration Rate</div>
                <div class="value c-vent" id="bpm">--</div>
                <div class="unit">Breaths / Minute</div>
            </div>
            <div class="lung-container" style="margin: 0;">
                <div class="lung-circle" id="breath-anim"></div>
            </div>
        </div>

        <!-- 4. Controls (Split Grid) -->
        <div class="controls-grid">
            <!-- System Control -->
            <div class="card" style="text-align: left;">
                <div class="section-head">⚙️ System Control</div>
                <div class="btn-group">
                    <button class="btn-sec" onclick="fetch('/set_zero')">Stop / Reset</button>
                    <button class="btn-pri" onclick="fetch('/start')">Start Ventilation</button>
                    <button class="btn-hot" onclick="testAlarmSound()" style="background: #FF9800; color: white;">🔊 Test Alarm</button>
                </div>
            </div>

            <!-- Simulation -->
            <div class="card" style="text-align: left;">
                <div class="section-head">
                    🧪 Simulation / Override 
                    <span id="mode-badge" class="status-badge" style="margin-left:auto; font-size:0.6rem; background:var(--yellow); color:black;">Auto</span>
                </div>
                <div class="btn-group">
                    <button class="btn-hot" onclick="setSim(85)">85%</button>
                    <button class="btn-hot" onclick="setSim(92)">92%</button>
                    <button class="btn-hot" onclick="setSim(98)">98%</button>
                    <button class="btn-hot" onclick="fetch('/set_auto')">Auto</button>
                </div>
            </div>
        </div>

        <!-- 5. BPM Control (Password Protected) -->
        <div class="card" style="text-align: left;">
            <div class="section-head">🔒 Manual BPM Control</div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <input type="password" id="bpm-password" placeholder="Password (12345678)" style="flex: 1; min-width: 150px; margin: 0;">
                <input type="number" id="bpm-value" placeholder="BPM (5-40)" min="5" max="40" style="flex: 1; min-width: 100px; margin: 0;">
                <button class="btn-pri" onclick="setBpm()" style="flex: 1; min-width: 120px;">Set BPM</button>
            </div>
            <div id="bpm-result" style="margin-top: 8px; font-size: 0.8rem; font-weight: 900;"></div>
        </div>

        <!-- 6. Download Patient Data -->
        <div class="card" style="text-align: left;">
            <div class="section-head">📥 Download Patient Data (PDF)</div>
            <div class="btn-group">
                <button class="btn-sec" onclick="downloadData('1h')">Last 1 Hour</button>
                <button class="btn-sec" onclick="downloadData('6h')">Last 6 Hours</button>
                <button class="btn-sec" onclick="downloadData('12h')">Last 12 Hours</button>
                <button class="btn-sec" onclick="downloadData('all')">All Data</button>
            </div>
        </div>

        <!-- 7. Real-Time Sensor Data Table -->
        <div class="card" style="text-align: left;">
            <div class="section-head">📊 Live Sensor Data Stream</div>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.85rem;">
                    <thead>
                        <tr style="background: #f0f0f0; border: 2px solid black;">
                            <th style="padding: 8px; border: 2px solid black; text-align: left;">Time</th>
                            <th style="padding: 8px; border: 2px solid black; text-align: right;">SpO2 (%)</th>
                            <th style="padding: 8px; border: 2px solid black; text-align: right;">HR (BPM)</th>
                            <th style="padding: 8px; border: 2px solid black; text-align: right;">Temp (°F)</th>
                            <th style="padding: 8px; border: 2px solid black; text-align: right;">Vent (BPM)</th>
                            <th style="padding: 8px; border: 2px solid black; text-align: center;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="sensor-data-table">
                        <tr>
                            <td colspan="6" style="padding: 20px; text-align: center; border: 2px solid black;">Loading sensor data...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 12px; font-size: 0.75rem; color: #666;">
                Showing last 10 readings • Updates every second
            </div>
        </div>

    </div>

    <script>
      // Redesigned ECG Wave Generator
      const canvas = document.getElementById('ecg');
      const ctx = canvas.getContext('2d');

      function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 200;
      }
      window.addEventListener('resize', resizeCanvas);
      setTimeout(resizeCanvas, 100);

      let ecgX = 0;
      let lastHeartBeat = 0;
      let currentHR = 72; // Default heart rate
      let beatDetected = false;
      let beatStartTime = 0;
      let lastAlarmState = false;
      
      // PPG waveform data
      let ppgDataBuffer = [];
      let ppgDisplayIndex = 0;
      
      // === ALARM SOUND SYSTEM ===
      let audioContext = null;
      let alarmOscillator = null;
      let alarmGain = null;
      let beepInterval = null;
      let audioInitialized = false;
      
      // Initialize audio context
      function initAudioContext() {
        try {
          if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('✓ Audio context created');
          }
          if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
              console.log('✓ Audio context resumed');
              audioInitialized = true;
            });
          } else {
            audioInitialized = true;
          }
        } catch (e) {
          console.error('Audio initialization failed:', e);
        }
      }
      
      // Show audio notice banner
      setTimeout(() => {
        const notice = document.getElementById('audio-notice');
        if (notice) {
          notice.style.display = 'block';
          setTimeout(() => {
            if (!audioInitialized) notice.style.display = 'none';
          }, 10000);
        }
      }, 2000);
      
      // Enable audio from banner click
      window.enableAudioNotice = function() {
        initAudioContext();
        const notice = document.getElementById('audio-notice');
        if (notice) {
          notice.textContent = '✅ Alert Sounds Enabled';
          notice.style.background = '#34C759';
          setTimeout(() => { notice.style.display = 'none'; }, 2000);
        }
        // Test the sound
        testAlarmSound();
      }
      
      // Test alarm sound
      window.testAlarmSound = function() {
        console.log('Testing alarm sound...');
        initAudioContext();
        if (!audioContext) {
          alert('Audio not available. Click anywhere first.');
          return;
        }
        
        // Play a quick test beep
        try {
          const testOsc = audioContext.createOscillator();
          const testGain = audioContext.createGain();
          testOsc.connect(testGain);
          testGain.connect(audioContext.destination);
          testOsc.frequency.value = 880;
          testGain.gain.value = 0.5;
          testOsc.start();
          testOsc.stop(audioContext.currentTime + 0.2);
          console.log('✓ Test beep played');
        } catch (e) {
          console.error('Test sound failed:', e);
          alert('Sound test failed: ' + e.message);
        }
      }
      
      // Auto-enable audio on user interaction
      document.addEventListener('click', initAudioContext);
      document.addEventListener('touchstart', initAudioContext);
      
      function playAlarmSound() {
        console.log('playAlarmSound called, audioInitialized:', audioInitialized);
        
        // Initialize if needed
        initAudioContext();
        
        // Stop existing alarm first
        if (alarmOscillator) {
          console.log('Alarm already playing');
          return;
        }
        
        if (!audioContext) {
          console.error('No audio context available');
          return;
        }
        
        try {
          console.log('Starting alarm sound...');
          
          // Create oscillator and gain
          alarmOscillator = audioContext.createOscillator();
          alarmGain = audioContext.createGain();
          
          alarmOscillator.connect(alarmGain);
          alarmGain.connect(audioContext.destination);
          
          alarmOscillator.type = 'square';
          alarmOscillator.frequency.value = 880; // 880 Hz
          alarmGain.gain.value = 0;
          
          alarmOscillator.start();
          
          // Beeping pattern
          let isBeeping = false;
          beepInterval = setInterval(() => {
            if (alarmGain) {
              isBeeping = !isBeeping;
              alarmGain.gain.value = isBeeping ? 0.5 : 0;
            }
          }, 300);
          
          console.log('✓ Alarm sound started');
        } catch (e) {
          console.error('Failed to play alarm:', e);
          alarmOscillator = null;
          alarmGain = null;
        }
      }
      
      function stopAlarmSound() {
        console.log('stopAlarmSound called');
        
        try {
          if (beepInterval) {
            clearInterval(beepInterval);
            beepInterval = null;
          }
          
          if (alarmGain) {
            alarmGain.gain.value = 0;
          }
          
          if (alarmOscillator) {
            alarmOscillator.stop();
            alarmOscillator.disconnect();
            alarmOscillator = null;
          }
          
          if (alarmGain) {
            alarmGain.disconnect();
            alarmGain = null;
          }
          
          console.log('✓ Alarm sound stopped');
        } catch (e) {
          console.error('Error stopping alarm:', e);
          alarmOscillator = null;
          alarmGain = null;
          beepInterval = null;
        }
      }
      
      // ECG waveform parameters
      function generateECGPoint(phase) {
        // Only show wave during beat, otherwise flat line with slight drift
        if (!beatDetected) {
          // Slow baseline drift when no beat
          return Math.sin(Date.now() / 2000) * 0.02;
        }
        
        // Realistic ECG waveform generation during beat
        // P wave (0.0 - 0.15)
        if (phase < 0.15) {
          const t = phase / 0.15;
          return 0.15 * Math.sin(Math.PI * t);
        }
        // PR segment (0.15 - 0.20)
        else if (phase < 0.20) {
          return 0;
        }
        // Q wave (0.20 - 0.23)
        else if (phase < 0.23) {
          const t = (phase - 0.20) / 0.03;
          return -0.15 * Math.sin(Math.PI * t);
        }
        // R wave (0.23 - 0.28)
        else if (phase < 0.28) {
          const t = (phase - 0.23) / 0.05;
          return 1.0 * Math.sin(Math.PI * t);
        }
        // S wave (0.28 - 0.31)
        else if (phase < 0.31) {
          const t = (phase - 0.28) / 0.03;
          return -0.25 * Math.sin(Math.PI * t);
        }
        // ST segment (0.31 - 0.45)
        else if (phase < 0.45) {
          return 0;
        }
        // T wave (0.45 - 0.65)
        else if (phase < 0.65) {
          const t = (phase - 0.45) / 0.20;
          return 0.25 * Math.sin(Math.PI * t);
        }
        // End of beat - return to baseline
        else {
          beatDetected = false;
          return Math.sin(Date.now() / 2000) * 0.02;
        }
      }

      function drawECG() {
        const w = canvas.width;
        const h = canvas.height;
        const centerY = h / 2;
        const now = Date.now();
        
        // Shift canvas left (scrolling effect)
        const imageData = ctx.getImageData(3, 0, w - 3, h);
        ctx.putImageData(imageData, 0, 0);
        
        // Clear the rightmost strip
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(w - 3, 0, 3, h);
        
        let y = centerY;
        
        // Use real PPG data if available
        if (ppgDataBuffer.length > 0) {
          // Get next PPG value from sensor
          if (ppgDisplayIndex >= ppgDataBuffer.length) {
            ppgDisplayIndex = 0;
          }
          
          const rawValue = ppgDataBuffer[ppgDisplayIndex];
          ppgDisplayIndex++;
          
          // Normalize PPG value (typical MAX30100 IR range: 30000-100000)
          // Adjust these values based on your sensor's actual readings
          const minPpg = 30000;
          const maxPpg = 100000;
          const normalized = ((rawValue - minPpg) / (maxPpg - minPpg)) * 2 - 1; // -1 to +1
          const clipped = Math.max(-1, Math.min(1, normalized));
          
          // Scale to canvas
          const amplitude = h * 0.4;
          y = centerY - (clipped * amplitude);
        } else {
          // Fall back to simulated ECG if no sensor data
          let phase = 0;
          if (beatDetected) {
            const beatDuration = 600;
            const timeSinceBeat = now - beatStartTime;
            phase = timeSinceBeat / beatDuration;
            
            if (phase >= 1.0) {
              beatDetected = false;
            }
          }
          
          const ecgValue = generateECGPoint(phase);
          const noise = (Math.random() - 0.5) * 0.015;
          const finalValue = ecgValue + noise;
          const amplitude = h * 0.35;
          y = centerY - (finalValue * amplitude);
        }
        
        // Draw the waveform
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00ff00';
        
        ctx.beginPath();
        ctx.moveTo(w - 6, canvas.lastY || centerY);
        ctx.lineTo(w - 3, y);
        ctx.stroke();
        
        canvas.lastY = y;
        
        requestAnimationFrame(drawECG);
      }

      // Start ECG animation
      lastHeartBeat = Date.now();
      drawECG();

        // Sensor data collection array
        const sensorDataHistory = [];
        const maxHistoryItems = 10;

        function updateSensorDataTable(data) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString();
            
            // Add new reading to history
            sensorDataHistory.unshift({
                time: timeStr,
                spo2: data.spo2 ? data.spo2.toFixed(1) : '--',
                hr: data.hr ? data.hr.toFixed(0) : '--',
                temp: data.temp_f ? data.temp_f.toFixed(1) : '--',
                bpm: data.target_bpm || '--',
                status: data.sensor_ok ? '✓ Online' : '✗ Offline'
            });
            
            // Keep only last 10 items
            if (sensorDataHistory.length > maxHistoryItems) {
                sensorDataHistory.pop();
            }
            
            // Update table
            const tbody = document.getElementById('sensor-data-table');
            tbody.innerHTML = '';
            
            sensorDataHistory.forEach((reading, index) => {
                const row = document.createElement('tr');
                row.style.background = index % 2 === 0 ? '#fff' : '#f9f9f9';
                row.style.transition = 'all 0.3s';
                
                if (index === 0) {
                    row.style.background = '#e8f5e9';
                    row.style.fontWeight = '900';
                }
                
                row.innerHTML = `
                    <td style="padding: 8px; border: 2px solid black;">${reading.time}</td>
                    <td style="padding: 8px; border: 2px solid black; text-align: right; color: var(--blue);">${reading.spo2}</td>
                    <td style="padding: 8px; border: 2px solid black; text-align: right; color: var(--red);">${reading.hr}</td>
                    <td style="padding: 8px; border: 2px solid black; text-align: right; color: #ff9800;">${reading.temp}</td>
                    <td style="padding: 8px; border: 2px solid black; text-align: right; color: var(--green);">${reading.bpm}</td>
                    <td style="padding: 8px; border: 2px solid black; text-align: center;">${reading.status}</td>
                `;
                tbody.appendChild(row);
            });
        }

        function setSim(v) { fetch('/set_spo2?val='+v); }
        
        async function loop() {
            try {
                const r = await fetch('/status');
                const d = await r.json();
                
                // Update PPG data buffer for real waveform display
                if (d.ppg && Array.isArray(d.ppg) && d.ppg.length > 0) {
                    ppgDataBuffer = d.ppg;
                    ppgDisplayIndex = 0;
                    // Update mode indicator
                    const modeEl = document.getElementById('ppg-mode');
                    if (modeEl) modeEl.textContent = '(Real Sensor Data)';
                    console.log('PPG data received:', d.ppg.length, 'samples, range:', Math.min(...d.ppg), '-', Math.max(...d.ppg));
                } else {
                    // Fallback to simulated
                    const modeEl = document.getElementById('ppg-mode');
                    if (modeEl) modeEl.textContent = '(Simulated)';
                }
                
                document.getElementById('spo2').textContent = d.spo2 ? d.spo2.toFixed(1) : '--';
                
                const hr = d.hr ? d.hr.toFixed(0) : '--';
                document.getElementById('hr').textContent = hr;
                
                // Update ECG heart rate display
                if (d.hr && d.hr > 0) {
                    currentHR = d.hr;
                    document.getElementById('ecg-hr').textContent = d.hr.toFixed(0);
                } else {
                    document.getElementById('ecg-hr').textContent = '--';
                }
                
                // Trigger ECG wave when beat is detected (fallback for simulated mode)
                if (d.beat_detected && !beatDetected) {
                    beatDetected = true;
                    beatStartTime = Date.now();
                }
                
                if(d.temp_f === null || d.temp_f === undefined) {
                  document.getElementById('temp').textContent = '--';
                } else {
                  document.getElementById('temp').textContent = d.temp_f.toFixed(1);
                }

                const bpm = d.target_bpm || 0;
                document.getElementById('bpm').textContent = bpm;
                
                // Animate Breath
                if(bpm > 0) {
                    const sec = 60 / bpm;
                    document.getElementById('breath-anim').style.animationDuration = sec + 's';
                }

                // Status
                const s = document.getElementById('status');
                if(d.sensor_ok) { s.textContent = "System Online"; s.style.background = "var(--green)"; }
                else { s.textContent = "Connecting Sensor..."; s.style.background = "var(--red)"; }

                // Mode
                const m = document.getElementById('mode-badge');
                if(d.manual_mode) { 
                    m.textContent = "Manual Override"; 
                    m.style.background = "var(--red)";
                    m.style.color = "white";
                }
                else { 
                    m.textContent = "Auto"; 
                    m.style.background = "var(--yellow)";
                    m.style.color = "black";
                }

                // Alarm
                const alarm = document.getElementById('alarm-indicator');
                if(d.alarm_active) {
                    console.log('🚨 ALARM ACTIVE - alarm_active:', d.alarm_active, 'lastAlarmState:', lastAlarmState);
                    alarm.style.display = 'block';
                    // Play sound when alarm becomes active
                    if (!lastAlarmState) {
                        console.log('🔊 Triggering alarm sound...');
                        playAlarmSound();
                        // Also show browser notification if supported
                        if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification('⚠️ CRITICAL ALERT', {
                                body: 'Patient vitals require immediate attention!',
                                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="70" font-size="70">⚠️</text></svg>',
                                requireInteraction: true
                            });
                        }
                    }
                } else {
                    alarm.style.display = 'none';
                    // Stop sound when alarm becomes inactive
                    if (lastAlarmState) {
                        console.log('✓ Alarm cleared - stopping sound');
                        stopAlarmSound();
                    }
                }
                lastAlarmState = d.alarm_active;
                
                // Update sensor data table
                updateSensorDataTable(d);
              } catch (e) {
              }
            }

            async function setBpm() {
                const password = document.getElementById('bpm-password').value;
                const bpm = document.getElementById('bpm-value').value;
                const resultDiv = document.getElementById('bpm-result');
                
                if (!password || !bpm) {
                    resultDiv.textContent = '❌ Please enter both password and BPM value';
                    resultDiv.style.color = 'red';
                    return;
                }
                
                try {
                    const r = await fetch('/set_bpm?password=' + encodeURIComponent(password) + '&bpm=' + encodeURIComponent(bpm));
                    const text = await r.text();
                    
                    if (r.ok) {
                        resultDiv.textContent = '✅ ' + text;
                        resultDiv.style.color = 'green';
                        document.getElementById('bpm-password').value = '';
                        document.getElementById('bpm-value').value = '';
                    } else {
                        resultDiv.textContent = '❌ ' + text;
                        resultDiv.style.color = 'red';
                    }
                } catch (e) {
                    resultDiv.textContent = '❌ Error: ' + e.message;
                    resultDiv.style.color = 'red';
                }
            }

            async function downloadData(duration) {
                try {
                    const r = await fetch('/get_data?duration=' + duration);
                    const csv = await r.text();
                    
                    if (!r.ok) {
                        alert('Error downloading data: ' + csv);
                        return;
                    }
                    
                    // Parse CSV data
                    const lines = csv.split('\\n');
                    const pdfData = [];
                    
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].trim()) {
                            pdfData.push(lines[i].split(','));
                        }
                    }
                    
                    // Calculate statistics
                    let spo2Sum = 0, hrSum = 0, tempSum = 0, bpmSum = 0;
                    let spo2Min = 100, hrMin = 200, tempMin = 120, bpmMin = 100;
                    let spo2Max = 0, hrMax = 0, tempMax = 0, bpmMax = 0;
                    let validCount = 0;
                    
                    for (let i = 1; i < pdfData.length; i++) { // Skip header
                        const row = pdfData[i];
                        if (row.length >= 5) {
                            const spo2 = parseFloat(row[1]);
                            const hr = parseFloat(row[2]);
                            const temp = parseFloat(row[3]);
                            const bpm = parseFloat(row[4]);
                            
                            if (!isNaN(spo2) && !isNaN(hr) && !isNaN(temp) && !isNaN(bpm)) {
                                spo2Sum += spo2; hrSum += hr; tempSum += temp; bpmSum += bpm;
                                spo2Min = Math.min(spo2Min, spo2); hrMin = Math.min(hrMin, hr);
                                tempMin = Math.min(tempMin, temp); bpmMin = Math.min(bpmMin, bpm);
                                spo2Max = Math.max(spo2Max, spo2); hrMax = Math.max(hrMax, hr);
                                tempMax = Math.max(tempMax, temp); bpmMax = Math.max(bpmMax, bpm);
                                validCount++;
                            }
                        }
                    }
                    
                    const spo2Avg = validCount > 0 ? (spo2Sum / validCount).toFixed(1) : '--';
                    const hrAvg = validCount > 0 ? (hrSum / validCount).toFixed(0) : '--';
                    const tempAvg = validCount > 0 ? (tempSum / validCount).toFixed(1) : '--';
                    const bpmAvg = validCount > 0 ? (bpmSum / validCount).toFixed(0) : '--';
                    
                    // Create professional HTML report
                    const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Ventilation Report</title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
        body {
            font-family: 'Courier New', monospace;
            background: #E0E7F1;
            margin: 0;
            padding: 20px;
        }
        .report-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border: 4px solid black;
            box-shadow: 10px 10px 0 black;
        }
        .header {
            background: #FFCC00;
            border-bottom: 4px solid black;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .header .subtitle {
            font-size: 1rem;
            font-weight: bold;
        }
        .meta-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            border-bottom: 4px solid black;
        }
        .meta-item {
            padding: 15px 20px;
            border: 2px solid black;
            background: #f9f9f9;
        }
        .meta-label {
            font-weight: 900;
            font-size: 0.85rem;
            text-transform: uppercase;
            color: #555;
        }
        .meta-value {
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 5px;
        }
        .section {
            padding: 30px;
            border-bottom: 4px solid black;
        }
        .section:last-child { border-bottom: none; }
        .section-title {
            font-size: 1.5rem;
            font-weight: 900;
            text-transform: uppercase;
            margin: 0 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 3px solid black;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-card {
            border: 3px solid black;
            padding: 15px;
            background: #fff;
            box-shadow: 4px 4px 0 black;
        }
        .stat-card .label {
            font-size: 0.75rem;
            font-weight: 900;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 8px;
        }
        .stat-card .value {
            font-size: 2rem;
            font-weight: 900;
            line-height: 1;
        }
        .stat-card .range {
            font-size: 0.85rem;
            margin-top: 8px;
            color: #666;
        }
        .c-spo2 { color: #007AFF; }
        .c-hr { color: #FF3B30; }
        .c-temp { color: #FFCC00; text-shadow: 1px 1px 0 black; }
        .c-vent { color: #34C759; }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #000;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 0.85rem;
            border: 2px solid black;
        }
        td {
            padding: 10px 12px;
            border: 2px solid black;
            background: white;
        }
        tr:nth-child(even) td {
            background: #f9f9f9;
        }
        .footer {
            padding: 20px 30px;
            background: #f0f0f0;
            border-top: 4px solid black;
            text-align: center;
            font-size: 0.85rem;
        }
        .print-btn {
            padding: 15px 30px;
            background: #8C52FF;
            color: white;
            border: 3px solid black;
            font-weight: 900;
            font-size: 1rem;
            cursor: pointer;
            text-transform: uppercase;
            box-shadow: 4px 4px 0 black;
            margin: 20px auto;
            display: block;
        }
        .print-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 black;
        }
        .print-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 black;
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <h1>❤️ Patient Ventilation Report</h1>
            <div class="subtitle">AutoVent AI System - Medical Data Summary</div>
        </div>
        
        <div class="meta-info">
            <div class="meta-item">
                <div class="meta-label">Report Generated</div>
                <div class="meta-value">${new Date().toLocaleString()}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Data Duration</div>
                <div class="meta-value">${duration.toUpperCase()} • ${validCount} Readings</div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📊 Statistical Summary</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="label">Oxygen Saturation (SpO2)</div>
                    <div class="value c-spo2">${spo2Avg}<span style="font-size:1rem">%</span></div>
                    <div class="range">Range: ${spo2Min.toFixed(1)}% - ${spo2Max.toFixed(1)}%</div>
                </div>
                <div class="stat-card">
                    <div class="label">Heart Rate</div>
                    <div class="value c-hr">${hrAvg}<span style="font-size:1rem">BPM</span></div>
                    <div class="range">Range: ${hrMin.toFixed(0)} - ${hrMax.toFixed(0)} BPM</div>
                </div>
                <div class="stat-card">
                    <div class="label">Body Temperature</div>
                    <div class="value c-temp">${tempAvg}<span style="font-size:1rem">°F</span></div>
                    <div class="range">Range: ${tempMin.toFixed(1)}°F - ${tempMax.toFixed(1)}°F</div>
                </div>
                <div class="stat-card">
                    <div class="label">Ventilation Rate</div>
                    <div class="value c-vent">${bpmAvg}<span style="font-size:1rem">BPM</span></div>
                    <div class="range">Range: ${bpmMin} - ${bpmMax} BPM</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📋 Detailed Data Log</h2>
            <table>
                <thead>
                    <tr>
                        ${pdfData[0].map(header => '<th>' + header + '</th>').join('')}
                    </tr>
                </thead>
                <tbody>
                    ${pdfData.slice(1).map(row => 
                        '<tr>' + row.map(cell => '<td>' + cell + '</td>').join('') + '</tr>'
                    ).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <strong>⚠️ DISCLAIMER:</strong> This is a demonstration/hobby device. 
            Not for clinical or medical use. Data provided for educational purposes only.
            <br><br>
            Generated by AutoVent AI System • DIY Ventilator Project
        </div>
    </div>
    
    <button class="print-btn no-print" onclick="window.print()">🖨️ Print Report</button>
</body>
</html>`;
                    
                    // Download as HTML file
                    const blob = new Blob([reportHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ventilation_report_' + duration + '_' + Date.now() + '.html';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                } catch (e) {
                    alert('Error: ' + e.message);
                }
            }

            setInterval(loop, 500);
            loop();
          </script>
        </body>
        </html>
        )raw";

          g_server.send(200, "text/html", html);
}

void handleStatus() {
  String json;
  json.reserve(320);
  json += "{";
  json += "\"sensor_ok\":";
  json += (g_t.sensorOk ? "true" : "false");
  json += ",\"manual_mode\":";
  json += (g_manualMode ? "true" : "false");
  json += ",\"target_bpm\":";
  json += String(g_t.targetBpm);

  json += ",\"spo2\":";
  if (isnan(g_t.spo2)) {
    json += "null";
  } else {
    json += String(g_t.spo2, 1);
  }

  json += ",\"hr\":";
  if (isnan(g_t.heartRate)) {
    json += "null";
  } else {
    json += String(g_t.heartRate, 1);
  }

  json += ",\"temp_c\":";
  if (isnan(g_t.tempC)) {
    json += "null";
  } else {
    json += String(g_t.tempC, 1);
  }

  json += ",\"temp_f\":";
  if (isnan(g_t.tempC)) {
    json += "null";
  } else {
    json += String(g_t.tempC * 9.0f / 5.0f + 32.0f, 1);
  }

  json += ",\"alarm_active\":";
  json += (g_alarmActive ? "true" : "false");

  json += ",\"beat_detected\":";
  json += (g_t.beatDetected ? "true" : "false");

  // Add PPG waveform data array
  json += ",\"ppg\":[";
  if (g_t.ppgDataCount > 0) {
    for (size_t i = 0; i < g_t.ppgDataCount; i++) {
      if (i > 0) json += ",";
      json += String(g_t.ppgData[i]);
    }
  }
  json += "]";

  json += "}";
  g_server.send(200, "application/json", json);
}

void onBeatDetected() {
  g_sharedBeatDetected = true;
  g_sharedLastBeatMs = millis();
}

bool initMax30100() {
  Wire.begin(kI2cSdaPin, kI2cSclPin);
  // Many modules work fine at 100k. You can try 400k if stable.
  // Wire.setClock(400000);

  if (!g_pox.begin()) {
    return false;
  }

  g_pox.setOnBeatDetectedCallback(onBeatDetected);
  
  // Initialize raw MAX30100 for PPG waveform
  if (g_max30100.begin()) {
    g_max30100.setMode(MAX30100_MODE_SPO2_HR);
    g_max30100.setLedsPulseWidth(MAX30100_SPC_PW_1600US_16BITS);
    g_max30100.setSamplingRate(MAX30100_SAMPRATE_100HZ);
    g_max30100.setLedsCurrent(MAX30100_LED_CURR_50MA, MAX30100_LED_CURR_27_1MA);
    Serial.println("Raw MAX30100 initialized for PPG waveform");
  }
  
  return true;
}

void initWifiApAndServer() {
  WiFi.mode(WIFI_AP);
  WiFi.softAP(kApSsid, kApPassword);
  const IPAddress ip = WiFi.softAPIP();

  Serial.print("Hotspot SSID: ");
  Serial.println(kApSsid);
  Serial.print("Open: http://");
  Serial.println(ip);

  g_server.on("/", handleRoot);
  g_server.on("/set_zero", handleSetZero);
  g_server.on("/start", handleStart);
  g_server.on("/status", handleStatus);
  g_server.on("/set_spo2", handleSetSpo2);
  g_server.on("/set_auto", handleSetAuto);
  g_server.on("/set_bpm", handleSetBpm);
  g_server.on("/get_data", handleGetData);
  g_server.begin();
}

// --------------------------------------------------------------------------
// BACKGROUND SENSOR TASK (Core 0)
// Independent loop that handles the blocking sensor restart & polling
// --------------------------------------------------------------------------
void TaskSensor(void *pvParameters) {
  Serial.println("Sensor Task Started on Core 0");

  // DS18B20 setup
  g_ds18b20.begin();
  g_ds18b20.setResolution(11);
  g_ds18b20.setWaitForConversion(false);
  uint32_t lastTempRequestMs = 0;
  bool tempRequested = false;
  
  // Initial setup
  g_sharedSensorOk = initMax30100();
  
  uint32_t lastReportMs = 0;
  uint32_t lastRetryMs = 0;

  for (;;) {
    uint32_t now = millis();

    // DS18B20 temperature (non-blocking)
    if (!tempRequested) {
      if (now - lastTempRequestMs >= 1000) {
        lastTempRequestMs = now;
        g_ds18b20.requestTemperatures();
        tempRequested = true;
      }
    } else {
      // With 11-bit resolution conversion is ~375ms max
      if (now - lastTempRequestMs >= 400) {
        const float tC = g_ds18b20.getTempCByIndex(0);
        if (tC > -100.0f && tC < 150.0f) {
          g_sharedTempC = tC;
        }
        tempRequested = false;
      }
    }

    // 1. Update pulse oximeter frequently if sensor is OK
    if (g_sharedSensorOk) {
      g_pox.update();

      // Capture raw PPG data for waveform display (every 20ms for ~50 Hz sampling)
      static uint32_t lastPpgSampleMs = 0;
      if (now - lastPpgSampleMs >= 20) {
        lastPpgSampleMs = now;
        
        // Read raw IR value from sensor for PPG waveform
        uint16_t ir, red;
        g_max30100.update();
        g_max30100.getRawValues(&ir, &red);
        
        // Store IR value in circular buffer (IR channel shows clearer pulse waveform)
        g_ppgBuffer[g_ppgBufferIndex] = ir;
        g_ppgBufferIndex = (g_ppgBufferIndex + 1) % kPpgBufferSize;
        g_ppgDataReady = true;
      }

      // 2. Refresh shared telemetry every 100ms
      // This ensures the main loop (and web UI) sees fresh data without delay
      if (now - lastReportMs > 100) {
          lastReportMs = now;
          float currentSpo2 = g_pox.getSpO2();
          float currentHr = g_pox.getHeartRate();

          // Only update if we have valid non-zero data (MAX30100 starts at 0)
          // or if you want to show 0, remove the check. 
          // Keeping > 0 preserves the "last known good" behavior or filters initial zeros.
          if (currentSpo2 > 0.01f) {
              g_sharedSpo2 = currentSpo2;
              g_sharedHr = currentHr;
              g_sharedTargetBpm = computeTargetBpm(currentSpo2);
          }
      }
    } else {
      // 3. Retry connection if sensor is lost/missing (Every 5s)
      if (now - lastRetryMs > 5000) {
          lastRetryMs = now;
          Serial.println("[Task] Retrying Sensor Init...");
          if (initMax30100()) {
              g_sharedSensorOk = true;
              Serial.println("[Task] Sensor Init SUCCESS");
          }
      }
    }
    
    // Minimal yield to keep Core 0 responsive (WiFi/ISR) but execute fast enough for 100Hz sampling
    vTaskDelay(pdMS_TO_TICKS(2)); 
  }
}
} // namespace

void setup() {
  Serial.begin(115200);
  delay(200);

  pinMode(kBuzzerPin, OUTPUT);
  digitalWrite(kBuzzerPin, LOW);

  g_servo.setPeriodHertz(50);
  g_servo.attach(kServoPin, 500, 2400);
  g_servo.write(kMinAngle);

  initWifiApAndServer();
  
  // Start Sensor Task on Core 0 (App runs on Core 1 usually)
  xTaskCreatePinnedToCore(
    TaskSensor,   
    "SensorTask", 
    4096,        
    NULL,         
    1,            
    NULL,         
    0);           
}

void loop() {
  // MAIN LOOP (Core 1)
  // Handles Web & Servo Animation ONLY. 
  // Should run fast and smooth.

  g_server.handleClient();

  // Sync shared variables to local telemetry
  if (g_manualMode) {
    // In manual mode, override sensor data
    g_t.sensorOk = true;
    g_t.spo2 = g_manualSpo2;
    // We can keep the last known HR or just ignore it.
    // Let's compute target BPM from manual value
    int target = computeTargetBpm(g_manualSpo2);
    if (g_t.targetBpm != target) {
      g_t.targetBpm = target;
      recomputeCycle(g_t.targetBpm);
    }
  } else {
    // Normal sensor mode
    g_t.sensorOk = g_sharedSensorOk;
    g_t.spo2 = g_sharedSpo2;
    g_t.heartRate = g_sharedHr;
    
    // If BPM changed, update cycle duration
    if (g_t.targetBpm != g_sharedTargetBpm) {
       g_t.targetBpm = g_sharedTargetBpm;
       recomputeCycle(g_t.targetBpm);
    }
  }

  // Always sync DS18B20 data
  g_t.tempC = g_sharedTempC;
  g_t.beatDetected = g_sharedBeatDetected;
  g_t.lastBeatMs = g_sharedLastBeatMs;
  
  // Copy PPG waveform data if available
  if (g_ppgDataReady) {
    noInterrupts();
    for (size_t i = 0; i < kPpgBufferSize; i++) {
      g_t.ppgData[i] = g_ppgBuffer[i];
    }
    g_t.ppgDataCount = kPpgBufferSize;
    interrupts();
  }
  
  // Reset beat flag after reading
  if (g_sharedBeatDetected) {
    g_sharedBeatDetected = false;
  }

  updateBreathing();
  checkAlarms();
  logPatientData();
  
  // Minimal delay to yield Core 1
  delay(2);
}