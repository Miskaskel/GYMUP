import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { useBackend, Goal } from '../../api/BackendContext';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const GoalItem = ({ goal, theme, onUpdate }: { goal: Goal, theme: any, onUpdate: (goalId: string, value: number) => void }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newValue, setNewValue] = useState(goal.current.toString());
  
  const progress = Math.min(100, (goal.current / goal.target) * 100);
  
  const getGoalTypeLabel = (type: string) => {
    switch(type) {
      case 'weight': return 'Peso';
      case 'workout_frequency': return 'Frequência de Treinos';
      case 'measurements': return 'Medidas';
      case 'muscle_mass': return 'Massa Muscular';
      default: return type;
    }
  };
  
  const chartData = {
    labels: goal.history.slice(-5).map(h => {
      const date = new Date(h.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: goal.history.slice(-5).map(h => h.value),
        color: () => theme.colors.primary,
        strokeWidth: 2
      }
    ],
    legend: [`${getGoalTypeLabel(goal.type)}`]
  };
  
  return (
    <View style={[styles.goalItem, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.goalTitle, { color: theme.colors.text }]}>
        {getGoalTypeLabel(goal.type)}
      </Text>
      
      <View style={styles.goalDetails}>
        <Text style={[styles.goalText, { color: theme.colors.text }]}>
          Atual: {goal.current} {goal.unit}
        </Text>
        <Text style={[styles.goalText, { color: theme.colors.text }]}>
          Meta: {goal.target} {goal.unit}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? theme.colors.secondary : theme.colors.primary 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.text }]}>
          {progress.toFixed(1)}%
        </Text>
      </View>
      
      {goal.history.length > 1 && (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 80}
            height={180}
            chartConfig={{
              backgroundColor: theme.colors.card,
              backgroundGradientFrom: theme.colors.card,
              backgroundGradientTo: theme.colors.card,
              decimalPlaces: 1,
              color: () => theme.colors.text,
              labelColor: () => theme.colors.text,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: theme.colors.primary
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}
      
      <View style={[styles.containerButton]}>
        <TouchableOpacity 
          style={[styles.updateButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="reload-outline" size={25} color={theme.colors.text} style={{opacity: 0.5, marginRight:5}} />
          <Text style={styles.updateButtonText}>Atualizar Meta</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.DeleteButton, { backgroundColor: theme.colors.delbutton }]}
        >
          <Ionicons name="trash-outline" size={25} color={theme.colors.text} style={{opacity: 0.5, marginRight:5}} />
          <Text style={styles.DeleteButtonText}>Excluir Meta</Text>
        </TouchableOpacity>
      </View>
      
      
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Atualizar {getGoalTypeLabel(goal.type)}
            </Text>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.inputBackground,
                color: theme.colors.inputText,
                borderColor: theme.colors.inputBorder
              }]}
              value={newValue}
              onChangeText={setNewValue}
              keyboardType="numeric"
              placeholder={`Novo valor em ${goal.unit}`}
              placeholderTextColor={theme.colors.text + '80'}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.colors.secondary }]}
                onPress={() => {
                  const value = parseFloat(newValue);
                  if (!isNaN(value)) {
                    onUpdate(goal.id, value);
                    setModalVisible(false);
                  }
                }}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const StudentGoals = () => {
  const { theme } = useTheme();
  const { currentUser, getGoalsForUser, updateGoal, addGoal } = useBackend();
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'weight',
    target: '',
    unit: 'kg'
  });
  
  // Simulando um usuário atual para demonstração
  const userId = currentUser?.id || '1';
  const goals = getGoalsForUser(userId);
  
  const handleUpdateGoal = (goalId: string, value: number) => {
    updateGoal(goalId, value);
  };
  
  const handleAddGoal = () => {
    const target = parseFloat(newGoal.target);
    if (!isNaN(target)) {
      const goalId = Math.random().toString(36).substring(2, 9);
      addGoal({
        id: goalId,
        userId,
        type: newGoal.type as any,
        target,
        current: 0,
        unit: newGoal.unit,
        startDate: new Date().toISOString(),
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        history: [
          {date: new Date().toISOString(), value: 0}
        ]
      });
      setModalVisible(false);
      setNewGoal({
        type: 'weight',
        target: '',
        unit: 'kg'
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={30} color={theme.colors.text} style={{opacity: 0.5, marginRight:2}} />
          <Text style={styles.addButtonText}>Nova Meta</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.goalsList}>
        {goals.length > 0 ? (
          goals.map(goal => (
            <GoalItem 
              key={goal.id} 
              goal={goal} 
              theme={theme} 
              onUpdate={handleUpdateGoal} 
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color={theme.colors.text} style={{opacity: 0.5, marginBottom: 20}} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Você ainda não tem metas definidas. Adicione uma meta para acompanhar seu progresso.
            </Text>
          </View>
        )}
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Adicionar Nova Meta
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Tipo de Meta</Text>
              <View style={styles.typeButtons}>
                {['weight', 'workout_frequency', 'measurements', 'muscle_mass'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      newGoal.type === type && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setNewGoal({...newGoal, type})}
                  >
                    <Text 
                      style={[
                        styles.typeButtonText,
                        newGoal.type === type ? { color: 'white' } : { color: theme.colors.text }
                      ]}
                    >
                      {type === 'weight' ? 'Peso' : 
                       type === 'workout_frequency' ? 'Frequência' :
                       type === 'measurements' ? 'Medidas' : 'Massa Muscular'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Valor Alvo</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.inputText,
                  borderColor: theme.colors.inputBorder
                }]}
                value={newGoal.target}
                onChangeText={(value) => setNewGoal({...newGoal, target: value})}
                keyboardType="numeric"
                placeholder="Valor alvo"
                placeholderTextColor={theme.colors.text + '80'}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Unidade</Text>
              <View style={styles.unitButtons}>
                {['kg', 'cm', '%', 'vezes'].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitButton,
                      newGoal.unit === unit && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setNewGoal({...newGoal, unit})}
                  >
                    <Text 
                      style={[
                        styles.unitButtonText,
                        newGoal.unit === unit ? { color: 'white' } : { color: theme.colors.text }
                      ]}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.colors.secondary }]}
                onPress={handleAddGoal}
              >
                <Text style={styles.saveButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  containerButton:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    flex:1,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  goalsList: {
    padding: 16,
    paddingBottom: 32,
  },
  goalItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  chart: {
    borderRadius: 16,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 5,
    width: '50%', 
  },
  DeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 5,
    width: '50%',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  DeleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
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
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '48%',
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 14,
  },
  unitButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '23%',
    alignItems: 'center',
  },
  unitButtonText: {
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#34A853',
  },
  modalButtonText: {
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StudentGoals;
