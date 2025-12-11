"# 🌱 Plant Care App

A comprehensive mobile plant care application built with React Native that helps you manage your plants with local-first storage and optional cloud sync.

## ✨ Features Implemented

### Core Functionality
- ✅ **Add Plants**: Add plants with name, species, photo, watering frequency, and notes
- ✅ **Plant List**: View all your plants with thumbnail images and key details
- ✅ **Dashboard**: 
  - See plants that need watering today
  - View plants that need watering in 2-3 days
  - Quick water button for each plant
- ✅ **Search**: Search plants by name or species
- ✅ **Plant Details**: Comprehensive view with tabs for:
  - Overview (stats, watering schedule, care notes)
  - Watering History
  - Moments (photo gallery)
  - Goals
  - Growth Notes

### Advanced Features
- ✅ **Photo Capture**: 
  - Take photos with camera
  - Select from photo library
  - Automatic image compression (800x800, 70% quality)
  - Thumbnail generation (200x200)
- ✅ **Watering History**: Track every time you water your plant
- ✅ **Plant Moments**: Capture and save memorable moments of your plant's growth
- ✅ **Goals**: Set and track goals for each plant (e.g., "Grow 10cm", "First flower")
- ✅ **Growth Notes**: Keep detailed notes about your plant's progress
- ✅ **Timeline**: View all moments and goals in chronological order

### Technical Features
- ✅ **Local-First Architecture**: All data stored in SQLite database
- ✅ **Offline Support**: Works completely offline
- ✅ **Image Compression**: Optimized storage with compressed images
- ✅ **Pull-to-Refresh**: Refresh data on all screens
- ✅ **Beautiful UI**: Native-feeling design with smooth animations
- ✅ **Cross-Platform**: Works on iOS and Android

## 📱 How to Use

### Mobile App (Primary Platform)
1. **Install the app on your device** using the provided APK or IPA file, or run via development server.

### Testing on Emulator

### Testing on Physical Device
1. Install the app on your device (Android/iOS)
2. Run the app directly

## 🗂️ App Structure

```
frontend/
├─ apps/
│ ├─ web/ # React/SolidStart PWA
│ │  ├─ src/
│ │  │  ├─ app/ # routes, layouts, loaders
│ │  │  │  ├─ features/ # DDD aggregates
│ │  │  │  │  ├─ widgets/ # small composed UI units
│ │  │  │  │  ├─ pages/ # if Next-like
│ │  │  │  │  ├─ lib/ # adapters, hooks, utils
│ │  │  │  │  └─ styles/
│ │  ├─ public/ # static files
│ │  ├─ vite.config.ts
│ │  └─ workbox.config.ts
│ │
│ ├─ sw/ # Service Worker (Workbox injectManifest)
│ │  └─ src/sw.ts
│ │
│ ├─ worker-sync/ # Web Worker for sync/merge
│ │  └─ src/index.ts
│ ├─ admin/ # React/SolidStart PWA (optional internal admin console)
│ │  ├─ routes, layouts, loaders
│ │  ├─ feature folders (DDD aggregates)
│ │  ├─ small composed UI units
│ │  ├─ if Next-like
│ │  ├─ adapters, hooks, utils
│ │  ├─ icons, manifest.webmanifest, sw injection
│ │  └─ Service Worker (Workbox injectManifest)
│ │       # runtime caching, bg-sync, push
│ ├─ docs/ # Docusaurus/Docs site
│
├─ packages/
│  ├─ ui/ # UI components and shared logic
│  │  ├─ api-client/
│  │  ├─ shared/
│  │  ├─ config/
│  │  ├─ otel/
│  │  ├─ wasm/
│  │  │  ├─ core/
│  │  │  └─ image/
│  │  └─ tsconfig/
│  ├─ services/ # Backend services (language-agnostic)
│  │  ├─ gateway/
│  │  ├─ service-a/
│  │  ├─ service-b/
│  │  └─ reporting/
│  └─ infra/ # Infrastructure setup and configuration
│      ├─ terraform/ # Kubernetes manifests, Grafana dashboards
│      ├─ github-actions/ # CI/CD pipelines
│
├─ infra/
│  ├─ design-system/ # Design system (Radix + Tailwind + shadcn)
│  ├─ openapi/ # OpenAPI/GraphQL client (generated)
│  ├─ shared-types/ # Shared domain types & logic (pure TS)
│  ├─ eslint/ # ESLint, Prettier, tsconfig bases
│  ├─ opentelemetry/ # OpenTelemetry setup (browser + node)
│  ├─ rust-wasm/ # Rust crates compiled to WASM
│  ├─ conflict-resolution/ # conflict resolution, diff/merge
│  ├─ image-ml/ # image/ML-lite transforms (if needed)
│  ├─ project-references/
│  ├─ backend-services/ # Backend services (language-agnostic)
│  ├─ api-gateway/ # API Gateway/BFF (Node, Go, or Elixir)
│  ├─ cloud-infra/ # Cloud infra (VPC, DBs, queues, buckets)
│  ├─ helm-charts/ # Helm charts / manifests
│  └─ ci-cd/ # CI/CD pipelines
│
├─ tools/ # DX scripts, codegen, release tools
│   ├─ .turbo/
│   ├─ package.json
│   ├─ pnpm-workspace.yaml
│   └─ turbo.json
```

## 📊 Database Schema

### Plants Table

| Column Name | Data Type | Nullable | Default Value | Description |
|------------|----------|----------|--------------|-------------|
| id         | TEXT     | NOT NULL |               | Primary Key  |
| name       | TEXT     | NOT NULL |               | Plant Name   |
| species    | TEXT     | NOT NULL |               | Plant Species|
| added_date | TEXT     | NOT NULL |               | Added Date   |
| last_watered_date | TEXT | NULL |               | Last Watered Date  |
| watering_frequency | INTEGER | NOT NULL |               | Watering Frequency  |
| image_thumb | TEXT    | NULL     |               | Image Thumbnail  |
| notes      | TEXT    | NULL     |               | Plant Notes   |
| last_sync_date       | TEXT     | NOT NULL |               | Date        |
| sync_status | INTEGER | DEFAULT 0 |              | Sync Status (0: synced, 1: pending) |

### Watering History Table

| Column Name | Data Type | Nullable | Default Value | Description |
|------------|----------|----------|--------------|-------------|
| id         | TEXT     | NOT NULL |               | Primary Key  |
| plant_id   | TEXT     | NOT NULL |               | Plant ID    |
| watered_date | TEXT     | NOT NULL |               | Watering Date  |
| notes      | TEXT    | NULL     |               | Additional Notes |
| last_sync_date       | TEXT     | NOT NULL |               | Date        |
| sync_status | INTEGER | DEFAULT 0 |              | Sync Status (0: synced, 1: pending) |

### Moments Table

| Column Name | Data Type | Nullable | Default Value | Description |
|------------|----------|----------|--------------|-------------|
| id         | TEXT     | NOT NULL |               | Primary Key  |
| plant_id   | TEXT     | NOT NULL |               | Plant ID    |
| image      | BLOB     | NOT NULL |               | Image       |
| caption    | TEXT    | NULL     |               | Caption     |
| date       | TEXT     | NOT NULL |               | Date        |
| last_sync_date       | TEXT     | NOT NULL |               | Date        |
| sync_status | INTEGER | DEFAULT 0 |              | Sync Status (0: synced, 1: pending) |

### Goals Table

| Column Name | Data Type | Nullable | Default Value | Description |
|------------|----------|----------|--------------|-------------|
| id         | TEXT     | NOT NULL |               | Primary Key  |
| plant_id   | TEXT     | NOT NULL |               | Plant ID    |
| title      | TEXT     | NOT NULL |               | Goal Title  |
| description| TEXT    | NULL     |               | Description |
| target_date| TEXT    | NULL     |               | Target Date |
| completed  | INTEGER | DEFAULT 0 |              | Completed Status (0: not completed, 1: completed) |
| last_sync_date       | TEXT     | NOT NULL |               | Date        |
| sync_status | INTEGER | DEFAULT 0 |              | Sync Status (0: synced, 1: pending) |

### Plant Notes Table

| Column Name | Data Type | Nullable | Default Value | Description |
|------------|----------|----------|--------------|-------------|
| id         | TEXT     | NOT NULL |               | Primary Key  |
| plant_id   | TEXT     | NOT NULL |               | Plant ID    |
| note       | TEXT     | NOT NULL |               | Note        |
| date       | TEXT     | NOT NULL |               | Date        |
| last_sync_date       | TEXT     | NOT NULL |               | Date        |
| sync_status | INTEGER | DEFAULT 0 |              | Sync Status (0: synced, 1: pending) |

## 🚀 Future Features (Cloud Sync Ready)

The app is architected to support cloud sync with Firebase and Supabase:

### Planned Cloud Sync Features
- [ ] **Firebase Integration**
  - Google authentication
  - Firestore sync
  - Cloud storage for images
  
- [ ] **Supabase Integration**
  - PostgreSQL sync
  - Authentication
  - Storage bucket for images

- [ ] **Sync Settings**
  - Toggle sync on/off
  - Manual sync trigger
  - Auto-sync on network available
  - Conflict resolution (last-write-wins)

### Implementation Notes
- `sync_status` field already present in all tables (0: synced, 1: pending)
- Database architecture supports sync with minimal changes
- Ready for authentication layer (Google + Anonymous)

## 🔧 Technical Stack

- **Frontend**: React Native
- **Database**: SQLite
- **Navigation**: react-native Router (file-based routing)
- **Images**: react-native-image-picker + react-native-image-manipulator
- **Date Handling**: date-fns
- **Storage**: Local SQLite + AsyncStorage for settings

## 📝 Known Limitations

1. **Web Platform**: SQLite doesn't work on web - the app is designed for mobile only
2. **Cloud Sync**: Not yet implemented (architecture is ready)
3. **Authentication**: Not yet implemented (will be added with cloud sync)

## 🎨 Design Highlights

- **Green Theme**: Nature-inspired color palette (#4CAF50 primary)
- **Native Feel**: Platform-specific components and interactions
- **Touch-Friendly**: Minimum 44x44pt touch targets
- **Image Optimization**: Compressed images to save storage
- **Smooth Navigation**: Tab bar + stack navigation
- **Loading States**: Proper loading indicators everywhere
- **Empty States**: Helpful messages when no data exists

## 📱 Permissions Required

The app will request these permissions:
- **Camera**: For taking plant photos
- **Photo Library**: For selecting existing photos

## 🐛 Troubleshooting


## 🎯 Next Steps

To add cloud sync:
1. Install Firebase or Supabase SDK
2. Implement authentication (Google + Anonymous)
3. Create sync service that reads/writes based on `sync_status`
4. Add sync UI in settings
5. Implement conflict resolution logic

The architecture is ready - just needs the sync layer!

## 🕵️‍♂️ Issues Found (summary) — action items


## Quick verification checklist (run locally)
1. Install and type-check
   - npm install
   - npm run type-check
2. Start dev server and check logs
   - npm start
   - Watch terminal for missing assets or module not found errors
3. Run on emulator/device
   - npm run android  (or) npm run ios
   - Check runtime logs for DB errors when adding a plant
4. Run linter
   - npm run lint

## Critical quick fixes (apply first)
- Ensure assets folder contains icon/splash/fonts used by app.json and _layout.
- Run `tsc --noEmit` and fix type errors in utils/database.ts.
- Add permission checks before launching camera or image library in add.tsx.
- Validate DatabaseProvider initialization path and guard screens until isReady is true.

# Plant Care Tips

1. Watering: Ensure your plants are getting the right amount of water. Overwatering can be just as harmful as underwatering.
2. Lighting: Make sure your plants are receiving the appropriate amount of light for their specific needs.
3. Fertilizing: Use a balanced fertilizer to provide essential nutrients and promote healthy growth.
4. Pruning: Regularly prune your plants to remove dead or diseased parts, encouraging new growth and maintaining a neat appearance."