import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Definição dos temas claro e escuro
export const lightTheme = {
  colors: {
    primary: '#2BAE66',
    secondary: '#007BFF',
    acento: '#6B3BCC',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#212121',
    border: '#E0E0E0',
    notification: '#FF5252',
    accent: '#00C853',
    buttonPrimary: '#4285F4',
    buttonSecondary: '#34A853',
    buttonText: '#FFFFFF',
    inputBackground: '#F5F5F5',
    inputText: '#212121',
    inputBorder: '#E0E0E0',
    delbutton : '#FF6B6B',
  },
};

export const darkTheme = {
  colors: {
    primary: '#1F8C53',
    secondary: '#005FC1',
    acento: '#6B3BCC',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#333333',
    notification: '#FF5252',
    accent: '#00C853',
    buttonPrimary: '#4285F4',
    buttonSecondary: '#34A853',
    buttonText: '#FFFFFF',
    inputBackground: '#333333',
    inputText: '#FFFFFF',
    inputBorder: '#444444',
    delbutton: '#B32222',
  },
};

// Criação do contexto de tema
type ThemeContextType = {
  theme: typeof lightTheme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

// Hook personalizado para usar o tema
export const useTheme = () => useContext(ThemeContext);

// Provedor de tema
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDark, setIsDark] = useState(deviceTheme === 'dark');

  // Atualiza o tema quando o tema do dispositivo mudar
  useEffect(() => {
    setIsDark(deviceTheme === 'dark');
  }, [deviceTheme]);

  // Função para alternar entre temas
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
