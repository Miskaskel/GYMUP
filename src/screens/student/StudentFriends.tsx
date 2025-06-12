import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { AmizadeService, UsuarioService, Usuario } from '../../services/Servicos';
import { supabase } from '../../services/Supabase';

const FriendItem = ({ friend, theme, onRemove, onShareWorkout }: {
  friend: Usuario,
  theme: any,
  onRemove: (friendId: number) => void,
  onShareWorkout: (friendId: number) => void
}) => {
  return (
    <View style={[styles.friendItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.friendInfo}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>{friend.nome.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.friendDetails}>
          <Text style={[styles.friendName, { color: theme.colors.text }]}>{friend.nome}</Text>
          <Text style={[styles.friendEmail, { color: theme.colors.text }]}>{friend.email}</Text>
          <Text style={[styles.friendType, { color: theme.colors.text }]}>
            {friend.tipo === 'student' ? 'Aluno' : 'Treinador'}
          </Text>
        </View>
      </View>

      <View style={styles.friendActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="share-outline" size={16} color="white" />
          <Text style={styles.actionButtonText}>Compartilhar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.delbutton }]}>
          <Ionicons name="person-remove-outline" size={16} color="white" />
          <Text style={styles.actionButtonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StudentFriends = () => {
  const { theme } = useTheme();
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);
  const [friends, setFriends] = useState<Usuario[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Usuario[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carregar usuário atual e amigos
  useEffect(() => {
    loadCurrentUsuario();
  }, []);

  useEffect(() => {
    if (currentUsuario) {
      loadFriends();
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
          setCurrentUsuario({
            id: parseInt(user.id, 10), // Convertendo para number
            email: user.email || '',
            nome: user.user_metadata?.name || 'Usuário',
            tipo: 'student', // Assumindo tipo padrão
            // created_at: user.created_at, // Removido pois não existe no seu esquema
            // updated_at: new Date().toISOString() // Removido pois não existe no seu esquema
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário atual:', error);
    }
  };

  const loadFriends = async () => {
    if (!currentUsuario) return;

    try {
      const friendsList = await AmizadeService.getFriends(currentUsuario.id);
      setFriends(friendsList);
    } catch (error) {
      console.error('Erro ao carregar amigos:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    if (!currentUsuario) return;

    setLoading(true);
    try {
      const results = await UsuarioService.searchUsuarios(query, currentUsuario.id);
      // Filtrar usuários que já são amigos
      const filteredResults = results.filter(usuario =>
        !friends.some(friend => friend.id === usuario.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId: number) => {
    if (!currentUsuario) return;

    try {
      const success = await AmizadeService.sendFriendRequest(currentUsuario.id, friendId);
      if (success) {
        Alert.alert('Sucesso', 'Solicitação de amizade enviada!');
        setSearchQuery('');
        setSearchResults([]);
        setShowAddFriend(false);
      } else {
        Alert.alert('Erro', 'Não foi possível enviar a solicitação de amizade.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao enviar a solicitação.');
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    if (!currentUsuario) return;

    Alert.alert(
      'Remover Amigo',
      'Tem certeza que deseja remover este amigo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await AmizadeService.removeFriend(currentUsuario.id, friendId);
              if (success) {
                Alert.alert('Sucesso', 'Amigo removido com sucesso!');
                loadFriends(); // Recarregar lista de amigos
              } else {
                Alert.alert('Erro', 'Não foi possível remover o amigo.');
              }
            } catch (error) {
              Alert.alert('Erro', 'Ocorreu um erro ao remover o amigo.');
            }
          }
        }
      ]
    );
  };

  const handleShareWorkout = (friendId: number) => {
    // Implementar lógica de compartilhamento de treino
    Alert.alert('Compartilhar Treino', 'Funcionalidade de compartilhamento será implementada em breve!');
  };

  // Gerar um ID de usuário para compartilhamento
  const userQRValue = JSON.stringify({
    usuarioId: currentUsuario?.id,
    nome: currentUsuario?.nome || 'Usuário',
    email: currentUsuario?.email
  });

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
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="qr-code-outline" size={16} color="white" />
            <Text style={styles.headerButtonText}>Meu QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.colors.secondary }]}>
            <Ionicons name="person-add-outline" size={16} color="white" />
            <Text style={styles.headerButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showQRCode ? (
        <View style={styles.qrContainer}>
          <Text style={[styles.qrTitle, { color: theme.colors.text }]}>Meu QR Code</Text>
          <Text style={[styles.qrSubtitle, { color: theme.colors.text }]}>
            Compartilhe este código para que outros usuários possam te adicionar como amigo
          </Text>

          <View style={[styles.qrCodeBox, { backgroundColor: 'white', borderColor: theme.colors.border }]}>
            <QRCode
              value={userQRValue}
              size={200}
              color="black"
              backgroundColor="white"
            />
          </View>

          <Text style={[styles.userId, { color: theme.colors.text }]}>
            {currentUsuario.nome}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.text }]}>
            {currentUsuario.email}
          </Text>

          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : showAddFriend ? (
        <View style={styles.addFriendContainer}>
          <Text style={[styles.addFriendTitle, { color: theme.colors.text }]}>Adicionar Amigo</Text>

          <View style={[styles.searchContainer, {
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder
          }]}>
            <Ionicons name="search-outline" size={20} color={theme.colors.text} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.inputText }]}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Buscar por nome, email ou ID"
              placeholderTextColor={theme.colors.text + '80'}
            />
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: theme.colors.text }]}>Buscando...</Text>
            </View>
          )}

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()} // Convertendo number para string para keyExtractor
            renderItem={({ item }) => (
              <View style={[styles.searchResultItem, { backgroundColor: theme.colors.card }]}>
                <View style={styles.searchResultInfo}>
                  <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.avatarText}>{item.nome.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.searchResultDetails}>
                    <Text style={[styles.searchResultName, { color: theme.colors.text }]}>{item.nome}</Text>
                    <Text style={[styles.searchResultEmail, { color: theme.colors.text }]}>{item.email}</Text>
                    <Text style={[styles.searchResultType, { color: theme.colors.text }]}>
                      {item.tipo === 'student' ? 'Aluno' : 'Treinador'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.colors.secondary }]}>
                  <Ionicons name="person-add-outline" size={16} color="white" />
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptySearchContainer}>
                <Ionicons name="search-outline" size={48} color={theme.colors.text} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Text style={[styles.emptySearchText, { color: theme.colors.text }]}>
                  {searchQuery.length > 0
                    ? 'Nenhum usuário encontrado com esses termos de busca.'
                    : 'Digite um nome, email ou ID para buscar usuários.'}
                </Text>
              </View>
            }
            contentContainerStyle={styles.searchResultsList}
          />

          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {friends.length > 0 ? (
            <FlatList
              data={friends}
              keyExtractor={(item) => item.id.toString()} // Convertendo number para string para keyExtractor
              renderItem={({ item }) => (
                <FriendItem
                  friend={item}
                  theme={theme}
                  onRemove={handleRemoveFriend}
                  onShareWorkout={handleShareWorkout}
                />
              )}
              contentContainerStyle={styles.friendsList}
              refreshing={loading}
              onRefresh={loadFriends}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color={theme.colors.text} style={{ opacity: 0.5, marginBottom: 20 }} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                Você ainda não tem amigos adicionados. Use o botão "Adicionar" para buscar e adicionar amigos.
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
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  headerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  friendsList: {
    padding: 16,
  },
  friendItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendInfo: {
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
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  friendEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  friendType: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  friendActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
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
    fontSize: 16,
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
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  qrSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  qrCodeBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  userId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 30,
    opacity: 0.7,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addFriendContainer: {
    flex: 1,
    padding: 16,
  },
  addFriendTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
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
  searchResultType: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
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
});

export default StudentFriends;


