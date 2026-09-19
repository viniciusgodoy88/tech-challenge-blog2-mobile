import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../services/api';

export default function CreateEditStudentScreen({ route, navigation }: any) {
  const id = route.params?.id;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/alunos/${id}`).then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
      });
    }
  }, [id]);

  async function handleSave() {
    try {
      if (id) {
        await api.put(`/alunos/${id}`, { name, email });
      } else {
        await api.post('/alunos', { name, email });
      }
      Alert.alert('Sucesso', 'Estudante salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o registro.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>E-mail</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 },
  button: { backgroundColor: '#28a745', padding: 12, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});