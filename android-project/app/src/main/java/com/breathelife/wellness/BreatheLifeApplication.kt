package com.breathelife.wellness

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class BreatheLifeApplication : Application() {

    companion object {
        const val CHANNEL_BREATHING_ID = "channel_breathing"
        const val CHANNEL_POMODORO_ID = "channel_pomodoro"
        const val CHANNEL_HABITS_ID = "channel_habits"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(NotificationManager::class.java)

            val breathingChannel = NotificationChannel(
                CHANNEL_BREATHING_ID,
                "Breathing & Mindfulness Reminders",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Gentle prompts for box breathing and Buteyko practice"
                enableVibration(true)
            }

            val pomodoroChannel = NotificationChannel(
                CHANNEL_POMODORO_ID,
                "Focus & Pomodoro Timer",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Sprint completions and break transition alerts"
                enableVibration(true)
            }

            val habitsChannel = NotificationChannel(
                CHANNEL_HABITS_ID,
                "Daily Habits & Wellness Routines",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Daily ritual checklists and habit streak reminders"
            }

            notificationManager.createNotificationChannels(
                listOf(breathingChannel, pomodoroChannel, habitsChannel)
            )
        }
    }
}
