import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  useColorScheme
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTheme } from '../../themes/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'react-native-svg';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.logoContainer}>
        <View style={[styles.logoContainerback , { backgroundColor: theme.colors.acento }]} >
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Welcome!</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Thanks for joining! Access or create your account below, and get started on your journey.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.trainerButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => navigation.navigate('AuthStudent')}
        >
          <Text style={styles.buttonText}>Trainer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.accountButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('AuthStudent')}
        >AuthStudent
          <Text style={styles.buttonText}>My Account</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.themeToggle}
        onPress={toggleTheme}
      >
        <Text style={[styles.themeToggleText, { color: theme.colors.text }]}>
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoContainerback: {
    alignItems: 'center',
    backgroundColor: '#0F2B3D',
    borderRadius: 25,
  },
  logo: {
    width: 150,
    height: 150,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  trainerButton: {
    backgroundColor: '#34A853',
  },
  accountButton: {
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeToggle: {
    alignItems: 'center',
    padding: 10,
  },
  themeToggleText: {
    fontSize: 14,
  },
});

export default WelcomeScreen;
