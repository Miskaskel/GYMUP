// components/ProfileCard.tsx

import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../themes/ThemeContext';
import { useProfileEditing } from './ProfileEditing';
import { useFocusEffect } from '@react-navigation/native';

export const ProfileCards = () => {
  const { theme } = useTheme();
  const {
    isEditingPerfil,
    setIsEditingPerfil,
    Celular,
    setCelular,
    Emergencia,
    setEmergencia,
    showPerfil,
    setShowPerfil,
  } = useProfileEditing();

  // Restaurar estados ao sair da aba
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsEditingPerfil(false);
        setShowPerfil(false);
      };
    }, [])
  );

  return (
    <View>
      {/* DADOS CADASTRAIS */}
      <View style={[styles.card, { backgroundColor: isEditingPerfil ? '#E6F0FF' : theme.colors.card }]}>
        <TouchableOpacity onPress={() => setShowPerfil(prev => !prev)}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Dados Cadastrais</Text>
            <Ionicons
              style={[styles.cardIcon, { color: theme.colors.primary }]}
              name={showPerfil ? 'chevron-down' : 'chevron-forward'}
              size={20}
            />
          </View>
        </TouchableOpacity>
        <View style={[styles.borda, { backgroundColor: theme.colors.border }]} />

        {showPerfil && (
          <View>
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
            {isEditingPerfil ? (
              <TextInput
                style={[styles.cardInfo, styles.inputEditing]}
                value={Celular}
                onChangeText={setCelular}
                placeholder="Digite o telefone 1"
                placeholderTextColor={theme.colors.primary}
              />
            ) : (
              <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{Celular}</Text>
            )}

            <Text style={[styles.cardSubtitle, { color: theme.colors.text }]}>Telefone 2</Text>
            {isEditingPerfil ? (
              <TextInput
                style={[styles.cardInfo, styles.inputEditing]}
                value={Emergencia}
                onChangeText={setEmergencia}
                placeholder="Digite o telefone 2"
                placeholderTextColor={theme.colors.primary}
              />
            ) : (
              <Text style={[styles.cardInfo, { color: theme.colors.text }]}>{Emergencia}</Text>
            )}

            <View style={styles.btncontainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.secondary }]}
                onPress={() => setIsEditingPerfil(prev => !prev)}
              >
                <Text style={styles.btnText}>{isEditingPerfil ? 'Salvar' : 'Alterar'}</Text>
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

export default ProfileCards;
