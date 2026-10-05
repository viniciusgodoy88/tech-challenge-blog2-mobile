# 🚀 Tech Blog Mobile — Portal do Docente (Pós Tech FIAP)

Aplicação mobile em **React Native (Expo)** integrada a uma **API REST em Node.js/Prisma** para consulta e gestão de artigos acadêmicos e técnicos por docentes.

---

## 📋 Sumário
- [Requisitos do Sistema](#-requisitos-do-sistema)
- [Frameworks e Bibliotecas](#-frameworks-e-bibliotecas-utilizadas)
- [Instalação e Configuração](#-instalação-e-configuração)
  - [1. Backend (Node.js + Prisma)](#1-backend-nodejs--prisma)
  - [2. Tunneling com ngrok](#2-tunneling-com-ngrok)
  - [3. Frontend Mobile (React Native + Expo)](#3-frontend-mobile-react-native--expo)
- [Credenciais e Usuários do Banco](#-credenciais-de-acesso-prisma--usuários)
- [Fluxo e Funcionalidades do App (CRUD)](#-fluxo-e-funcionalidades-do-app-crud)

---

## 📌 Requisitos do Sistema

Antes de iniciar, certifique-se de ter os seguintes softwares instalados no seu ambiente:

* **Node.js**: Versão 18.x ou superior.
* **npm** ou **yarn**: Gerenciador de pacotes.
* **Expo Go**: Aplicativo instalado no smartphone (Android/iOS) para testes via QR Code, ou emuladores configurados (Android Studio / Xcode).
* **ngrok**: Ferramenta de tunneling para expor a API local (`http://localhost:3000`) de forma pública e HTTPS.
* **Banco de Dados**: SQLite ou PostgreSQL com Prisma ORM.

---

## 🛠️ Frameworks e Bibliotecas Utilizadas

### Frontend (Mobile - React Native)
* **React Native / Expo**: Framework base para desenvolvimento cross-platform.
* **React Navigation**: Gerenciamento de rotas em pilha (`@react-navigation/native-stack`).
* **Axios**: Cliente HTTP para consumo da API REST.
* **AsyncStorage**: Armazenamento local persistente do Token JWT da sessão.
* **React Native Safe Area Context**: Ajuste automático de layout para telas de dispositivos móveis.

### Backend (API REST)
* **Node.js & Express**: Servidor HTTP e gerenciamento de endpoints.
* **Prisma ORM**: Mapeamento do banco de dados e execução de queries/migrations.
* **JWT (JSON Web Token)**: Autenticação stateless baseada em Bearer Tokens e permissões por Role (`TEACHER`, `STUDENT`, `SUPERADMIN`).
* **Bcrypt**: Criptografia e verificação segura de senhas.

---

## 💻 Instalação e Configuração

### 1. Backend (Node.js + Prisma)

1. Abra o terminal e acesse a pasta do projeto Backend:
   ```bash
   cd backend
