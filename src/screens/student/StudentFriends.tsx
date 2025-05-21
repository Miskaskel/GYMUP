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
import { useBackend, User } from '../../api/BackendContext';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const FriendItem = ({ friend, theme }: { friend: User, theme: any }) => {
  return (
    <View style={[styles.friendItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.friendInfo}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>{friend.name.charAt(0)}</Text>
        </View>
        <View style={styles.friendDetails}>
          <Text style={[styles.friendName, { color: theme.colors.text }]}>{friend.name}</Text>
          <Text style={[styles.friendEmail, { color: theme.colors.text }]}>{friend.email}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={styles.shareButtonText}>Compartilhar Treino</Text>
      </TouchableOpacity>
    </View>
  );
};

const StudentFriends = () => {
  const { theme } = useTheme();
  const { currentUser, users, getFriendsForUser, addFriend } = useBackend();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  
  // Simulando um usuário atual para demonstração
  const userId = currentUser?.id || '1';
  const friends = getFriendsForUser(userId);
  
  // Filtrar usuários com base na pesquisa
  const filteredUsers = users
    .filter(user => 
      user.id !== userId && 
      user.type === 'student' && 
      !friends.some(friend => friend.id === user.id) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.id.includes(searchQuery))
    );
  
  const handleAddFriend = (friendId: string) => {
    addFriend(userId, friendId);
    setShowAddFriend(false);
    setSearchQuery('');
  };
  
  // Gerar um ID de usuário para compartilhamento
  const userQRValue = JSON.stringify({ userId, name: currentUser?.name || 'Usuário' });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowQRCode(true)}
          >
            <Text style={styles.headerButtonText}>Meu QR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: theme.colors.secondary }]}
            onPress={() => setShowAddFriend(true)}
          >
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
            ID: {userId}
          </Text>
          
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowQRCode(false)}
          >
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
                  onPress={() => handleAddFriend(item.id)}
                >
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptySearchContainer}>
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
            style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowAddFriend(false)}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {friends.length > 0 ? (
            <FlatList
              data={friends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <FriendItem friend={item} theme={theme} />}
              contentContainerStyle={styles.friendsList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color={theme.colors.text} style={{opacity: 0.5, marginBottom: 20}} />
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  headerButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  },
  shareButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
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
    fontSize: 16,
    marginBottom: 30,
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
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
