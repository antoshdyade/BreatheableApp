# BreatheLife – Complete Breathing, Buteyko, Meditation & Habit App

An all-in-one digital wellness and productivity application written in modern Kotlin and Jetpack Compose (Material Design 3), backed by Room Database, Kotlin Coroutines Flow, and offline DataStore.

## Key Features

- **Breathing Library & Dynamic Orb**: Box Breathing, 4-7-8, Diaphragmatic, Coherent 5-5, Equal breathing with customizable cycle countdown and synthesized bells.
- **Educational Buteyko Training Module**: Non-diagnostic Control Pause (CP) testing, pulse logging, safety notes, and journal history.
- **Pomodoro Focus Timer**: 25m Focus / 5m Break / 15m Long Break cycles with auto transitions and task management.
- **Habit Consistency Engine**: Daily check-offs, streaks, best streak records, and 7-day consistency calendar heatmaps.
- **Meditation & Soundscapes**: Guided, body scan, and silent timers with soothing ambient audio.
- **Offline & Private**: All data stored locally on device without tracking or unauthorized cloud sync.

## Project Structure

```
android-project/
  app/
    src/main/
      java/com/breathelife/wellness/
        BreatheLifeApplication.kt
        MainActivity.kt
        data/
          database/ (Room AppDatabase, WellnessDao, Entities)
        notifications/ (BootReceiver, Channel setup)
        ui/
          theme/ (Material Design 3 themes)
      res/
        values/ (strings, colors)
      AndroidManifest.xml
    build.gradle.kts
  gradle/
    libs.versions.toml
  settings.gradle.kts
  build.gradle.kts
```

## How to Build in Android Studio

1. Open Android Studio (Ladybug / Koala or newer with JDK 17+).
2. Choose **Open an Existing Project** and select the `/android-project` folder.
3. Allow Gradle to sync dependencies.
4. Run or debug on an emulator or connected Android device:
   ```bash
   ./gradlew assembleDebug
   ```
5. To generate a signed release AAB for Google Play:
   ```bash
   ./gradlew bundleRelease
   ```
