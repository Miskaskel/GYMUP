import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';

const TrainerDashboard = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Dashboard do Treinador</Text>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Meus Alunos</Text>
          <View style={styles.studentsList}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Você ainda não tem alunos. Adicione alunos para gerenciar seus treinos.
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.secondary }]}
            >
              <Text style={styles.buttonText}>Adicionar Aluno</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Treinos Disponíveis</Text>
          <View style={styles.workoutsList}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Nenhum treino criado ainda. Crie treinos para atribuir aos seus alunos.
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.secondary }]}
            >
              <Text style={styles.buttonText}>Criar Treino</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Atividade Recente</Text>
          <View style={styles.activityList}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Nenhuma atividade recente para mostrar.
            </Text>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Biblioteca de Exercícios</Text>
          <View style={styles.exercisesList}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Consulte a biblioteca de exercícios para criar treinos personalizados.
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.buttonText}>Acessar Biblioteca</Text>
            </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
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
  studentsList: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutsList: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityList: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exercisesList: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default TrainerDashboard;
