# 🌱 Plant Care App - Complete Setup Guide

Choose your preferred method to run the app. All methods will work fully except web (limited to UI testing).

## Quick Comparison

| Method | Speed | Setup | Full Features | Best For |
|--------|-------|-------|---------------|----------|
| Expo Go | ⚡ Fast | 5 min | ✅ Yes | Quick testing |
| Android Emulator | 🚀 Fast | 30 min | ✅ Yes | Most users |
| iOS Simulator | 🚀 Fast | 20 min | ✅ Yes | Mac users |
| Physical Device | 📱 Real | 10 min | ✅ Yes | Real testing |
| Web Browser | 🌐 Instant | 2 min | ⚠️ Limited | UI preview only |

---

## Method 1: Expo Go (Easiest - No Installation)

**Best if**: You have a smartphone and want the quickest setup.

### Requirements
- Smartphone (iOS or Android)
- Expo Go app (free)
- Same WiFi network

### Steps

1. **Install Expo Go**:
   - iOS: https://apps.apple.com/app/expo-go/id1618915976
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Start the app**:
```bash
npm start
```

3. **Scan QR Code**:
   - iOS: Open Camera app, scan QR code
   - Android: Open Expo Go app, tap scan QR code

4. **Done!** App loads in seconds.

### Troubleshooting
- **QR code not working**: Ensure phone and computer on same WiFi
- **App crashes**: Restart Expo with `npm start --clear`
- **Network error**: Check WiFi connection

---

## Method 2: Android Emulator (Recommended)

**Best if**: You use Windows/Mac/Linux and want full features.

### Requirements
- Android Studio (free)
- 8GB+ RAM
- 10GB disk space

### Installation (30 minutes)

1. **Install Android Studio**:
   - Download from https://developer.android.com/studio
   - Follow installation wizard

2. **Configure Emulator**:
   - Open Android Studio
   - Tools → Device Manager
   - Click "Create device"
   - Select "Pixel 4" or similar
   - Choose API level 30 or higher
   - Allocate 2GB RAM
   - Finish

3. **Start Emulator**:
   - In Device Manager, click play button next to device
   - Wait for Android to boot (1-2 minutes)

4. **Run App**:
```bash
npm run android
```

App will build and install automatically.

### Tips
- **Faster startup**: Keep emulator running between sessions
- **Better performance**: Allocate more RAM if available
- **Multiple devices**: Create both Pixel and Tablet configurations

### Troubleshooting
- **Virtualization disabled**: Enable in BIOS settings
- **Slow emulator**: Increase RAM allocation
- **Build fails**: `npm start --clear` then `npm run android`

---

## Method 3: iOS Simulator (Mac Only)

**Best if**: You have a Mac and want to test on iOS.

### Requirements
- Mac with Xcode (free)
- 10GB disk space

### Installation (20 minutes)

1. **Install Xcode**:
```bash
xcode-select --install
```

2. **Open Simulator**:
```bash
open -a Simulator
```

3. **Run App**:
```bash
npm run ios
```

App builds and opens in simulator.

### Tips
- **Select device**: Simulator → Hardware → Device
- **Reset simulator**: Simulator → Erase All Content and Settings
- **See console**: Simulator → Debug → Open System Log

### Troubleshooting
- **Pod install error**: `cd ios && pod install && cd ..`
- **Build fails**: `npm start --clear`
- **Simulator won't launch**: Restart computer

---

## Method 4: Physical Android Device

**Best if**: You want real hardware testing.

### Requirements
- Android phone (USB cable)
- USB debugging enabled

### Setup (10 minutes)

1. **Enable Developer Mode**:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"

2. **Connect USB**:
```bash
# Verify device is connected
adb devices
```

3. **Run App**:
```bash
npm run android
```

App installs and launches on your phone.

### Tips
- **Keep device unlocked** during first build
- **Use good USB cable** (not charging-only)
- **Install app permanently**: APK remains after disconnecting

---

## Method 5: Physical iOS Device

**Best if**: You have an iPhone and want real testing (requires Mac).

### Requirements
- iPhone
- Mac with Xcode
- Apple Developer account (free)

### Setup (15 minutes)

1. **Sign Xcode Account**:
   - Xcode → Preferences → Accounts
   - Add your Apple ID
   - Create Team ID (free tier available)

2. **Connect iPhone**:
   - Plug in via USB
   - Trust computer on phone
   - Wait for Xcode to process

3. **Run App**:
```bash
npm run ios
```

App builds and installs on device.

### Tips
- **Keep signed in** to keep app working
- **Runs for 7 days** without paid account
- **App stays after disconnect** unlike emulator

---

## Method 6: Web Browser (UI Testing Only)

**Best if**: You just want to preview the UI (no database access).

### Requirements
- Just a browser!

### Setup (2 minutes)

1. **Start Web Version**:
```bash
npm run web
```

2. **Opens automatically** at http://localhost:19006

### Limitations ⚠️
- ❌ No database (SQLite doesn't work on web)
- ❌ No camera/photos
- ❌ No local storage
- ✅ UI/navigation works
- ✅ Good for CSS/styling changes

---

## Full Installation Instructions

### 1. Clone/Download Project
```bash
cd /opt/www/react/plantcare
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Choose Your Platform

Pick ONE of the methods above and follow its instructions.

### 4. Verify Installation
- App should open successfully
- Dashboard shows empty state
- Can navigate between tabs

### 5. Create First Plant
- Go to "My Plants" tab
- Click "Add Plant" button
- Take or select a photo
- Fill in details
- Click "Add Plant"

---

## Common Issues & Solutions

### Issue: "Cannot find module 'expo-sqlite'"
**Solution**:
```bash
rm -rf node_modules
npm install
npm start
```

### Issue: Port 19006 already in use
**Solution**:
```bash
lsof -i :19006
kill -9 <PID>
npm start
```

### Issue: "ANDROID_HOME not set"
**Solution** (Windows):
```bash
setx ANDROID_HOME "C:\Users\<YourUsername>\AppData\Local\Android\sdk"
```

**Solution** (Mac/Linux):
```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
source ~/.zshrc
```

### Issue: Emulator runs slowly
**Solution**:
- Close other applications
- Increase emulator RAM in settings
- Disable CPU throttling in emulator settings
- Use SSD instead of HDD

### Issue: Camera not working
**Solution**:
- Grant camera permissions in app
- Check phone settings
- For emulator: Grant virtual camera access

---

## Performance Tips

### Android Emulator
- Keep it running between sessions
- Allocate more RAM (4GB+)
- Use hardware acceleration
- Close unnecessary apps

### iOS Simulator
- Similar performance to Android
- Supports multiple devices
- Can test different screen sizes

### Physical Device
- Best performance
- Real camera/sensors
- Better for production testing

### Web Version
- Fastest startup
- Use for quick styling changes
- Not representative of mobile UI

---

## Next Steps After Setup

1. **Explore Features**:
   - Add a plant with photo
   - Check watering schedule
   - Add growth notes
   - View timeline

2. **Test All Screens**:
   - Dashboard
   - Plants list
   - Search functionality
   - Plant details

3. **Try Different Devices**:
   - Test on tablet if available
   - Try different screen sizes
   - Test on both platforms

---

## Need Help?

### Check Logs
```bash
npm start
# Shows detailed error messages
```

### Clear Everything
```bash
npm start --clear
# Clears Expo cache
```

### Reinstall From Scratch
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Reference Documentation
- Expo Docs: https://docs.expo.dev
- React Native Docs: https://reactnative.dev
- SQLite for React Native: https://docs.expo.dev/versions/latest/sdk/sqlite

Enjoy your Plant Care App! 🌿
