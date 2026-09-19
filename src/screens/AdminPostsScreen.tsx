import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

export default function AdminPostsScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const response = await api.get('/posts');
    setPosts(response.data);
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/posts/${id}`);
      Alert.alert('Sucesso', 'Post removido com sucesso!');
      loadPosts();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o post.');
    }
  }

  return (
    <View style={styles.container}>
      {/* Barra de Navegação Rápida */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtnPrimary} onPress={() => navigation.navigate('CreateEditPost')}>
          <Text style={styles.btnTextWhite}>+ Criar Post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtnSecondary} onPress={() => navigation.navigate('ListProfessors')}>
          <Text style={styles.btnTextDark}>Docentes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtnSecondary} onPress={() => navigation.navigate('ListStudents')}>
          <Text style={styles.btnTextDark}>Estudantes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Gerenciamento de Publicações</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemAuthor}>Autor: {item.author}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('CreateEditPost', { id: item.id })}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionTextDelete}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Text style={styles.logoutText}>Encerrar Sessão</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  navRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  navBtnPrimary: { flex: 1, backgroundColor: '#4f46e5', padding: 12, borderRadius: 10, alignItems: 'center' },
  navBtnSecondary: { flex: 1, backgroundColor: '#e2e8f0', padding: 12, borderRadius: 10, alignItems: 'center' },
  btnTextWhite: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  btnTextDark: { color: '#1e293b', fontWeight: '700', fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  itemCard: { flexDirection: 'row', backgroundColor: '#ffffff', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  itemAuthor: { fontSize: 12, color: '#64748b', marginTop: 2 },
  actionButtons: { flexDirection: 'row', gap: 6 },
  editBtn: { backgroundColor: '#e0e7ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  actionText: { color: '#4338ca', fontWeight: '700', fontSize: 12 },
  actionTextDelete: { color: '#dc2626', fontWeight: '700', fontSize: 12 },
  logoutBtn: { backgroundColor: '#ef4444', padding: 14, borderRadius: 10, marginTop: 12, alignItems: 'center' },
  logoutText: { color: '#ffffff', fontWeight: '700' },
});