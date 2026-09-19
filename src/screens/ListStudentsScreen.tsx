import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../services/api';

export default function ListStudentsScreen({ navigation }: any) {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const response = await api.get('/alunos');
    setStudents(response.data);
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/alunos/${id}`);
      Alert.alert('Sucesso', 'Estudante removido!');
      loadStudents();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir.');
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateEditStudent')}>
        <Text style={styles.btnText}>+ Cadastrar Estudante</Text>
      </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={{ flex: 1 }}>{item.name}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateEditStudent', { id: item.id })}>
              <Text style={styles.edit}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.delete}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addBtn: { backgroundColor: '#28a745', padding: 10, borderRadius: 6, marginBottom: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  itemRow: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', marginBottom: 8, borderRadius: 6 },
  edit: { color: 'blue', marginRight: 12 },
  delete: { color: 'red' },
});