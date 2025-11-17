import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

// const baseURL = 'http://localhost:3000';
const baseURL = 'https://petgo-backend-api.onrender.com';

type ApiOk<T> = { status: 'success'; message?: string; data?: T };
type ApiErr   = { status: 'error'; message: string };

type UserDTO = { id: number; name: string; email: string; cpf: string };

export default function SettingsScreen() {
  const { userId, token, logout } = useAuth();

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');

  // Utilitário: tenta parsear JSON; se vier HTML (erro 404 do servidor), cai no catch
  const parseJsonSafe = async (res: Response) => {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  };

  const fetchUser = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/users/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      const body: ApiOk<UserDTO> | ApiErr = await parseJsonSafe(res);
      if (!res.ok || (body as ApiErr).status === 'error') {
        const msg = (body as ApiErr).message || `Falha ao carregar usuário (HTTP ${res.status})`;
        throw new Error(msg);
      }

      const data = (body as ApiOk<UserDTO>).data!;
      setName(data.name ?? '');
      setCpf(data.cpf ?? '');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', e.message?.toString() ?? 'Falha ao carregar usuário.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, [userId]);

  const handleSaveProfile = async () => {
    if (!userId) return;
    if (!name || !cpf) {
      Alert.alert('Validação', 'Informe nome e CPF.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ name, cpf }),
      });

      const body: ApiOk<any> | ApiErr = await parseJsonSafe(res);
      if (!res.ok || (body as ApiErr).status === 'error') {
        const msg = (body as ApiErr).message || `Falha ao salvar (HTTP ${res.status})`;
        throw new Error(msg);
      }

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', e.message?.toString() ?? 'Falha ao salvar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!userId) return;
    if (!currentPassword || !newPassword || !confirmNew) {
      Alert.alert('Validação', 'Preencha todos os campos de senha.');
      return;
    }
    if (newPassword !== confirmNew) {
      Alert.alert('Validação', 'A confirmação da nova senha não confere.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const body: ApiOk<any> | ApiErr = await parseJsonSafe(res);
      if (!res.ok || (body as ApiErr).status === 'error') {
        const msg = (body as ApiErr).message || `Falha ao alterar senha (HTTP ${res.status})`;
        throw new Error(msg);
      }

      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNew('');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', e.message?.toString() ?? 'Falha ao alterar senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configurações da Conta</Text>

      <Text style={styles.section}>Dados cadastrais</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        editable={!loading}
      />
      <TouchableOpacity style={styles.btnPrimary} disabled={loading} onPress={handleSaveProfile}>
        <Text style={styles.btnText}>Salvar dados</Text>
      </TouchableOpacity>

      <Text style={[styles.section, { marginTop: 24 }]}>Alterar senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha atual"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar nova senha"
        secureTextEntry
        value={confirmNew}
        onChangeText={setConfirmNew}
        editable={!loading}
      />
      <TouchableOpacity style={styles.btnPrimary} disabled={loading} onPress={handleChangePassword}>
        <Text style={styles.btnText}>Alterar senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnOutline} disabled={loading} onPress={logout}>
        <Text style={[styles.btnText, { color: '#0B5ED7' }]}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  section: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    padding: 14, marginBottom: 12, backgroundColor: '#fff',
  },
  btnPrimary: {
    backgroundColor: '#0B5ED7', padding: 14, borderRadius: 12,
    alignItems: 'center',
  },
  btnOutline: {
    marginTop: 28, borderWidth: 1, borderColor: '#0B5ED7',
    padding: 14, borderRadius: 12, alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
});
