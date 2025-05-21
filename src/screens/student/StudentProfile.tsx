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
  Modal,
  Image
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { useBackend, User } from '../../api/BackendContext';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const StudentProfile = () => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View /* HEADER */ style={[styles.header, {backgroundColor: theme.colors.primary}]}>
          <TouchableOpacity>
            <View style={styles.bordercontainer}>
              <View style={styles.imagecontainer}>
                <Image style={styles.imageProfile} 
                  source={require('../../../assets/images/logo.png')}
                />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.headerText]}>Mikael Cairo Vasconcelos Frota</Text>
          <Text style={[styles.headerText]}> #1</Text>
          <View style={[styles.btncontainer]}>
            <TouchableOpacity  style={[styles.buttonHeader, { backgroundColor: theme.colors.secondary }]}>
              <Text style={[styles.btnTextHeader]}>Alterar Senha</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View /* DADOS CADASTRAIS-HEADER */
           style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.cardHeader]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Dados Cadastrais</Text>
            <Text style={[styles.cardIcon]}>☀️</Text>  
          </View>
          <View style={[styles.borda, { backgroundColor: theme.colors.border }]}></View>
          
          <View /* DADOS CADASTRAIS INFO */>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Objetivo</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>Hipertrofia</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Nome</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>Mikael Cairo Vasconcelos Frota</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>CPF</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>000.000.000-00</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Email</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>mikael.vasconcelos04@gmail.com</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Data de Nascimento</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>24/03/2004</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Sexo</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>Masculino</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Telefone 1</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>(85) 9 9744-4969</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Telefone 2</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>(__) ______________</Text>
            
            <View style={[styles.btncontainer]}>
              <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.secondary }]}>
                <Text style={[styles.btnText]}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>  
        </View>

        <View /* DADOS CADASTRAIS-HEADER */
           style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.cardHeader]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Endereço</Text>
            <Text style={[styles.cardIcon]}>☀️</Text>  
          </View>
          <View style={[styles.borda, { backgroundColor: theme.colors.border }]}></View>
          
          <View /* DADOS CADASTRAIS INFO */>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>CEP</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>61648-310</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Endereço, Número</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>Rua Paraná, 2070</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Complemento</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>Apto 101, Bloco 01, Quadra 19</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Bairro</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>Jurema</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Cidade, Estado</Text>
            <Text style={[styles.cardInfo, { color: theme.colors.text }]}>Caucaia, CE</Text>
            
            <View style={[styles.btncontainer]}>
              <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.secondary }]}>
                <Text style={[styles.btnText]}>Alterar</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    borderRadius : 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight :'bold',
    marginBottom: 2,
    color : '#fff',
  },
  btncontainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    padding: 16,
    marginBottom: 0,
  },
  buttonHeader: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  button:{
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    width:400,
    alignItems:'center',
  },
  btnTextHeader:{
    color: '#fff',
    fontWeight: 'bold',
  },
  btnText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },
  bordercontainer:{
    height : 125,
    width  : 125,
    backgroundColor : '#000',
    borderRadius: 100,
    justifyContent: 'center',
    marginBottom: 15
  },
  imagecontainer:{
   alignItems: 'center'
  },
  imageProfile :{
    height : 120,
    width  : 120,
    backgroundColor : '#FFF',
    borderRadius: 100,
  },
  card: {
    position: 'relative',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize:16
  },
  borda: {
   height:5,
   marginBottom:10,
  },
  cardSubtitle:{
   marginBottom: 5,
   fontSize:13,
  },
  cardInfo:{
    fontSize:15,
    fontWeight: 'bold',
    marginBottom:5,
  },
  workoutList: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
   emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  }
});

export default StudentProfile;
