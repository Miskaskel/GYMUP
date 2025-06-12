import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  useColorScheme,
  TextInput,
  Alert,
} from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootTabAuthStudentList } from '../../navigation/AppNavigator';
import { useTheme } from '../../themes/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import  GoogleLoginButton  from '../../services/GoogleAuth';
import { signIn, signUp, signInWithGoogle } from "../../services/Auth"

type AuthenticationScreenStudentNavigationProp = StackNavigationProp<RootTabAuthStudentList, 'Authentication'>;

const AuthenticationScreenStudent = () => {
  const navigation = useNavigation<AuthenticationScreenStudentNavigationProp>();
  const { theme, isDark, toggleTheme } = useTheme();  
  // Estados para os campos de entrada
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Função para lidar com o login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        Alert.alert('Sucesso', result.message);
        navigation.navigate('StudentMain');
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com o registro
  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signUp(email, password);
      
      if (result.success) {
        Alert.alert('Sucesso', result.message);
        setIsSignUpMode(false); // Volta para o modo de login
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com o login do Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        Alert.alert('Sucesso', result.message);
        // O redirecionamento será feito automaticamente pelo Supabase
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={theme.colors.backgroundlinear as [string, string]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../../assets/images/logo.png')} 
                  style={styles.logo} 
                  resizeMode="contain"
                />
              </View>

              <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
                <View style={styles.contentTitle}>
                  <Text style={[styles.title, { color: theme.colors.text }]}>Login</Text>
                  <Text style={[styles.subtitle, { color: theme.colors.text }]}>
                    Fill out the information below in order to access your account
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
                  <TextInput 
                    style={[styles.button, { backgroundColor: theme.colors.inputBackground, color: theme.colors.accent }]}
                    placeholder="Email"
                    placeholderTextColor={theme.colors.accent}
                    value={email}
                    onChangeText={setEmail}
                  />

                  <TextInput 
                    style={[styles.button, { backgroundColor: theme.colors.inputBackground, color: theme.colors.accent }]}
                    placeholder="Password"
                    placeholderTextColor={theme.colors.accent}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />

                  <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} 
                    onPress={isSignUpMode ? handleSignUp : handleLogin}
                    disabled={isLoading}>
                    <Text style={[styles.subtitle, { color: theme.colors.text }]}>Login</Text>
                  </TouchableOpacity>

                  <View>
                    <GoogleLoginButton />
                  </View>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    justifyContent:'space-around',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white backgroun
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
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
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
});

export default AuthenticationScreenStudent;
