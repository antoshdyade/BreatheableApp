package com.breathelife.wellness

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.breathelife.wellness.ui.theme.BreatheLifeTheme

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Dashboard", Icons.Default.Dashboard)
    object Breathing : Screen("breathing", "Breathe", Icons.Default.Air)
    object Buteyko : Screen("buteyko", "Buteyko", Icons.Default.Favorite)
    object Pomodoro : Screen("pomodoro", "Focus", Icons.Default.Timer)
    object Habits : Screen("habits", "Habits", Icons.Default.CheckCircle)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BreatheLifeTheme {
                val navController = rememberNavController()
                val screens = listOf(
                    Screen.Dashboard,
                    Screen.Breathing,
                    Screen.Buteyko,
                    Screen.Pomodoro,
                    Screen.Habits
                )

                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        NavigationBar {
                            screens.forEach { screen ->
                                NavigationBarItem(
                                    icon = { Icon(screen.icon, contentDescription = screen.title) },
                                    label = { Text(screen.title) },
                                    selected = currentRoute == screen.route,
                                    onClick = {
                                        navController.navigate(screen.route) {
                                            popUpTo(navController.graph.startDestinationId) {
                                                saveState = true
                                            }
                                            launchSingleTop = true
                                            restoreState = true
                                        }
                                    }
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Dashboard.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(Screen.Dashboard.route) {
                            Text("BreatheLife Dashboard Screen")
                        }
                        composable(Screen.Breathing.route) {
                            Text("BreatheLife Animated Breathing Screen")
                        }
                        composable(Screen.Buteyko.route) {
                            Text("BreatheLife Buteyko Training Screen")
                        }
                        composable(Screen.Pomodoro.route) {
                            Text("BreatheLife Pomodoro Focus Screen")
                        }
                        composable(Screen.Habits.route) {
                            Text("BreatheLife Daily Habits Screen")
                        }
                    }
                }
            }
        }
    }
}
