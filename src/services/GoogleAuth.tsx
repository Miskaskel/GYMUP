import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase } from '../services/Supabase'
// Função que pode ser usada em outro lugar
export function loginWithGoogle() {
  console.log('Button pressed');
}

// Componente do botão
export default function GoogleLoginButton() {
  const { theme, isDark, toggleTheme } = useTheme(); 
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '307953648432-1qi8vvct3cltj4nmickkujmnb45ts4ok.apps.googleusercontent.com'
  });

  useEffect(() => {
    const loginWithGoogle = async () => {
      if (response?.type === 'success') {
        const idToken = response.authentication?.idToken;
        if (!idToken) {
          console.error('ID Token não disponível!');
          return;
        }

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });

        if (error) {
          console.error('Erro Supabase:', error.message);
        } else {
          console.log('Usuário logado com sucesso:', data);
        }
      }
    };

    loginWithGoogle();
  }, [response]);

  return (
    <SimpleLineIcons.Button
      name="social-google"
      backgroundColor="#fff"
      onPress={() => {
        promptAsync();
      }}
    >
      <Text style={{ color: theme.colors.text }}>
        Login with Google
      </Text>
    </SimpleLineIcons.Button>
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
