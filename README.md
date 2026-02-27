# WorkSpace RN 🏢
### React Native Workspace Booking App

---

## 📱 Screens (Pages)

| Screen | Description |
|--------|-------------|
| 🏠 Home | Hero section, search card, stats, bookings, rooms |
| 🔍 Explore | Search + filter chips + all rooms grid |
| 📋 Bookings | 3 tabs: Upcoming / Past / Cancelled |
| 🔔 Notifications | Notification list with unread indicators |
| 👤 Profile | User profile + stats + menu |
| 📄 Booking Detail | Full booking details + cancel/edit |
| 🗓️ Book Room | Date, time slots, participants, amenities, note |
| ✅ Review | Summary + confirm button |
| 🎉 Success | Animated success with booking ID |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio (Android) OR Xcode (iOS)

### Step 1 — Install Dependencies
```bash
cd WorkSpaceRN
npm install
```

### Step 2 — iOS (Mac only)
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Step 3 — Android
```bash
npx react-native run-android
```

### Step 4 — Metro Server (if needed)
```bash
npx react-native start
```

---

## 📦 Dependencies Used

| Package | Purpose |
|---------|---------|
| `@react-navigation/native` | Navigation core |
| `@react-navigation/bottom-tabs` | Bottom tab bar |
| `@react-navigation/native-stack` | Stack navigation |
| `react-native-linear-gradient` | Gradient backgrounds |
| `@react-native-community/datetimepicker` | Date & time picker |
| `react-native-safe-area-context` | Safe area handling |
| `react-native-screens` | Native screen optimization |
| `react-native-animatable` | Animations |
| `react-native-vector-icons` | Icons (optional) |

---

## 🗂️ Project Structure

```
WorkSpaceRN/
├── App.js                          ← Entry point
├── package.json
├── babel.config.js
└── src/
    ├── theme/
    │   └── index.js                ← Colors, Gradients, Shadows
    ├── data/
    │   └── index.js                ← All sample data + helpers
    ├── components/
    │   └── Shared.js               ← Reusable UI components
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── ExploreScreen.js
    │   ├── BookingsScreen.js
    │   ├── BookingDetailScreen.js
    │   ├── BookRoomScreen.js
    │   ├── ReviewScreen.js
    │   ├── SuccessScreen.js
    │   ├── NotificationsScreen.js
    │   └── ProfileScreen.js
    └── navigation/
        └── AppNavigator.js         ← Tab + Stack navigator
```

---

## 🎨 Design Features

- ✅ Gradient hero sections (blue → dark blue)
- ✅ Floating search card with bottom sheets
- ✅ Native Date Picker
- ✅ Horizontal time slot picker
- ✅ Amenity chip toggles
- ✅ Animated success screen (spring bounce)
- ✅ Custom bottom tab bar with active indicators
- ✅ Status badges (confirmed / pending / cancelled)
- ✅ Avatar stacks with gradient colors
- ✅ Room thumbnails with theme gradients
- ✅ Safe area handling (notch / home bar)
- ✅ Shadows & elevation throughout
- ✅ Filter chips in Explore screen

---

## 🔄 Complete Booking Flow

```
Home → Book Room → Select Date/Time → Participants → Amenities → Review → [1.8s loading] → Success ✅
```

---

## 🛠️ Customization

**Colors** → `src/theme/index.js` → `Colors` object

**Data** → `src/data/index.js` → ROOMS, BOOKINGS, BRANCHES, etc.

**Add Screen** → Create in `src/screens/` → Add to `AppNavigator.js`

---

*Made with ❤️ | React Native 0.73*
