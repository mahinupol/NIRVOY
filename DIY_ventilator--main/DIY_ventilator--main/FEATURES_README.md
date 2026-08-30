# DIY Ventilator - New Features Documentation

## Overview
This document describes the three new features added to the DIY Ventilator system.

---

## 🚨 Feature 1: Automatic Alarm System

### Description
The system now includes an automatic alarm that activates when critical thresholds are breached:
- **Temperature**: Alarm triggers when body temperature falls below **80°F**
- **SpO2 (Oxygen Saturation)**: Alarm triggers when SpO2 drops below **80%**

### Hardware Required
- **Buzzer**: Connect to GPIO pin 25 (configurable in code as `kBuzzerPin`)
- The buzzer will beep in a pattern (on/off every 500ms) when alarm is active

### Visual Indicator
- A red flashing banner appears on the web interface: "⚠️ CRITICAL ALERT"
- The banner is positioned at the top-right of the screen
- It automatically disappears when conditions return to normal

### How It Works
1. The system checks temperature and SpO2 levels every second
2. If either value falls below the threshold, the alarm activates
3. The buzzer produces an intermittent beeping pattern
4. The web interface shows a visual alert
5. Alarm automatically deactivates when values return to safe levels

### Configuration
You can modify the thresholds in `main.cpp`:
```cpp
constexpr float kAlarmTempThresholdF = 80.0f;  // Temperature threshold in °F
constexpr float kAlarmSpo2Threshold = 80.0f;   // SpO2 threshold in %
```

---

## 🔒 Feature 2: Password-Protected BPM Control

### Description
Allows authorized users to manually override the automatic BPM (Breaths Per Minute) setting with password protection.

### Password
- Default password: **12345678**
- Can be changed in `main.cpp` by modifying `kBpmPassword`

### How to Use
1. Navigate to the web interface
2. Find the "🔒 Manual BPM Control" section
3. Enter the password: `12345678`
4. Enter desired BPM value (between 5 and 40)
5. Click "Set BPM"

### Validation
- Password must match exactly
- BPM value must be between 5 and 40
- System will display success/error messages:
  - ✅ "OK: BPM Set to [value]" - Success
  - ❌ "Forbidden: Incorrect password" - Wrong password
  - ❌ "Bad Request: BPM must be between 5 and 40" - Invalid BPM

### API Endpoint
```
GET /set_bpm?password=12345678&bpm=20
```

### Security Note
⚠️ This is basic password protection for demo purposes. For production medical devices, implement proper authentication and encryption.

---

## 📥 Feature 3: Patient Data Download

### Description
Download patient monitoring data as a text file (ready for PDF conversion) with customizable time ranges.

### Available Time Ranges
1. **Last 1 Hour** - Most recent 60 minutes of data
2. **Last 6 Hours** - Most recent 6 hours of data
3. **Last 12 Hours** - Most recent 12 hours of data
4. **All Data** - Complete historical data (up to 720 data points)

### Data Collected
Each data point includes:
- **Timestamp** (minutes ago)
- **SpO2** (Oxygen Saturation %)
- **Heart Rate** (BPM)
- **Temperature** (°F)
- **Ventilation Rate** (Breaths Per Minute)
- **Lead Status** (ECG leads ON/OFF)

### Data Collection
- Data is logged automatically every **60 seconds**
- Maximum storage: **720 data points** (12 hours at 1/min rate)
- Older data is automatically overwritten when buffer is full

### How to Use
1. Navigate to the web interface
2. Find the "📥 Download Patient Data (PDF)" section
3. Click one of the time range buttons:
   - "Last 1 Hour"
   - "Last 6 Hours"
   - "Last 12 Hours"
   - "All Data"
4. A text file will be downloaded automatically

### File Format
The downloaded file contains:
```
PATIENT DATA REPORT
===================

Duration: [selected duration]
Generated: [date and time]

Timestamp | SpO2 (%) | Heart Rate (BPM) | Temperature (°F) | Ventilation Rate (BPM) | Lead Status
0 min ago | 97.5 | 72.0 | 98.6 | 15 | ON
1 min ago | 97.3 | 73.0 | 98.5 | 15 | ON
...
```

### Enhancement Opportunity
The current implementation downloads as a text file. To generate proper PDFs:
1. Include the **jsPDF** library in your HTML
2. Uncomment the PDF generation code in the `downloadData()` function
3. The data structure is already prepared for PDF table generation

### API Endpoint
```
GET /get_data?duration=[1h|6h|12h|all]
```

Response: CSV formatted data

---

## Hardware Connections Summary

| Component | GPIO Pin | Purpose |
|-----------|----------|---------|
| Servo Motor | 18 | Ventilator control |
| I2C SDA | 21 | MAX30100 SpO2 sensor |
| I2C SCL | 22 | MAX30100 SpO2 sensor |
| DS18B20 Temp | 4 | Temperature sensor |
| AD8232 ECG Out | 34 | ECG signal input |
| AD8232 LO+ | 32 | Lead-off detection |
| AD8232 LO- | 33 | Lead-off detection |
| **Buzzer** | **25** | **Alarm output** |

---

## Web Interface Access

1. **Connect to WiFi Hotspot**
   - SSID: `DIY_Ventilator`
   - Password: `12345678`

2. **Open Web Browser**
   - Navigate to: `http://192.168.4.1`

3. **Available Features**
   - Real-time vital signs monitoring
   - Live ECG display
   - Ventilator control
   - Manual SpO2 simulation
   - **NEW: Password-protected BPM control**
   - **NEW: Patient data download**
   - **NEW: Visual alarm indicator**

---

## Testing the Features

### Test Alarm System
1. Simulate low SpO2: Click "85%" in the simulation section
2. Observe the alarm indicator appears
3. Listen for buzzer beeping pattern
4. Click "Auto" or "98%" to clear the alarm

### Test BPM Control
1. Enter password: `12345678`
2. Enter BPM: `25`
3. Click "Set BPM"
4. Verify the Respiration Rate updates to 25 BPM

### Test Data Download
1. Let the system run for a few minutes
2. Click "Last 1 Hour"
3. Open the downloaded file
4. Verify it contains timestamped patient data

---

## Code Modifications

All new features are implemented in `main.cpp`:

1. **Alarm System**
   - `checkAlarms()` - Main alarm logic
   - `kBuzzerPin` - Hardware configuration
   - Alarm thresholds configuration

2. **BPM Control**
   - `handleSetBpm()` - Password validation and BPM setting
   - `kBpmPassword` - Password configuration

3. **Data Logging**
   - `logPatientData()` - Data collection function
   - `handleGetData()` - Data export endpoint
   - `PatientDataPoint` structure - Data storage
   - `g_dataLog[]` - Circular buffer (720 points)

---

## Future Enhancements

1. **Alarm System**
   - Add configurable thresholds via web interface
   - Multiple alarm levels (warning, critical)
   - Alarm history log
   - Email/SMS notifications

2. **BPM Control**
   - HTTPS encryption
   - User authentication system
   - Session management
   - Audit log of BPM changes

3. **Data Download**
   - Integration with jsPDF library for proper PDF generation
   - Add charts and graphs to PDF reports
   - Cloud backup integration
   - Automatic scheduled reports
   - Export to CSV, JSON, or XML formats

---

## Safety Disclaimers

⚠️ **IMPORTANT SAFETY NOTICE**

1. This is a **hobby/demonstration project**
2. **NOT** intended for medical or clinical use
3. **NOT** FDA approved or medically certified
4. Should **NEVER** be used on actual patients
5. For educational and prototyping purposes only

If you're developing a real medical device:
- Follow FDA/medical device regulations
- Implement proper safety systems
- Obtain medical certifications
- Work with qualified medical professionals
- Conduct thorough testing and validation

---

## Troubleshooting

### Alarm Not Triggering
- Check buzzer connection to GPIO 25
- Verify buzzer polarity
- Check threshold values in code
- Use Serial Monitor to verify temperature/SpO2 readings

### BPM Control Not Working
- Verify password is exactly `12345678`
- Check BPM value is between 5-40
- Check browser console for JavaScript errors
- Verify ESP32 WiFi connection

### Data Download Empty
- System must run for at least 1 minute to collect first data point
- Check requested duration matches available data
- Verify data logging is active (check Serial Monitor)

### Web Interface Not Loading
- Verify connection to WiFi hotspot `DIY_Ventilator`
- Try IP address `http://192.168.4.1`
- Clear browser cache
- Try different web browser

---

## Support & Development

For questions, issues, or contributions:
- Check Serial Monitor output for debugging information
- Review code comments in `main.cpp`
- Test with demo_ui.html for offline interface testing

**Version:** 2.0.0  
**Last Updated:** January 22, 2026
