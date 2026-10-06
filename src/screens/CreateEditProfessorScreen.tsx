import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { createProfessor, updateProfessor } from '../services/api';

export const CreateEditProfessorScreen = ({ route, navigation }: any) => {
  const professor = route.params?.professor;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (professor) {
      setNome(professor.nome);
      setEmail(professor.email);
    }
  }, [professor]);

  const handleSave = async () => {
    if (!nome || !email) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      if (professor) {
        await updateProfessor(professor.id, { nome, email });
        Alert.alert('Sucesso', 'Professor atualizado com sucesso.');
      } else {
        await createProfessor({ nome, email });
        Alert.alert('Sucesso', 'Professor cadastrado com sucesso.');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o registro.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{professor ? 'Editar Professor' : 'Novo Professor'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 8 },
});

export default CreateEditProfessorScreen;