// components/ProfileCard.tsx

import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../themes/ThemeContext';
import { useAndressEditing } from './AndressEditing';
import { useFocusEffect } from '@react-navigation/native';

export const AndressCards = () => {
  const { theme } = useTheme();
  const {
    isEditingAddress,
    setIsEditingAddress,
    cep,
    setCep,
    enderecoNumero,
    setEnderecoNumero,
    complemento,
    setComplemento,
    bairro,
    setBairro,
    cidadeEstado,
    setCidadeEstado,
    showAddress,
    setShowAddress,
  } = useAndressEditing();

  // Restaurar estados ao sair da aba
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsEditingAddress(false);
        setShowAddress(false);
      };
    }, [])
  );

  return (
    <View>
      {/* DADOS ENDEREÇO */}
      <View style={[styles.card, { backgroundColor: isEditingAddress ? '#E6F0FF' : theme.colors.card }]}>
        <TouchableOpacity onPress={() => setShowAddress(prev => !prev)}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Endereço</Text>
            <Ionicons
              style={[styles.cardIcon, { color: theme.colors.primary }]}
              name={showAddress ? 'chevron-down' : 'chevron-forward'}
              size={20}
            />
          </View>
        </TouchableOpacity>
        <View style={[styles.borda, { backgroundColor: theme.colors.border }]} />

        {showAddress && (
          <View>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>CEP</Text>
            {isEditingAddress ? (
              <TextInput style={[styles.cardInfo, styles.inputEditing]} value={cep} onChangeText={setCep} />
            ) : (
              <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{cep}</Text>
            )}

            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Endereço, Número</Text>
            {isEditingAddress ? (
              <TextInput style={[styles.cardInfo, styles.inputEditing]} value={enderecoNumero} onChangeText={setEnderecoNumero} />
            ) : (
              <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{enderecoNumero}</Text>
            )}

            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Complemento</Text>
            {isEditingAddress ? (
              <TextInput style={[styles.cardInfo, styles.inputEditing]} value={complemento} onChangeText={setComplemento} />
            ) : (
              <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{complemento}</Text>
            )}

            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Bairro</Text>
            {isEditingAddress ? (
              <TextInput style={[styles.cardInfo, styles.inputEditing]} value={bairro} onChangeText={setBairro} />
            ) : (
              <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{bairro}</Text>
            )}

            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Cidade, Estado</Text>
            {isEditingAddress ? (
              <TextInput style={[styles.cardInfo, styles.inputEditing]} value={cidadeEstado} onChangeText={setCidadeEstado} />
            ) : (
              <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{cidadeEstado}</Text>
            )}

            <View style={styles.btncontainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.secondary }]}
                onPress={() => setIsEditingAddress(prev => !prev)}
              >
                <Text style={styles.btnText}>{isEditingAddress ? 'Salvar' : 'Alterar'}</Text>
              </TouchableOpacity>
            </View>
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

export default AndressCards;
