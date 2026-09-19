import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/routes';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#4f46e5" />
      <Routes />
    </AuthProvider>
  );
}