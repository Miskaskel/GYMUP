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
import { Ionicons } from '@expo/vector-icons';
import { ProfileCards } from '../../hooks/Profile/ProfileCards';
import { AndressCards } from '../../hooks/Profile/AndressCards';
import { MeasurementsCards} from '../../hooks/Profile/MeasurementsCards';
  
const StudentProfile = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER*/}
        <View style={[styles.header, {backgroundColor: theme.colors.primary}]} /** HEADER */>
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


        <ProfileCards/>
        <AndressCards/>
        <MeasurementsCards/>

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
    width:325,
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
  }
});

export default StudentProfile;