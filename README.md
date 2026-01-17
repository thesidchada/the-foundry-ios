# The Foundry - iOS App

A React Native/Expo iOS app for The Foundry health and wellness platform.

## Features

- **Dashboard**: Track daily protocols and health tasks
- **Bookings**: Schedule training, recovery, and specialist sessions
- **Tracker**: Monitor biomarkers and health metrics
- **Achievements**: Unlock milestones for health goals
- **Profile**: Manage account settings and connected devices

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS development: Mac with Xcode
- For iOS distribution: Apple Developer Account ($99/year)

## Getting Started

### 1. Install Dependencies

```bash
cd mobile-ios
npm install
```

### 2. Configure API URL

Set your Replit app URL as an environment variable:
```bash
export EXPO_PUBLIC_API_URL="https://your-app-name.replit.app"
```

Or edit `src/api/client.ts` and update the `API_BASE_URL` directly.

### 3. Run Development Server

```bash
npm start
```

This opens Expo Dev Tools. You can:
- Press `i` to open in iOS Simulator (Mac only)
- Scan QR code with Expo Go app on your iPhone

## Building for Production

### Using Expo EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure your project:
```bash
eas build:configure
```

4. Build for iOS:
```bash
npm run build:ios
```

5. Submit to App Store:
```bash
npm run submit:ios
```

### Local Build (Requires Mac + Xcode)

1. Generate native project:
```bash
npx expo prebuild --platform ios
```

2. Open in Xcode:
```bash
open ios/TheFoundry.xcworkspace
```

3. Build and archive from Xcode

## App Store Submission Checklist

- [ ] Update `app.json` with your Apple Developer Team ID
- [ ] Create App Store listing in App Store Connect
- [ ] Generate App Store screenshots (6.5" and 5.5" iPhone sizes)
- [ ] Write app description and keywords
- [ ] Set up privacy policy URL
- [ ] Configure in-app purchases (if applicable)
- [ ] Test on physical devices before submission

## Project Structure

```
mobile-ios/
├── App.tsx                 # Main app entry with navigation
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── src/
│   ├── api/
│   │   └── client.ts       # API client and endpoints
│   └── screens/
│       ├── DashboardScreen.tsx
│       ├── BookingsScreen.tsx
│       ├── TrackerScreen.tsx
│       ├── AchievementsScreen.tsx
│       └── ProfileScreen.tsx
└── assets/
    ├── icon.png            # App icon (1024x1024)
    ├── splash.png          # Splash screen
    └── adaptive-icon.png   # Android adaptive icon
```

## API Endpoints

The app connects to the same Replit backend as the web app:

- `GET /api/protocols/:date` - Get daily protocols
- `PATCH /api/protocols/:id` - Update protocol status
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `GET /api/metrics` - Get health metrics
- `GET /api/biomarkers` - Get biomarker data
- `GET /api/achievements` - Get unlocked achievements
- `GET /api/achievements/progress` - Get achievement progress
- `POST /api/achievements/check` - Check and unlock achievements
- `GET /api/auth/user` - Get current user

## Tech Stack

- **React Native** 0.76
- **Expo** SDK 52
- **React Navigation** - Bottom tab navigation
- **TanStack Query** - Data fetching and caching
- **Expo Secure Store** - Secure token storage
- **TypeScript** - Type safety

## Authentication

The app uses token-based authentication stored securely using `expo-secure-store`. Users authenticate via the web app first, then can use the mobile app.

## Support

For issues with the iOS app, check:
1. API URL is correctly configured
2. Backend server is running and accessible
3. Network connectivity from your device

For Expo-specific issues, visit: https://docs.expo.dev/
