# Google Play Store Release & Publication Checklist – BreatheLife

Complete every step before submitting your app to Google Play Store.

---

## Stage 1: Build & Packaging Verification

- [ ] Open `/android-project` in Android Studio Ladybug or later with JDK 17+.
- [ ] Run `./gradlew test` to execute unit tests.
- [ ] Execute `./gradlew assembleDebug` to test on a physical Android device or emulator.
- [ ] Verify that notification channels (`channel_breathing`, `channel_pomodoro`, `channel_habits`) appear in App Info > Notifications.
- [ ] Generate `breathelife-release.jks` and set signing environment variables.
- [ ] Execute `./gradlew bundleRelease` to generate the production `BreatheLife-release.aab`.

---

## Stage 2: Google Play Console Account Setup

- [ ] Complete Google Play Developer registration and 2-step verification.
- [ ] Create a new app:
  - App name: **BreatheLife – Breathing & Habits**
  - Default language: **English (United States)**
  - App or Game: **App**
  - Free or Paid: **Free**

---

## Stage 3: Store Listing Setup

- [ ] Copy short description (under 80 characters) from `documentation/PLAY_STORE_LISTING.md`.
- [ ] Copy full description from `documentation/PLAY_STORE_LISTING.md`.
- [ ] Upload **512x512 High-Res App Icon** from `play-store-assets/app-icon/`.
- [ ] Upload **1024x500 Feature Graphic** from `play-store-assets/feature-graphic/`.
- [ ] Upload at least 4 phone screenshots (1080x1920 or 1080x2400) from `play-store-assets/phone-screenshots/`.

---

## Stage 4: App Content & Policy Declarations

- [ ] **Privacy Policy:** Paste public URL hosting `documentation/PRIVACY_POLICY.md` (or `privacy-policy.html`).
- [ ] **Data Safety:** Complete the questionnaire using the exact answers in `documentation/GOOGLE_PLAY_DATA_SAFETY.md`.
- [ ] **Ads:** Select "No, my app does not contain ads".
- [ ] **App Access:** Select "All functionality is available without special access" (no login required for offline operation).
- [ ] **Content Rating:** Complete the IARC questionnaire (Rating: Everyone / PEGI 3).
- [ ] **Target Audience:** Select Ages 18 and over (or 13+) — "Not designed for children".
- [ ] **Health App Declaration:** Mark as general wellness / self-care app (not providing clinical medical diagnostics).

---

## Stage 5: Release Track & Rollout

- [ ] Under **Release** > **Testing** > **Closed testing** (or Internal testing), create a new release.
- [ ] Upload `BreatheLife-release.aab`.
- [ ] Enter release notes from `documentation/RELEASE_NOTES.md`.
- [ ] Review automated Pre-Launch Report (checking for layout crashes or strict mode violations).
- [ ] Promote to **Production** and submit for review.
