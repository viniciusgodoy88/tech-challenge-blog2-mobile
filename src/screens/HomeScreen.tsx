import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';

export default function HomeScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      
      // Mapeamento flexível para aceitar Array direto ou dentro de um objeto { data: [...] } / { posts: [...] }
      const listData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.posts || response.data?.data || [];

      setPosts(listData);
    } catch (error) {
      console.log('Erro de conexão com o backend:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.author?.toLowerCase().includes(search.toLowerCase()) ||
      post.professor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      
      {/* Top Banner Hero estilizado */}
      <View style={styles.heroBanner}>
        <View style={styles.heroTopRow}>
          <Text style={styles.logoBadge}>POS TECH</Text>
          <TouchableOpacity style={styles.loginPill} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginPillText}>🔑 Entrar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.heroTitle}>Tech Blog Mobile</Text>
        <Text style={styles.heroSubtitle}>Publicações e artigos científicos do corpo docente</Text>
      </View>

      <View style={styles.body}>
        {/* Input de Busca */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título ou autor..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={styles.loadingText}>Carregando os artigos...</Text>
          </View>
        ) : filteredPosts.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyTitle}>Nenhum post encontrado</Text>
            <Text style={styles.emptySub}>Verifique se o seu servidor backend está ativo em http://192.168.15.152:3000</Text>
            <TouchableOpacity style={styles.reloadBtn} onPress={loadPosts}>
              <Text style={styles.reloadBtnText}>🔄 Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => String(item.id || item._id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('PostDetail', { id: item.id || item._id })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.badgeCategory}>
                    <Text style={styles.badgeCategoryText}>Artigo</Text>
                  </View>
                  <Text style={styles.author}>✍️ {item.author || item.professor?.name || 'Docente FIAP'}</Text>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={3}>
                  {item.content}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.readMore}>Ler artigo completo →</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#4f46e5' },
  heroBanner: { backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logoBadge: { color: '#ffffff', fontWeight: '900', fontSize: 14, letterSpacing: 1.2, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  loginPill: { backgroundColor: '#ffffff', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  loginPillText: { color: '#4f46e5', fontWeight: '800', fontSize: 13 },
  heroTitle: { fontSize: 30, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  heroSubtitle: { fontSize: 14, color: '#c7d2fe', lineHeight: 20 },
  
  body: { flex: 1, backgroundColor: '#f1f5f9', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingTop: 16 },
  searchContainer: { marginBottom: 16 },
  searchInput: { backgroundColor: '#ffffff', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#cbd5e1', fontSize: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14, fontWeight: '600' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 6 },
  emptySub: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16 },
  reloadBtn: { backgroundColor: '#4f46e5', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  reloadBtnText: { color: '#ffffff', fontWeight: '700' },

  card: { backgroundColor: '#ffffff', padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeCategory: { backgroundColor: '#e0e7ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeCategoryText: { color: '#4338ca', fontSize: 11, fontWeight: '700' },
  author: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  cardDescription: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 12 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  readMore: { color: '#4f46e5', fontWeight: '700', fontSize: 13 },
});