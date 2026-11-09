package com.breathelife.wellness.notifications

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            Log.d("BreatheLife", "Device reboot detected: rescheduling wellness alarms and reminders")
            // Reschedule WorkManager recurring reminders or exact alarms from Room DB
        }
    }
}
