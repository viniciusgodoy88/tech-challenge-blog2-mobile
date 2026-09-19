import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  async function handleLogin() {
    if (!email.trim() || !pass.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), pass: pass.trim() });
      
      // Ao autenticar com sucesso, direciona ao painel administrativo
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminPosts' }],
      });
    } catch (error: any) {
      console.log('Erro ao efetuar login:', error);
      
      let mensagem = 'Não foi possível conectar ao servidor de autenticação.';
      
      if (error.response?.data?.message) {
        mensagem = error.response.data.message;
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('Network Error')) {
        mensagem = 'Falha de rede ou timeout. Verifique se a API backend está em execução e se o IP do serviço está correto.';
      }

      Alert.alert('Erro de Login', mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Portal do Docente</Text>
        <Text style={styles.subtitle}>Inicie sessão para gerir conteúdos</Text>

        <Text style={styles.label}>E-mail corporativo</Text>
        <TextInput
          style={styles.input}
          placeholder="exemplo@fiap.com.br"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha de acesso</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin} 
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Entrar no Sistema</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Home')}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>← Voltar para os artigos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#0f172a' },
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 15, color: '#0f172a' },
  button: { backgroundColor: '#4f46e5', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  backButton: { marginTop: 16, padding: 8, alignItems: 'center' },
  backButtonText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
});