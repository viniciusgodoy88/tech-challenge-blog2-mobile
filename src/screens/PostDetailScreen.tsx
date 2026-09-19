import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

export default function PostDetailScreen({ route }: any) {
  const { id } = route.params;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPost() {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getPost();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4f46e5" />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.badgeContainer}>
        <Text style={styles.badge}>Postagem Oficial</Text>
      </View>
      <Text style={styles.title}>{post?.title}</Text>
      <View style={styles.authorBox}>
        <Text style={styles.authorText}>Por: <Text style={{ fontWeight: 'bold' }}>{post?.author}</Text></Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.content}>{post?.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  badgeContainer: { marginBottom: 12 },
  badge: { backgroundColor: '#dcfce7', color: '#15803d', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a', lineHeight: 32, marginBottom: 12 },
  authorBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 },
  authorText: { color: '#64748b', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 20 },
  content: { fontSize: 16, lineHeight: 26, color: '#334155' },
});