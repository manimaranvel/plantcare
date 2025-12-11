# 🌱 Plant Care App

A comprehensive mobile plant care application built with Expo (React Native).

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the Expo development server:**
```bash
npm start
```

## 📱 Running the App (Multiple Options)

### Option 1: Using Android Emulator (No Expo Go needed)
```bash
# Prerequisites: Android Studio installed with emulator configured

# Start emulator first (from Android Studio or command line)
emulator -avd <emulator_name>

# Then run:
npm run android

# This builds and runs the app directly on the emulator
```

### Option 2: Using iOS Simulator (Mac only)
```bash
# Prerequisites: Xcode installed

npm run ios

# Opens iOS simulator and runs app directly
```

### Option 3: Web Version (Limited Features)
```bash
npm run web

# Runs in browser at http://localhost:19006
# Note: SQLite doesn't work on web, so use this for UI testing only
```

### Option 4: Physical Device with Expo Go (Easiest)
```bash
npm start

# Scan QR code with Expo Go app
# Download from App Store (iOS) or Play Store (Android)
```

### Option 5: Native Build (Production)

#### Android APK
```bash
# Build standalone APK
eas build --platform android --local

# Or create development build
eas build --platform android --profile preview
```

#### iOS (requires Apple Developer account)
```bash
# Build for iOS
eas build --platform ios --local
```

## 🛠️ Build Scripts

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios

# Run on web (limited)
npm run web

# Build for production
eas build --platform android
eas build --platform ios
```

## ⚙️ Setup by Platform

### Android Emulator Setup

1. **Install Android Studio** from https://developer.android.com/studio
2. **Create Virtual Device**:
   - Open Android Studio → Device Manager
   - Click "Create device"
   - Select Pixel 4 or similar
   - Choose API level 30+
   - Finish

3. **Start Emulator**:
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_4_API_30

# Or launch from Android Studio
```

4. **Run App**:
```bash
npm run android
```

### iOS Simulator Setup (Mac only)

1. **Install Xcode** from App Store or https://developer.apple.com
2. **Start Simulator**:
```bash
# Open Xcode
open -a Simulator

# Or from command line
xcrun simctl list devices
xcrun simctl boot <device_udid>
```

3. **Run App**:
```bash
npm run ios
```

### Physical Android Device

1. **Enable Developer Mode**:
   - Settings → About Phone → Tap Build Number 7 times
   - Settings → Developer Options → Enable USB Debugging

2. **Connect via USB**:
```bash
adb devices  # Should show your device
```

3. **Run App**:
```bash
npm run android
```

### Physical iOS Device

1. **Connect via USB**
2. **Trust the computer** on device
3. **Run App**:
```bash
npm run ios
```

## 📁 Project Structure

