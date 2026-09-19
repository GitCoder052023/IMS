# IMS — Inventory Management System

## Overview

**IMS (Inventory Management System)** is a fast, reliable, and beautifully crafted mobile application built to manage physical equipment and inventory without requiring an internet connection or backend account.

Whether tracking gym weights, sports gear, protective equipment, or general tools, IMS provides real-time stock status calculations, damage management, low-stock threshold alerts, and an immutable adjustment audit log.

# 🚀 Latest Release

> ## **IMS v1.0.0 — Production Release**
>
> The first production release of IMS is now available for Android.
>
> **📦 Download the APK**
>
> **[⬇️ Download IMS v1.0.0](https://github.com/GitCoder052023/IMS/releases/tag/v1.0.0)**
>
> `IMS-v1.0.0.apk`
>
> |                     |                      |
> | ------------------- | -------------------- |
> | **Version**         | `v1.0.0`             |
> | **Platform**        | Android              |
> | **Minimum Android** | Android 8.0+         |
> | **API Level**       | 26+                  |
> | **Build**           | Production           |
> | **Storage**         | 100% Local / Offline |

### Release Notes

**v1.0.0** is the initial production release of IMS, including:

* Complete inventory and equipment management
* Real-time stock availability calculations
* Damage and restoration workflows
* Low-stock threshold monitoring
* Inventory health metrics
* Needs-attention dashboard
* Complete immutable activity audit trail
* Search, filtering, sorting, category grouping, and pagination
* 100% offline-first local persistence
* Production-ready Android APK

**[View all releases →](https://github.com/GitCoder052023/IMS/releases)**

## Key Features

### Equipment & Stock Tracking

* Add, update, and categorize inventory with customizable units of measure (pieces, pairs, sets, boxes, kg, etc.).
* Set individual **minimum quantity thresholds** for automated low-stock warnings.
* Real-time calculations separating **total owned quantity** from **usable available stock**.

### Damage Tracking & Restoration

* Record broken/damaged items on the fly with custom issue notes.
* Dedicated restoration workflow: return repaired equipment back into active circulation with logged actions.

### 100% Offline-First Persistence

* Zero cloud reliance, no mandatory logins, and no tracking.
* Instant access and offline persistence backed by local storage.

### Dashboard & Health Metrics

* **Inventory Health Meter:** Live ratio of available items vs. threshold requirements.
* **Needs Attention Radar:** Pinpoints items that are out of stock, running low, or have damaged units.
* **Category Breakdown:** Proportional stock visualizer across all item categories.

### Complete Activity Audit Trail

* Chronological timeline tracking every action: initial intake, stock added/removed, damage recorded, and repairs completed.
* Detailed action notes and localized timestamps for audit-ready logs.

### Search, Filter & Pagination

* Fast client-side fuzzy search across item names, categories, and notes.
* Multi-status filtering (`In Stock`, `Low Stock`, `Out of Stock`, `Damaged`) and dynamic sorting.
* Category grouping with collapsible sections and pagination.

## Tech Stack

* **Framework:** [Expo (SDK 57)](https://expo.dev) + [React Native 0.86](https://reactnative.dev)
* **Routing:** [Expo Router (v57)](https://docs.expo.dev/router/introduction/) (File-based navigation)
* **Language:** TypeScript 6.0
* **State Management:** React Context API + Custom Provider Architecture
* **Storage:** React Native Async Storage (100% Local Persistence)
* **Icons:** Expo Vector Icons (Feather)
* **Safe Area & UI:** React Native Safe Area Context, Screens & Reanimated

---

## Project Structure

```text
IMS/
├── assets/                  # App icons, splash screens, and adaptive assets
├── src/
│   ├── app/                 # Expo Router file-based screens
│   │   ├── (tabs)/          # Main tab routes (Dashboard, Inventory, Settings)
│   │   ├── item/            # Item detail, creation, and editing routes
│   │   └── _layout.tsx      # Root provider and navigation stack
│   ├── components/
│   │   ├── inventory/       # Domain-specific components (Cards, Timelines, Metrics)
│   │   └── ui/              # Core design system primitives (Button, Card, Input, Modal)
│   ├── constants/            # Defaults for categories, units, and configuration
│   ├── context/              # InventoryContext state provider
│   ├── storage/              # Local offline persistence handlers
│   ├── theme/                # Design tokens (Colors, Radii, Shadows, Typography)
│   ├── types/                # TypeScript interfaces & domain models
│   └── utils/                # Inventory math, status calculations, and formatters
├── app.json                  # Expo configuration manifest
└── package.json              # Project dependencies and build scripts
```

## Getting Started

### Prerequisites

* Node.js (v18 or newer recommended)
* npm or yarn
* Expo Go app on your physical device or an Android Emulator / iOS Simulator

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/GitCoder052023/IMS.git
   cd IMS
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npx expo start
   ```

4. **Run on Android / iOS / Web:**

   * Press <kbd>a</kbd> for Android emulator / device
   * Press <kbd>i</kbd> for iOS simulator
   * Press <kbd>w</kbd> for Web browser

## Building the APK

To build a standalone production APK using EAS Build:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build Android APK (configured in eas.json)
eas build --platform android --profile preview
```

## License

This project is licensed under the [MIT License](LICENSE).