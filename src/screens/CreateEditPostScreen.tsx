import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../services/api';

export default function CreateEditPostScreen({ route, navigation }: any) {
  const id = route.params?.id;
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/posts/${id}`).then((res) => {
        setTitle(res.data.title);
        setAuthor(res.data.author);
        setContent(res.data.content);
      });
    }
  }, [id]);

  async function handleSave() {
    try {
      if (id) {
        await api.put(`/posts/${id}`, { title, author, content });
      } else {
        await api.post('/posts', { title, author, content });
      }
      Alert.alert('Sucesso', 'Post salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o post.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Autor</Text>
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} />
      <Text style={styles.label}>Conteúdo</Text>
      <TextInput style={[styles.input, { height: 100 }]} multiline value={content} onChangeText={setContent} />
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