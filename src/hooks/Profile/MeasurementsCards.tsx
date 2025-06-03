import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../themes/ThemeContext';
import { useMeasurementsEditing } from './MeasurementsEditing';
import { useFocusEffect } from '@react-navigation/native';

export const MeasurementsCards = () => {
  const { theme } = useTheme();
  const {
    isEditingMeasurements,
    setIsEditingMeasurements,
    bracodireto,
    setBracoDireto,
    bracoesquerdo,
    setBracoEsquerdo,
    peitoral,
    setPeitoral,
    coxadireita,
    setCoxaDireita,
    coxaesquerda,
    setCoxaEsquerda,
    quadril,
    setQuadril,
    panturilhadireita,
    setPanturillhaDireita,
    panturilhaesquerda,
    setPanturillhaEsquerda,
    showMeasurements,
    setShowMeasurements,
  } = useMeasurementsEditing();

  // Restaurar estados ao sair da aba
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsEditingMeasurements(false);
        setShowMeasurements(false);
      };
    }, [])
  );

  return (
    <View>
      {/* DADOS ENDEREÇO */}
      <View style={[styles.card, { backgroundColor: isEditingMeasurements ? '#E6F0FF' : theme.colors.card }]}>
        <TouchableOpacity onPress={() => setShowMeasurements(prev => !prev)}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Medidas Corporais</Text>
            <Ionicons
              style={[styles.cardIcon, { color: theme.colors.primary }]}
              name={showMeasurements ? 'chevron-down' : 'chevron-forward'}
              size={20}
            />
          </View>
        </TouchableOpacity>
        <View style={[styles.borda, { backgroundColor: theme.colors.border }]} />

        {showMeasurements && (
          <View>
            <View style={[styles.cardContainer]}>
              <View>
                <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Braço Direito</Text>
                {isEditingMeasurements ? (
                  <TextInput style={[styles.cardInfo, styles.inputEditing]} value={bracodireto} onChangeText={setBracoDireto} />
                ) : (
                  <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{bracodireto}</Text>
                )}

                <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Braço Esquerdo</Text>
                {isEditingMeasurements ? (
                  <TextInput style={[styles.cardInfo, styles.inputEditing]} value={bracoesquerdo} onChangeText={setBracoEsquerdo} />
                ) : (
                  <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{bracoesquerdo}</Text>
                )}

                <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Peitoral</Text>
                {isEditingMeasurements ? (
                  <TextInput style={[styles.cardInfo, styles.inputEditing]} value={peitoral} onChangeText={setPeitoral} />
                ) : (
                  <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{peitoral}</Text>
                )}

                <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Quadril</Text>
                {isEditingMeasurements ? (
                  <TextInput style={[styles.cardInfo, styles.inputEditing]} value={quadril} onChangeText={setQuadril} />
                ) : (
                  <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{quadril}</Text>
                )}

                <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Coxa Direita</Text>
                {isEditingMeasurements ? (
                  <TextInput style={[styles.cardInfo, styles.inputEditing]} value={coxadireita} onChangeText={setCoxaDireita} />
                ) : (
                  <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{coxadireita}</Text>
                )}

                <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Coxa Esquerda</Text>
                {isEditingMeasurements ? (
                  <TextInput style={[styles.cardInfo, styles.inputEditing]} value={coxaesquerda} onChangeText={setCoxaEsquerda} />
                ) : (
                  <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{coxaesquerda}</Text>
                )}

                <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Panturrilha Direita</Text>
                {isEditingMeasurements ? (
                  <TextInput style={[styles.cardInfo, styles.inputEditing]} value={panturilhadireita} onChangeText={setPanturillhaDireita} />
                ) : (
                  <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{panturilhadireita}</Text>
                )}

                <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Panturrilha Esquerda</Text>
                {isEditingMeasurements ? (
                  <TextInput style={[styles.cardInfo, styles.inputEditing]} value={panturilhaesquerda} onChangeText={setPanturillhaEsquerda} />
                ) : (
                  <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{panturilhaesquerda}</Text>
                )}
              </View>
              <View>
               <Image
                  source={require('../../assets/corpo.png')}
                /> 
              </View>
            </View>

            {/*<View style={styles.btncontainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.secondary }]}
                onPress={() => setIsEditingMeasurements(prev => !prev)}
              >
                <Text style={styles.btnText}>{isEditingMeasurements ? 'Salvar' : 'Alterar'}</Text>
              </TouchableOpacity>
            </View>*/}
            
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  cardContainer:{
    flexDirection :'row'
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
    fontSize: 16,
  },
  borda: {
    height: 5,
    marginBottom: 10,
  },
  cardSubtitle: {
    marginBottom: 5,
    fontSize: 13,
  },
  cardInfo: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  inputEditing: {
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#E6F0FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  btncontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: 325,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default MeasurementsCards;
