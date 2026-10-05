import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

export default function CreateEditPostScreen({ route, navigation }: any) {
  const id = route.params?.id || route.params?.post?.id || route.params?.post?._id;
  const postParam = route.params?.post;

  const [title, setTitle] = useState(postParam?.title || '');
  const [author, setAuthor] = useState(postParam?.author || '');
  const [content, setContent] = useState(postParam?.content || '');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Se for um novo post e o autor estiver vazio, preenche com o usuário logado
    if (!id && !author) {
      setAuthor(user?.name || user?.email || 'Docente FIAP');
    }

    // Se possui ID mas não veio o objeto completo pelos parâmetros, busca do servidor
    if (id && !postParam) {
      setFetching(true);
      api.get(`/posts/${id}`)
        .then((res) => {
          const data = res.data?.post || res.data?.data || res.data;
          setTitle(data.title || '');
          setAuthor(data.author || user?.name || user?.email || 'Docente FIAP');
          setContent(data.content || '');
        })
        .catch((err) => {
          console.error('Erro ao buscar post:', err);
          Alert.alert('Erro', 'Não foi possível carregar os dados da publicação.');
        })
        .finally(() => setFetching(false));
    }
  }, [id]);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o título e o conteúdo do post.');
      return;
    }

    try {
      setLoading(true);

      // Garante que o Token JWT esteja anexado à requisição
      const storedToken = await AsyncStorage.getItem('@blog_token');
      if (storedToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }

      // Payload compatível tanto com 'author' (string) quanto com relacionamentos Prisma ('authorId' / 'professorId')
      const authorName = author.trim() || user?.name || user?.email || 'Docente FIAP';
      const userId = user?.id || user?._id;

      const payload: any = {
        title: title.trim(),
        content: content.trim(),
        author: authorName,
      };

      // Inclui o ID numérico/UUID do usuário se existir no objeto user
      if (userId) {
        payload.authorId = userId;
        payload.professorId = userId;
      }

      console.log('--- ENVIANDO PAYLOAD PARA /POSTS ---');
      console.log(JSON.stringify(payload, null, 2));
      console.log('------------------------------------');

      if (id) {
        await api.put(`/posts/${id}`, payload);
        Alert.alert('Sucesso', 'Post atualizado com sucesso!');
      } else {
        await api.post('/posts', payload);
        Alert.alert('Sucesso', 'Post criado com sucesso!');
      }

      navigation.goBack();
    } catch (error: any) {
      console.log('--- ERRO DETALHADO AO SALVAR POST ---');
      console.log('Status HTTP:', error.response?.status);
      console.log('Corpo da Resposta:', error.response?.data);
      console.log('Mensagem:', error.message);
      console.log('------------------------------------');

      let msg = 'Ocorreu um erro ao salvar o post.';
      
      if (error.response?.data?.message) {
        msg = Array.isArray(error.response.data.message)
          ? error.response.data.message.join('\n')
          : error.response.data.message;
      } else if (error.response?.data?.error) {
        msg = error.response.data.error;
      } else if (error.response?.status === 401) {
        msg = 'Sessão expirada. Por favor, faça login novamente.';
      }

      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 12, color: '#64748b' }}>Carregando publicação...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={{ flex: 1, backgroundColor: '#ffffff' }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.headerTitle}>{id ? '✏️ Editar Post' : '✍️ Novo Post'}</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite o título do artigo..." 
          placeholderTextColor="#94a3b8"
          value={title} 
          onChangeText={setTitle} 
        />

        <Text style={styles.label}>Autor</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Nome do autor..." 
          placeholderTextColor="#94a3b8"
          value={author} 
          onChangeText={setAuthor} 
        />

        <Text style={styles.label}>Conteúdo</Text>
        <TextInput 
          style={[styles.input, { height: 160 }]} 
          placeholder="Escreva o conteúdo completo aqui..." 
          placeholderTextColor="#94a3b8"
          multiline 
          numberOfLines={6}
          textAlignVertical="top"
          value={content} 
          onChangeText={setContent} 
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{id ? 'Salvar Alterações' : 'Publicar Post'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  label: { fontWeight: '700', marginBottom: 6, color: '#334155', fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 15, color: '#0f172a' },
  button: { backgroundColor: '#28a745', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 12, padding: 10, alignItems: 'center' },
  cancelButtonText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
});