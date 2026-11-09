# Android Keystore & Play App Signing Guide – BreatheLife

This guide outlines how to generate a private release signing keystore and configure the Gradle build system for Google Play Store publication.

---

## 1. Generating a Production Release Keystore

Execute the following standard `keytool` command in your secure terminal:

```bash
keytool -genkeypair -v \
  -keystore breathelife-release.jks \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10000 \
  -alias breathelife
```

You will be prompted to enter:
- Keystore password (minimum 8 characters; store securely in a password manager)
- Your developer identity details (Name, Organization, City, Country)

---

## 2. Secure Credential Configuration (Do NOT Commit to Git)

Never hardcode your keystore passwords in source files or commit the `.jks` file to a public repository. The `android-project/app/build.gradle.kts` is pre-configured to read signing configuration from **environment variables** or a private `local.properties` file:

```bash
# In your local shell or CI/CD secret manager:
export KEYSTORE_PATH="/path/to/breathelife-release.jks"
export KEYSTORE_PASSWORD="yourKeystorePassword"
export KEY_ALIAS="breathelife"
export KEY_PASSWORD="yourKeyPassword"
```

Or add to `android-project/local.properties` (which is git-ignored):
```properties
keystore.path=/path/to/breathelife-release.jks
keystore.password=yourKeystorePassword
key.alias=breathelife
key.password=yourKeyPassword
```

---

## 3. Building Release Artifacts

Once credentials are set, run from the `android-project/` folder:

### A. Release Android App Bundle (AAB for Google Play)
```bash
./gradlew bundleRelease
```
Output location:
`app/build/outputs/bundle/release/app-release.aab` (Rename to `BreatheLife-release.aab`)

### B. Signed Release APK (For Direct Device Testing)
```bash
./gradlew assembleRelease
```
Output location:
`app/build/outputs/apk/release/app-release.apk` (Rename to `BreatheLife-release.apk`)

---

## 4. Google Play App Signing

1. When creating your app in Google Play Console, accept **Play App Signing** (recommended default).
2. Upload the signed `BreatheLife-release.aab` file.
3. Google Play will automatically generate optimized, device-specific APKs for end users signed with Google's secure master key.
