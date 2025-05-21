import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { useBackend, Workout } from '../../api/BackendContext';
import { Ionicons } from '@expo/vector-icons';

const WorkoutItem = ({ workout, theme }: { workout: Workout, theme: any }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <TouchableOpacity 
      style={[styles.workoutItem, { backgroundColor: theme.colors.card }]}
      onPress={() => setExpanded(!expanded)}
    >
      <Text style={[styles.workoutName, { color: theme.colors.text }]}>{workout.name}</Text>
      <Text style={[styles.workoutDescription, { color: theme.colors.text }]}>{workout.description}</Text>
      
      {expanded && (
        <View style={styles.exercisesContainer}>
          <Text style={[styles.exercisesTitle, { color: theme.colors.text }]}>Exercícios:</Text>
          {workout.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <Text style={[styles.exerciseName, { color: theme.colors.text }]}>{exercise.name}</Text>
              <Text style={[styles.exerciseDetails, { color: theme.colors.text }]}>
                {exercise.sets} séries x {exercise.reps} repetições | Descanso: {exercise.rest}s
              </Text>
              {exercise.description && (
                <Text style={[styles.exerciseDescription, { color: theme.colors.text }]}>
                  {exercise.description}
                </Text>
              )}
            </View>
          ))}
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.actionButtonText}>Compartilhar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
            >
              <Text style={styles.actionButtonText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const StudentWorkouts = () => {
  const { theme } = useTheme();
  const { currentUser, getWorkoutsForUser } = useBackend();
  
  // Simulando um usuário atual para demonstração
  const userId = currentUser?.id || '1';
  const workouts = getWorkoutsForUser(userId);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WorkoutItem workout={item} theme={theme} />}
          contentContainerStyle={styles.workoutsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="fitness-outline" size={64} color={theme.colors.text} style={{opacity: 0.5, marginBottom: 20}} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Você ainda não tem treinos atribuídos. Peça ao seu treinador para adicionar treinos.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  workoutsList: {
    padding: 16,
  },
  workoutItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.8,
  },
  exercisesContainer: {
    marginTop: 8,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exerciseItem: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#34A853',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
  },
});

export default StudentWorkouts;
