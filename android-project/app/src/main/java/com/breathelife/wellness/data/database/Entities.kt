package com.breathelife.wellness.data.database

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "breathing_sessions")
data class BreathingSessionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val patternId: String,
    val patternName: String,
    val durationSeconds: Int,
    val cyclesCompleted: Int,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "buteyko_measurements")
data class ButeykoMeasurementEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val controlPauseSeconds: Int,
    val maximumPauseSeconds: Int? = null,
    val pulseBefore: Int? = null,
    val pulseAfter: Int? = null,
    val notes: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "pomodoro_sessions")
data class PomodoroSessionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val taskTitle: String,
    val focusMinutes: Int = 25,
    val completedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "habits")
data class HabitEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val category: String,
    val targetDaysPerWeek: Int = 7,
    val colorHex: String = "#0d9488",
    val isArchived: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "habit_completions")
data class HabitCompletionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val habitId: Long,
    val dateString: String // "YYYY-MM-DD"
)
