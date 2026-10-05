import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

export default function PostDetailScreen({ route, navigation }: any) {
  const { id } = route.params || {};
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const { signed } = useContext(AuthContext);

  useEffect(() => {
    async function getPost() {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${id}`);
        const data = response.data?.post || response.data?.data || response.data;
        setPost(data);
      } catch (error: any) {
        console.error('Erro ao carregar detalhes:', error);
        Alert.alert('Erro', 'Não foi possível carregar a publicação.');
      } finally {
        setLoading(false);
      }
    }
    if (id) getPost();
  }, [id]);

  function handleDeleteConfirm() {
    Alert.alert(
      'Excluir Post',
      'Tem certeza de que deseja remover esta publicação permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, Excluir', style: 'destructive', onPress: handleDelete }
      ]
    );
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await api.delete(`/posts/${id}`);
      Alert.alert('Sucesso', 'Post excluído com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.log('Erro ao excluir:', error.response?.data || error.message);
      let msg = 'Não foi possível excluir o post.';
      if (error.response?.data?.message) msg = error.response.data.message;
      Alert.alert('Erro de Exclusão', msg);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10, color: '#64748b' }}>Carregando publicação...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, color: '#ef4444', fontWeight: 'bold' }}>Postagem não encontrada.</Text>
        <TouchableOpacity style={{ marginTop: 12 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#4f46e5', fontWeight: 'bold' }}>← Voltar para os posts</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.badgeContainer}>
        <Text style={styles.badge}>Postagem Oficial</Text>
      </View>
      
      <Text style={styles.title}>{post?.title}</Text>
      
      <View style={styles.authorBox}>
        <Text style={styles.authorText}>
          Por: <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>{post?.author || 'Docente FIAP'}</Text>
        </Text>
      </View>
      
      <View style={styles.divider} />
      <Text style={styles.content}>{post?.content}</Text>

      {/* Exibe os botões de Edição e Exclusão se o professor estiver logado */}
      {signed && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('CreateEditPost', { id: post.id || post._id, post })}
            disabled={deleting}
          >
            <Text style={styles.actionButtonText}>✏️ Editar Post</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.actionButtonText}>🗑️ Excluir Post</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  backButton: { marginBottom: 16 },
  backButtonText: { color: '#4f46e5', fontWeight: '700', fontSize: 14 },
  badgeContainer: { marginBottom: 12 },
  badge: { backgroundColor: '#dcfce7', color: '#15803d', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a', lineHeight: 32, marginBottom: 12 },
  authorBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  authorText: { color: '#64748b', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 20 },
  content: { fontSize: 16, lineHeight: 26, color: '#334155' },
  actionsContainer: { marginTop: 30, gap: 10 },
  editButton: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 8, alignItems: 'center' },
  deleteButton: { backgroundColor: '#ef4444', padding: 14, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});