# FactoryOps (Cross-Platform Mobile Challenge)

A robust, offline-first mobile application designed for shop floor operators to capture downtime events and supervisors to manage real-time alerts. Built with **React Native (Expo)**.

## How to Run

### Prerequisites
*   Node.js installed.
*   Expo Go app on your Android/iOS device (or Android Studio Emulator).

### Development Mode
1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Server:**
    ```bash
    npx expo start --tunnel
    ```
    *(Note: The `--tunnel` flag is recommended if running on an Android Emulator on Windows to avoid network firewall issues).*
    
4.  **Launch:** Scan the QR code with Expo Go or press `a` for Android Emulator.


### Offline & Sync Design (Architecture)

This app adheres to a strict "Offline First" philosophy:

⦁	Local-First Writes: When an Operator submits a downtime report or maintenance log, the data is immediately saved to a persistent local store (AsyncStorage via Zustand). It is never sent directly to the API first.

⦁	Queue System: Every event is tagged with isSynced: false. This effectively creates a local queue of pending items.

⦁	Auto-Sync Strategy: The app utilizes NetInfo to listen for network state changes. As soon as an internet connection is restored, the SyncService wakes up, iterates through unsynced items, pushes them to the backend, and marks them as synced locally.

⦁	User Feedback: The Home Dashboard features a reactive "Pending Upload" banner (Orange Badge), giving the user clear visibility into the sync status.

### State Management Choice

I chose Zustand for this project.

⦁	Why? It provides a clean, hook-based API without the boilerplate of Redux.

⦁	Persistence: Its built-in persist middleware made handling offline storage trivial. I could map specific stores (Auth, Machine Data, Downtime Events) to AsyncStorage with just a few lines of configuration.

⦁	Performance: Zustand uses a selector-based subscription model, ensuring that the Machine List only re-renders when machine data changes, not when unrelated state (like the camera form) updates.

### What I'd Ship Next

1.	Conflict Resolution: Implement server-side timestamp checking to handle scenarios where two operators edit the same machine status simultaneously (Last-Write-Wins or Manual Merge).

2.	Background Fetch: Integrate expo-background-fetch to trigger the sync service periodically even when the app is backgrounded, ensuring data is up-to-date when the user returns.

3.	Image Optimization: While I currently compress images using expo-image-manipulator, I would move this processing to a Web Worker or server-side function to keep the UI thread buttery smooth on lower-end Android devices.
