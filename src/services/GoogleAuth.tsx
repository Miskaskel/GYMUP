import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
// Função que pode ser usada em outro lugar
export function loginWithGoogle() {
  console.log('Button pressed');
}

// Componente do botão
export default function GoogleLoginButton() {
  const { theme, isDark, toggleTheme } = useTheme(); 

  return (
    <View>
      <SimpleLineIcons.Button name="social-google"
        backgroundColor={theme.colors.inputBackground}
        color={theme.colors.text} // cor do texto do botão
        style={styles.button}
        onPress={loginWithGoogle}>
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
