import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { TreinoService, Treino, AmizadeService, Usuario, UsuarioService, TreinoExercicioDetail } from '../../services/Servicos';
import { supabase } from '../../services/Supabase';

const WorkoutItem = ({
  treino,
  theme,
  amigos,
  onShare,
  onDelete
}: {
  treino: Treino,
  theme: any,
  amigos: Usuario[],
  onShare: (treinoId: number, amigoId: number) => void,
  onDelete: (treinoId: number) => void
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = (amigoId: number) => {
    onShare(treino.id, amigoId);
    setShowShareModal(false);
  };

  return (
    <TouchableOpacity
      style={[styles.workoutItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.workoutHeader}>
        <View style={styles.workoutInfo}>
          <Text style={[styles.workoutName, { color: theme.colors.text }]}>{treino.nome}</Text>
          <Text style={[styles.workoutDescription, { color: theme.colors.text }]}>{treino.descricao}</Text>
          {treino.is_shared && (
            <View style={[styles.sharedBadge, { backgroundColor: theme.colors.secondary }]}>
              <Ionicons name="share-outline" size={12} color="white" />
              <Text style={styles.sharedText}>Compartilhado</Text>
            </View>
          )}
        </View>
        <Ionicons
          name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color={theme.colors.text}
          onPress={() => setExpanded(!expanded)}
        />
      </View>

      {expanded && (
        <View style={styles.exercisesContainer}>
          <Text style={[styles.exercisesTitle, { color: theme.colors.text }]}>Exercícios:</Text>
          {treino.exercises && treino.exercises.map((exercicio: TreinoExercicioDetail, index: number) => (
            <View key={exercicio.id.toString() + index} style={[styles.exerciseItem, { borderLeftColor: theme.colors.primary }]}>
              <Text style={[styles.exerciseName, { color: theme.colors.text }]}>{exercicio.nome}</Text>
              <Text style={[styles.exerciseDetails, { color: theme.colors.text }]}>
                {exercicio.series} séries x {exercicio.repeticoes} repetições
              </Text>
              <Text style={[styles.exerciseDetails, { color: theme.colors.text }]}>
                
              </Text>
              {exercicio.descricao && (
                <Text style={[styles.exerciseDescription, { color: theme.colors.text }]}>
                  {exercicio.descricao}
                </Text>
              )}
            </View>
          ))}

          <View style={styles.actionsContainer}>
            {amigos.length > 0 && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="share-outline" size={16} color="white" />
                <Text style={styles.actionButtonText}>Compartilhar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}>
              <Ionicons name="play-outline" size={16} color="white" />
              <Text style={styles.actionButtonText}>Iniciar</Text>
            </TouchableOpacity>

            {treino.is_shared && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.delbutton }]}>
                <Ionicons name="trash-outline" size={16} color="white" />
                <Text style={styles.actionButtonText}>Excluir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Modal de Compartilhamento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showShareModal}
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.shareModal}>
          <View style={[styles.shareModalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.shareModalTitle, { color: theme.colors.text }]}>
              Compartilhar com:
            </Text>
            <FlatList
              data={amigos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.friendShareItem, { borderBottomColor: theme.colors.border }]}>
                  <View style={[styles.friendAvatar, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.friendAvatarText}>{item.nome.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={[styles.friendShareName, { color: theme.colors.text }]}>{item.nome}</Text>
                </TouchableOpacity>
              )}
              style={styles.friendsList}
            />
            <TouchableOpacity
              style={[styles.cancelShareButton, { backgroundColor: theme.colors.border }]}>
              <Text style={[styles.cancelShareText, { color: theme.colors.text }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const StudentWorkouts = () => {
  const { theme } = useTheme();
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [amigos, setAmigos] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCurrentUsuario();
  }, []);

  useEffect(() => {
    if (currentUsuario) {
      loadTreinos();
      loadAmigos();
    }
  }, [currentUsuario]);

  const loadCurrentUsuario = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // ATENÇÃO: O ID do Supabase Auth é UUID (string), mas seu esquema de banco de dados usa INTEGER.
        // Você precisará garantir que o ID do usuário na sua tabela 'Usuario' seja um INTEGER
        // que corresponda ao ID do Supabase Auth (por exemplo, usando um mapeamento ou conversão no backend/BD).
        // Para fins de demonstração no frontend, estamos assumindo que o ID pode ser tratado como number.
        const usuarioProfile = await UsuarioService.getUsuarioProfile(parseInt(user.id, 10)); // Convertendo para number
        if (usuarioProfile) {
          setCurrentUsuario(usuarioProfile);
        } else {
          // Se o perfil não existir na tabela Usuario, pode ser necessário criá-lo
          console.warn('Perfil do usuário não encontrado na tabela Usuario. Considere criar um.');
          // Exemplo de como criar um perfil básico se não existir (ajuste conforme necessário)
          const newUsuario = {
            id: parseInt(user.id, 10),
            email: user.email || '',
            nome: user.user_metadata?.name || 'Usuário',
            tipo: 'student' as 'student', // conversão explícita para tipo literal
          };

          // await UsuarioService.createUsuario(newUsuario); // Você precisaria de um método createUsuario
          setCurrentUsuario(newUsuario);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário atual:', error);
    }
  };

  const loadTreinos = async () => {
    if (!currentUsuario) return;

    setLoading(true);
    try {
      const usuarioTreinos = await TreinoService.getUsuarioTreinos(currentUsuario.id);
      setTreinos(usuarioTreinos);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os treinos.');
    } finally {
      setLoading(false);
    }
  };

  const loadAmigos = async () => {
    if (!currentUsuario) return;

    try {
      const usuarioAmigos = await AmizadeService.getFriends(currentUsuario.id);
      setAmigos(usuarioAmigos);
    } catch (error) {
      console.error('Erro ao carregar amigos:', error);
    }
  };

  const handleShareWorkout = async (treinoId: number, amigoId: number) => {
    try {
      const success = await TreinoService.shareTreinoWithFriend(treinoId, amigoId);
      if (success) {
        Alert.alert('Sucesso', 'Treino compartilhado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível compartilhar o treino.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao compartilhar o treino.');
    }
  };

  const handleDeleteWorkout = async (treinoId: number) => {
    Alert.alert(
      'Excluir Treino',
      'Tem certeza que deseja excluir este treino?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await TreinoService.deleteTreino(treinoId);
              if (success) {
                Alert.alert('Sucesso', 'Treino excluído com sucesso!');
                loadTreinos(); // Recarregar lista de treinos
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o treino.');
              }
            } catch (error) {
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o treino.');
            }
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadTreinos(), loadAmigos()]);
    setRefreshing(false);
  };

  if (!currentUsuario) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Meus Treinos</Text>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text }]}>
            {treinos.length} treino{treinos.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {treinos.length > 0 ? (
        <FlatList
          data={treinos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <WorkoutItem
              treino={item}
              theme={theme}
              amigos={amigos}
              onShare={handleShareWorkout}
              onDelete={handleDeleteWorkout}
            />
          )}
          contentContainerStyle={styles.workoutsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
        >
          <Ionicons name="fitness-outline" size={64} color={theme.colors.text} style={{ opacity: 0.5, marginBottom: 20 }} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Você ainda não tem treinos atribuídos.
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.text }]}>
            Peça ao seu treinador para adicionar treinos ou puxe para baixo para atualizar.
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
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
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workoutInfo: {
    flex: 1,
    marginRight: 12,
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
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  sharedText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  exercisesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exerciseItem: {
    marginBottom: 12,
    paddingLeft: 12,
    borderLeftWidth: 3,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    marginBottom: 2,
    opacity: 0.8,
  },
  exerciseDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: '30%',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
  shareModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  shareModalContent: {
    width: '80%',
    maxHeight: '60%',
    borderRadius: 12,
    padding: 16,
  },
  shareModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  friendsList: {
    maxHeight: 200,
  },
  friendShareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendShareName: {
    fontSize: 16,
  },
  cancelShareButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelShareText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentWorkouts;


