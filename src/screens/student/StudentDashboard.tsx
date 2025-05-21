import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';

const StudentDashboard = () => {

  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Meu Dashboard</Text>
          <TouchableOpacity 
            style={styles.themeToggle}
            onPress={toggleTheme}
            >
              <Text style={[styles.themeToggleText, { color: theme.colors.text }]}>
                  {isDark ? '☀️' : '🌙'}
              </Text>
          </TouchableOpacity>
         
          
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Treinos da Semana</Text>
          <View style={styles.workoutList}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Nenhum treino atribuído ainda. Peça ao seu treinador para adicionar treinos.
            </Text>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Minhas Metas</Text>
          <View style={styles.goalsList}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Você ainda não definiu metas. Adicione metas para acompanhar seu progresso.
            </Text>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Progresso</Text>
          <View style={styles.progressContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Comece a registrar seu progresso para ver gráficos aqui.
            </Text>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Amigos</Text>
          <View style={styles.friendsList}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Adicione amigos para compartilhar treinos e metas.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  themeToggle: {
    alignItems: 'flex-end',
    padding: 10,
  },
  themeToggleText: {
    fontSize: 18,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  workoutList: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsList: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsList: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  }
});

export default StudentDashboard;
