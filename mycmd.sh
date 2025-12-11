# stop any running packager / metro
# mac/linux:
pkill -f "react-native" || true
pkill -f "node" || true

# clear watchman (if installed)
watchman watch-del-all 2>/dev/null || true

# remove metro cache / temp
rm -rf /tmp/metro-* 2>/dev/null || true

# clear project caches & reinstall (optional but recommended if you saw other module issues)
# (only do full reinstall if you previously tried installs that failed)
rm -rf node_modules
rm -f package-lock.json yarn.lock
# then install
npm install   # or `yarn install`

# start Metro with reset cache
npx react-native start --reset-cache
# in a separate terminal run:
npx react-native run-android   # or `npm run android` / `yarn android`

