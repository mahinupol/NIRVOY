# Quick Feature Reference Card

## 🚨 ALARM SYSTEM
**When:** Temp < 80°F OR SpO2 < 80%  
**Action:** Buzzer beeps + Red banner on screen  
**Hardware:** Connect buzzer to GPIO 25  
**Auto-Reset:** Yes, when values return to normal

---

## 🔒 BPM CONTROL
**Password:** 12345678  
**Range:** 5-40 BPM  
**Location:** Web interface → "Manual BPM Control" section  
**Usage:**
1. Enter password
2. Enter BPM value
3. Click "Set BPM"

---

## 📥 DATA DOWNLOAD
**Options:**
- Last 1 Hour
- Last 6 Hours  
- Last 12 Hours
- All Data (max 12 hours)

**Data Logged:** SpO2, Heart Rate, Temperature, BPM, ECG Status  
**Update Rate:** Every 60 seconds  
**Format:** Text file (CSV-like)

---

## 📡 WiFi Connection
**SSID:** DIY_Ventilator  
**Password:** 12345678  
**IP Address:** http://192.168.4.1

---

## 🔧 GPIO Pins Used
| Pin | Device |
|-----|--------|
| 25  | Buzzer (NEW) |
| 18  | Servo |
| 21  | I2C SDA |
| 22  | I2C SCL |
| 4   | DS18B20 |
| 34  | ECG Out |
| 32  | ECG LO+ |
| 33  | ECG LO- |
