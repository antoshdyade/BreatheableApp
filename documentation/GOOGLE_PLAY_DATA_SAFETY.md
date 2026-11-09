# Google Play Data Safety Declaration – BreatheLife

This document details the exact questionnaire answers required when completing the **Data Safety** section in Google Play Console.

---

## 1. Data Collection and Security Overview

| Questionnaire Question | Declaration | Justification / Technical Details |
|---|---|---|
| **Does your app collect or share any user data?** | **No** | BreatheLife operates 100% offline. All breathing logs, habits, and Buteyko measurements reside solely in the local Room SQLite database on the user's device. No data is transmitted off the device. |
| **Is all user data collected by your app encrypted in transit?** | **Not Applicable / Yes** | The app does not transmit user data across external networks. |
| **Do you provide a way for users to request data deletion?** | **Yes** | Users can permanently delete all local data directly from the Settings screen or by uninstalling the application. |

---

## 2. Category-by-Category Declaration Table

| Data Category | Collected? | Shared? | Purpose | Handled Ephemerally? |
|---|---|---|---|---|
| **Personal Info (Name, Email, etc.)** | No | No | N/A | N/A |
| **Health & Fitness** | No (Processed Locally Only) | No | App functionality (Breathing records & educational pause checks stored in local SQLite only) | Stored locally until cleared by user |
| **Financial Info** | No | No | N/A | N/A |
| **Location** | No | No | N/A | N/A |
| **Photos and Videos** | No | No | N/A | N/A |
| **Audio Files** | No | No | N/A | N/A |
| **Files and Docs** | No | No | User-initiated local JSON export only | N/A |
| **App Activity** | No | No | N/A | N/A |
| **App Info and Performance** | No | No | N/A | N/A |
| **Device or other IDs** | No | No | N/A | N/A |

---

## 3. Play Console Form Submission Steps

1. Sign in to your [Google Play Console](https://play.google.com/console).
2. Select **BreatheLife** > Navigate to **Policy and programs** > **App content**.
3. Under **Data safety**, click **Start questionnaire**.
4. Select **No** to "Does your app collect or share any of the required user data types?".
5. Save and submit.
