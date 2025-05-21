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
import { useBackend, User, Workout, Exercise } from '../../api/BackendContext';
import { Ionicons } from '@expo/vector-icons';

const StudentItem = ({ student, theme, onAssignWorkout }: { 
  student: User, 
  theme: any, 
  onAssignWorkout: (studentId: string) => void 
}) => {
  return (
    <View style={[styles.studentItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.studentInfo}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
        </View>
        <View style={styles.studentDetails}>
          <Text style={[styles.studentName, { color: theme.colors.text }]}>{student.name}</Text>
          <Text style={[styles.studentEmail, { color: theme.colors.text }]}>{student.email}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.assignButton, { backgroundColor: theme.colors.secondary }]}
        onPress={() => onAssignWorkout(student.id)}
      >
        <Text style={styles.assignButtonText}>Atribuir Treino</Text>
      </TouchableOpacity>
    </View>
  );
};

const TrainerStudents = () => {
  const { theme } = useTheme();
  const { currentUser, users, getStudentsForTrainer, addStudent, workouts, assignWorkout } = useBackend();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAssignWorkout, setShowAssignWorkout] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // Simulando um usuário atual para demonstração
  const trainerId = currentUser?.id || '3';
  const students = getStudentsForTrainer(trainerId);
  
  // Filtrar usuários com base na pesquisa
  const filteredUsers = users
    .filter(user => 
      user.type === 'student' && 
      !students.some(student => student.id === user.id) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.id.includes(searchQuery))
    );
  
  const handleAddStudent = (studentId: string) => {
    addStudent(trainerId, studentId);
    setShowAddStudent(false);
    setSearchQuery('');
  };
  
  const handleAssignWorkout = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowAssignWorkout(true);
  };
  
  const handleSelectWorkout = (workoutId: string) => {
    assignWorkout(workoutId, selectedStudentId);
    setShowAssignWorkout(false);
    setSelectedStudentId('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => setShowAddStudent(true)}
        >
          <Text style={styles.addButtonText}>+ Adicionar Aluno</Text>
        </TouchableOpacity>
      </View>
      
      {showAddStudent ? (
        <View style={styles.addStudentContainer}>
          <Text style={[styles.addStudentTitle, { color: theme.colors.text }]}>Adicionar Aluno</Text>
          
          <View style={[styles.searchContainer, { 
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder
          }]}>
            <TextInput
              style={[styles.searchInput, { color: theme.colors.inputText }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar por nome, email ou ID"
              placeholderTextColor={theme.colors.text + '80'}
            />
          </View>
          
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.searchResultItem, { backgroundColor: theme.colors.card }]}>
                <View style={styles.searchResultInfo}>
                  <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.searchResultDetails}>
                    <Text style={[styles.searchResultName, { color: theme.colors.text }]}>{item.name}</Text>
                    <Text style={[styles.searchResultEmail, { color: theme.colors.text }]}>{item.email}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: theme.colors.secondary }]}
                  onPress={() => handleAddStudent(item.id)}
                >
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptySearchContainer}>
                <Text style={[styles.emptySearchText, { color: theme.colors.text }]}>
                  {searchQuery.length > 0 
                    ? 'Nenhum aluno encontrado com esses termos de busca.' 
                    : 'Digite um nome, email ou ID para buscar alunos.'}
                </Text>
              </View>
            }
            contentContainerStyle={styles.searchResultsList}
          />
          
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowAddStudent(false)}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : showAssignWorkout ? (
        <View style={styles.assignWorkoutContainer}>
          <Text style={[styles.assignWorkoutTitle, { color: theme.colors.text }]}>
            Selecionar Treino
          </Text>
          
          <FlatList
            data={workouts.filter(workout => workout.createdBy === trainerId)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.workoutItem, { backgroundColor: theme.colors.card }]}
                onPress={() => handleSelectWorkout(item.id)}
              >
                <Text style={[styles.workoutName, { color: theme.colors.text }]}>{item.name}</Text>
                <Text style={[styles.workoutDescription, { color: theme.colors.text }]}>
                  {item.description}
                </Text>
                <Text style={[styles.workoutExercises, { color: theme.colors.text }]}>
                  {item.exercises.length} exercícios
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyWorkoutsContainer}>
                <Text style={[styles.emptyWorkoutsText, { color: theme.colors.text }]}>
                  Você ainda não criou nenhum treino. Crie treinos na seção "Treinos" para poder atribuí-los aos alunos.
                </Text>
              </View>
            }
            contentContainerStyle={styles.workoutsList}
          />
          
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setShowAssignWorkout(false);
              setSelectedStudentId('');
            }}
          >
            <Text style={styles.backButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {students.length > 0 ? (
            <FlatList
              data={students}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <StudentItem 
                  student={item} 
                  theme={theme} 
                  onAssignWorkout={handleAssignWorkout} 
                />
              )}
              contentContainerStyle={styles.studentsList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color={theme.colors.text} style={{opacity: 0.5, marginBottom: 20}} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                Você ainda não tem alunos. Use o botão "Adicionar Aluno" para começar a gerenciar seus alunos.
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
  studentsList: {
    padding: 16,
  },
  studentItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  assignButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignButtonText: {
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
  addStudentContainer: {
    flex: 1,
    padding: 16,
  },
  addStudentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchResultsList: {
    flexGrow: 1,
  },
  searchResultItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchResultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchResultDetails: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  searchResultEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptySearchContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptySearchText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  assignWorkoutContainer: {
    flex: 1,
    padding: 16,
  },
  assignWorkoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  workoutsList: {
    flexGrow: 1,
  },
  workoutItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 8,
    opacity: 0.8,
  },
  workoutExercises: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyWorkoutsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyWorkoutsText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
  },
});

export default TrainerStudents;
