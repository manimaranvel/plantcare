# 🌱 Plant Care App - Installation Guide

## Prerequisites

- Node.js 16+ (https://nodejs.org)
- npm or yarn
- Git

## Installation Steps

### 1. Install Dependencies
```bash
cd /opt/www/react/plantcare
npm install
```

### 2. Fix Android/iOS Issues (if needed)
```bash
# Clear cache and reinstall
npm start --clear
```

### 3. Start Development Server
```bash
npm start
```

### 4. Choose Platform

**Android Emulator** (Recommended):
```bash
npm run android
```

**iOS Simulator** (Mac only):
```bash
npm run ios
```

**Web** (Limited features):
```bash
npm run web
```

**Expo Go** (Easy, no emulator):
- Install Expo Go app
- Scan QR code from terminal

## Common Issues

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
npm start --clear
```

### "Port already in use"
```bash
npm start -- --clear
```

### TypeScript errors
```bash
npm run type-check
```

## Success Indicators

✅ App launches without errors
✅ Dashboard shows empty state
✅ Can navigate between tabs
✅ Can add a new plant

## Next Steps

1. Add your first plant
2. Explore all features
3. Check troubleshooting if issues arise

Good luck! 🌿
