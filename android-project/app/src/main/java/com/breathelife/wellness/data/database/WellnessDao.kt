package com.breathelife.wellness.data.database

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface WellnessDao {

    // Breathing
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBreathingSession(session: BreathingSessionEntity): Long

    @Query("SELECT * FROM breathing_sessions ORDER BY timestamp DESC")
    fun getAllBreathingSessions(): Flow<List<BreathingSessionEntity>>

    // Buteyko
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertButeykoMeasurement(measurement: ButeykoMeasurementEntity): Long

    @Query("SELECT * FROM buteyko_measurements ORDER BY timestamp DESC")
    fun getAllButeykoMeasurements(): Flow<List<ButeykoMeasurementEntity>>

    // Pomodoro
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPomodoroSession(session: PomodoroSessionEntity): Long

    @Query("SELECT * FROM pomodoro_sessions ORDER BY completedAt DESC")
    fun getAllPomodoroSessions(): Flow<List<PomodoroSessionEntity>>

    // Habits
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHabit(habit: HabitEntity): Long

    @Query("SELECT * FROM habits WHERE isArchived = 0 ORDER BY createdAt ASC")
    fun getActiveHabits(): Flow<List<HabitEntity>>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertHabitCompletion(completion: HabitCompletionEntity): Long

    @Query("DELETE FROM habit_completions WHERE habitId = :habitId AND dateString = :dateString")
    suspend fun deleteHabitCompletion(habitId: Long, dateString: String)

    @Query("SELECT * FROM habit_completions WHERE habitId = :habitId")
    fun getCompletionsForHabit(habitId: Long): Flow<List<HabitCompletionEntity>>
}

@Database(
    entities = [
        BreathingSessionEntity::class,
        ButeykoMeasurementEntity::class,
        PomodoroSessionEntity::class,
        HabitEntity::class,
        HabitCompletionEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun wellnessDao(): WellnessDao
}
