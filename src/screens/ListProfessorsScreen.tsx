import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { getProfessores, deleteProfessor, updateProfessor } from '../services/api';

export const ListProfessorsScreen = ({ navigation }: any) => {
  const [professores, setProfessores] = useState<any[]>([]);

  const fetchProfessores = async () => {
    try {
      const data = await getProfessores();
      setProfessores(data);
    } catch (error) {
      console.log('Erro ao buscar professores.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfessores();
    });
    return unsubscribe;
  }, [navigation]);

  const handleChangeRole = (item: any) => {
    Alert.alert(
      'Alterar Perfil',
      `Deseja transformar ${item.name || item.nome} em Estudante (STUDENT)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await updateProfessor(item.id, {
                nome: item.name || item.nome,
                email: item.email,
                role: 'STUDENT',
              });
              Alert.alert('Sucesso', 'Perfil alterado para Estudante com sucesso!');
              fetchProfessores();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível alterar o perfil do usuário.');
            }
          },
        },
      ]
    );
  };

  const handleDelete = (id: string | number) => {
    Alert.alert('Confirmar Exclusão', 'Deseja realmente excluir este professor?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProfessor(id);
            Alert.alert('Sucesso', 'Professor excluído com sucesso.');
            fetchProfessores();
          } catch (error) {
            Alert.alert('Erro', 'Erro ao excluir professor.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Cadastrar Novo Professor"
        onPress={() => navigation.navigate('CreateEditProfessor')}
      />
      <FlatList
        data={professores}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name || item.nome}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.badge}>Função: {item.role}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.roleBtn} onPress={() => handleChangeRole(item)}>
                <Text style={styles.roleBtnText}>→ Virar Aluno</Text>
              </TouchableOpacity>
              <Button
                title="Editar"
                onPress={() => navigation.navigate('CreateEditProfessor', { professor: item })}
              />
              <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  card: {
    padding: 14,
    marginVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  name: { fontWeight: 'bold', fontSize: 16, color: '#0f172a' },
  email: { color: '#64748b', fontSize: 14, marginTop: 2 },
  badge: { fontSize: 12, color: '#4f46e5', fontWeight: '700', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 6, marginTop: 10, alignItems: 'center' },
  roleBtn: { backgroundColor: '#f59e0b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  roleBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
});

export default ListProfessorsScreen;