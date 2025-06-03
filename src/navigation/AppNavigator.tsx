import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import StudentDashboard from '../screens/student/StudentDashboard';
import StudentWorkouts from '../screens/student/StudentWorkouts';
import StudentGoals from '../screens/student/StudentGoals';
import StudentFriends from '../screens/student/StudentFriends';
import TrainerDashboard from '../screens/trainer/TrainerDashboard';
import TrainerWorkouts from '../screens/trainer/TrainerWorkouts';
import TrainerStudents from '../screens/trainer/TrainerStudents';
import AuthenticationScreenStudent from '../screens/auth/AuthStudent';
import { useTheme } from '../themes/ThemeContext';
import StudentProfile from '../screens/student/StudentProfile';

// Definição dos tipos para a navegação
export type RootStackParamList = {
  Welcome: undefined;
  AuthStudent: undefined;
  StudentMain: undefined;
  TrainerMain: undefined;
};

export type RootTabAuthStudentList = {
  Authentication : undefined;
  StudentMain: undefined;
  TrainerMain: undefined;
};

export type StudentTabParamList = {
  Dashboard: undefined;
  Workouts: undefined;
  Friends: undefined;
  Goals: undefined;
  Profile: undefined;
};

export type TrainerTabParamList = {
  Dashboard: undefined;
  Workouts: undefined;
  Students: undefined;
  Create: undefined;
  Profile: undefined;
};



// Criação dos navegadores
const Stack = createStackNavigator<RootStackParamList>();
const AuthStudentStack = createStackNavigator<RootTabAuthStudentList>();
const StudentTab = createBottomTabNavigator<StudentTabParamList>();
const TrainerTab = createBottomTabNavigator<TrainerTabParamList>();

// Navegador para o fluxo de aluno
const StudentNavigator = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <StudentTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Goals') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <StudentTab.Screen name="Dashboard" component={StudentDashboard} />
      <StudentTab.Screen name="Workouts" component={StudentWorkouts} />
      <StudentTab.Screen name="Goals" component={StudentGoals} />
      <StudentTab.Screen name="Profile" component={StudentProfile} />
      <StudentTab.Screen name="Friends" component={StudentFriends} />
    </StudentTab.Navigator>
  );
};

// Navegador para o fluxo de treinador
const TrainerNavigator = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <TrainerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Students') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <TrainerTab.Screen name="Dashboard" component={TrainerDashboard} />
      <TrainerTab.Screen name="Workouts" component={TrainerWorkouts} />
      <TrainerTab.Screen name="Students" component={TrainerStudents} />
    </TrainerTab.Navigator>
  );
};

// Navegador principal do aplicativo
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AuthStudent" component={AuthenticationScreenStudent} />
      <Stack.Screen name="StudentMain" component={StudentNavigator} />
      <Stack.Screen name="TrainerMain" component={TrainerNavigator} />
 
    </Stack.Navigator>
  );
};

export default AppNavigator;
