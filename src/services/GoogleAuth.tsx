import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase } from '../services/Supabase'
// Função que pode ser usada em outro lugar
export function loginWithGoogle() {
  console.log('Button pressed');
}

// Componente do botão
export default function GoogleLoginButton() {
  const { theme, isDark, toggleTheme } = useTheme(); 
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '307953648432-1qi8vvct3cltj4nmickkujmnb45ts4ok.apps.googleusercontent.com',
  })

  return (
    <View>
      <SimpleLineIcons.Button name="social-google"
        backgroundColor={theme.colors.inputBackground}
        color={theme.colors.text} // cor do texto do botão
        style={styles.button}
        onPress={async () => {
              try {
                await GoogleSignin.hasPlayServices()
                const userInfo = await GoogleSignin.signIn()
                if (userInfo.data.idToken) {
                  const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                  })
                  console.log(error, data)
                } else {
                  throw new Error('no ID token present!')
                }
              } catch (error: any) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                  // user cancelled the login flow
                } else if (error.code === statusCodes.IN_PROGRESS) {
                  // operation (e.g. sign in) is in progress already
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                  // play services not available or outdated
                } else {
                  // some other error happened
                }
              }
            }}>
        <Text style={[styles.ButtonText, { color: theme.colors.text }]}>Login with Google</Text>
      </SimpleLineIcons.Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
  },
  ButtonText: {
    alignItems:'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
