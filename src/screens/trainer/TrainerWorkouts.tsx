import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { useBackend, Workout, Exercise } from '../../api/BackendContext';
import { Ionicons } from '@expo/vector-icons';

const WorkoutItem = ({ workout, theme, onEdit }: { 
  workout: Workout, 
  theme: any,
  onEdit: (workout: Workout) => void
}) => {
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
              onPress={() => onEdit(workout)}
            >
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const TrainerWorkouts = () => {
  const { theme } = useTheme();
  const { currentUser, workouts, addWorkout } = useBackend();
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    exercises: [] as Exercise[]
  });
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    id: '',
    name: '',
    sets: 3,
    reps: 12,
    rest: 60,
    description: ''
  });
  
  // Simulando um usuário atual para demonstração
  const trainerId = currentUser?.id || '3';
  const trainerWorkouts = workouts.filter(workout => workout.createdBy === trainerId);
  
  const handleAddExercise = () => {
    if (currentExercise.name.trim() === '') return;
    
    const exerciseId = Math.random().toString(36).substring(2, 9);
    const exercise = { ...currentExercise, id: exerciseId };
    
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, exercise]
    });
    
    setCurrentExercise({
      id: '',
      name: '',
      sets: 3,
      reps: 12,
      rest: 60,
      description: ''
    });
  };
  
  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...newWorkout.exercises];
    updatedExercises.splice(index, 1);
    setNewWorkout({
      ...newWorkout,
      exercises: updatedExercises
    });
  };
  
  const handleCreateWorkout = () => {
    if (newWorkout.name.trim() === '' || newWorkout.exercises.length === 0) return;
    
    const workoutId = Math.random().toString(36).substring(2, 9);
    
    addWorkout({
      id: workoutId,
      name: newWorkout.name,
      description: newWorkout.description,
      exercises: newWorkout.exercises,
      createdBy: trainerId,
      assignedTo: [],
      createdAt: new Date().toISOString()
    });
    
    setShowCreateWorkout(false);
    setNewWorkout({
      name: '',
      description: '',
      exercises: []
    });
  };
  
  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setNewWorkout({
      name: workout.name,
      description: workout.description,
      exercises: [...workout.exercises]
    });
    setShowCreateWorkout(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => {
            setEditingWorkout(null);
            setNewWorkout({
              name: '',
              description: '',
              exercises: []
            });
            setShowCreateWorkout(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Criar Treino</Text>
        </TouchableOpacity>
      </View>
      
      {showCreateWorkout ? (
        <ScrollView contentContainerStyle={styles.createWorkoutContainer}>
          <Text style={[styles.createWorkoutTitle, { color: theme.colors.text }]}>
            {editingWorkout ? 'Editar Treino' : 'Criar Novo Treino'}
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Nome do Treino</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.inputText,
                borderColor: theme.colors.inputBorder
              }]}
              value={newWorkout.name}
              onChangeText={(text) => setNewWorkout({...newWorkout, name: text})}
              placeholder="Ex: Treino de Pernas"
              placeholderTextColor={theme.colors.text + '80'}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Descrição</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.inputText,
                borderColor: theme.colors.inputBorder
              }]}
              value={newWorkout.description}
              onChangeText={(text) => setNewWorkout({...newWorkout, description: text})}
              placeholder="Descreva o objetivo e foco deste treino"
              placeholderTextColor={theme.colors.text + '80'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.exercisesSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Exercícios</Text>
            
            {newWorkout.exercises.length > 0 ? (
              <View style={styles.exercisesList}>
                {newWorkout.exercises.map((exercise, index) => (
                  <View key={index} style={[styles.exerciseListItem, { backgroundColor: theme.colors.card }]}>
                    <View style={styles.exerciseListItemContent}>
                      <Text style={[styles.exerciseListItemName, { color: theme.colors.text }]}>
                        {exercise.name}
                      </Text>
                      <Text style={[styles.exerciseListItemDetails, { color: theme.colors.text }]}>
                        {exercise.sets} séries x {exercise.reps} repetições | Descanso: {exercise.rest}s
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.removeExerciseButton}
                      onPress={() => handleRemoveExercise(index)}
                    >
                      <Ionicons name="close-circle" size={24} color={theme.colors.notification} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyExercisesContainer}>
                <Text style={[styles.emptyExercisesText, { color: theme.colors.text }]}>
                  Nenhum exercício adicionado. Adicione exercícios abaixo.
                </Text>
              </View>
            )}
            
            <View style={[styles.addExerciseForm, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.addExerciseTitle, { color: theme.colors.text }]}>
                Adicionar Exercício
              </Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Nome do Exercício</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.inputBackground,
                    color: theme.colors.inputText,
                    borderColor: theme.colors.inputBorder
                  }]}
                  value={currentExercise.name}
                  onChangeText={(text) => setCurrentExercise({...currentExercise, name: text})}
                  placeholder="Ex: Agachamento"
                  placeholderTextColor={theme.colors.text + '80'}
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Séries</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.inputBackground,
                      color: theme.colors.inputText,
                      borderColor: theme.colors.inputBorder
                    }]}
                    value={currentExercise.sets.toString()}
                    onChangeText={(text) => {
                      const sets = parseInt(text) || 0;
                      setCurrentExercise({...currentExercise, sets});
                    }}
                    keyboardType="numeric"
                    placeholder="3"
                    placeholderTextColor={theme.colors.text + '80'}
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Repetições</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.inputBackground,
                      color: theme.colors.inputText,
                      borderColor: theme.colors.inputBorder
                    }]}
                    value={currentExercise.reps.toString()}
                    onChangeText={(text) => {
                      const reps = parseInt(text) || 0;
                      setCurrentExercise({...currentExercise, reps});
                    }}
                    keyboardType="numeric"
                    placeholder="12"
                    placeholderTextColor={theme.colors.text + '80'}
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Descanso (segundos)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.inputBackground,
                    color: theme.colors.inputText,
                    borderColor: theme.colors.inputBorder
                  }]}
                  value={currentExercise.rest.toString()}
                  onChangeText={(text) => {
                    const rest = parseInt(text) || 0;
                    setCurrentExercise({...currentExercise, rest});
                  }}
                  keyboardType="numeric"
                  placeholder="60"
                  placeholderTextColor={theme.colors.text + '80'}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Descrição (opcional)</Text>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: theme.colors.inputBackground,
                    color: theme.colors.inputText,
                    borderColor: theme.colors.inputBorder
                  }]}
                  value={currentExercise.description}
                  onChangeText={(text) => setCurrentExercise({...currentExercise, description: text})}
                  placeholder="Instruções ou dicas para este exercício"
                  placeholderTextColor={theme.colors.text + '80'}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <TouchableOpacity 
                style={[styles.addExerciseButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleAddExercise}
              >
                <Text style={styles.addExerciseButtonText}>Adicionar Exercício</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.colors.border }]}
              onPress={() => setShowCreateWorkout(false)}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.colors.secondary }]}
              onPress={handleCreateWorkout}
            >
              <Text style={styles.saveButtonText}>
                {editingWorkout ? 'Salvar Alterações' : 'Criar Treino'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <>
          {trainerWorkouts.length > 0 ? (
            <FlatList
              data={trainerWorkouts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <WorkoutItem 
                  workout={item} 
                  theme={theme} 
                  onEdit={handleEditWorkout}
                />
              )}
              contentContainerStyle={styles.workoutsList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="fitness-outline" size={64} color={theme.colors.text} style={{opacity: 0.5, marginBottom: 20}} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                Você ainda não criou nenhum treino. Use o botão "Criar Treino" para começar a criar treinos para seus alunos.
              </Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
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
  createWorkoutContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  createWorkoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  exercisesSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exercisesList: {
    marginBottom: 20,
  },
  exerciseListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseListItemContent: {
    flex: 1,
  },
  exerciseListItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseListItemDetails: {
    fontSize: 14,
    opacity: 0.8,
  },
  removeExerciseButton: {
    padding: 4,
  },
  emptyExercisesContainer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyExercisesText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
  },
  addExerciseForm: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  addExerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addExerciseButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addExerciseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TrainerWorkouts;
