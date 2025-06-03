import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  useColorScheme,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootTabAuthStudentList } from '../../navigation/AppNavigator';
import { useTheme } from '../../themes/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import  GoogleLoginButton  from '../../services/GoogleAuth';

type AuthenticationScreenStudentNavigationProp = StackNavigationProp<RootTabAuthStudentList, 'Authentication'>;

const AuthenticationScreenStudent = () => {
  const navigation = useNavigation<AuthenticationScreenStudentNavigationProp>();
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <LinearGradient 
      colors={theme.colors.backgroundlinear as [string, string]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
   >
      <SafeAreaView style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      
        <View style={styles.logoContainer}>
          <View>
            <Image 
              source={require('../../../assets/images/logo.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>
        </View>
      
        <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.contentTitle}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Login</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>
              Fill out the information below in order to acess your account
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button,{ backgroundColor: theme.colors.inputBackground }]}>
              <TextInput 
                style={[{color: theme.colors.text}]}
                placeholder="Email"
                placeholderTextColor={theme.colors.accent}></TextInput>
            </TouchableOpacity>
        
             <TouchableOpacity style={[styles.button,{ backgroundColor: theme.colors.inputBackground }]}>
              <TextInput 
                style={[{color: theme.colors.text}]}
                placeholder="Password"
                placeholderTextColor={theme.colors.accent}></TextInput>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button,{ backgroundColor: theme.colors.primary}]}>
              <Text style={[styles.subtitle, {color: theme.colors.text }]}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.buttonGoogle}>
              <GoogleLoginButton/>
            </TouchableOpacity>

          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    width: 200,
    height: 200,
  },
  contentContainer: {
    flex:1,
    borderRadius: 25,
    marginBottom: 80,
    alignItems: 'center',
    justifyContent:'space-evenly',
  },
  contentTitle:{
    alignItems:'center',
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
    width: '80%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardInfo: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
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
  buttonGoogle: {
    borderRadius: 25,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
  },
});

export default AuthenticationScreenStudent;
