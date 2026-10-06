import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { createAluno, updateAluno } from '../services/api';

export const CreateEditStudentScreen = ({ route, navigation }: any) => {
  const aluno = route.params?.aluno;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (aluno) {
      setNome(aluno.nome);
      setEmail(aluno.email);
    }
  }, [aluno]);

  const handleSave = async () => {
    if (!nome || !email) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      if (aluno) {
        await updateAluno(aluno.id, { nome, email });
        Alert.alert('Sucesso', 'Aluno atualizado com sucesso.');
      } else {
        await createAluno({ nome, email });
        Alert.alert('Sucesso', 'Aluno cadastrado com sucesso.');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o registro.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{aluno ? 'Editar Aluno' : 'Novo Aluno'}</Text>
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

export default CreateEditStudentScreen;