import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminPostsScreen from '../screens/AdminPostsScreen';
import CreateEditPostScreen from '../screens/CreateEditPostScreen';
import ListProfessorsScreen from '../screens/ListProfessorsScreen';
import CreateEditProfessorScreen from '../screens/CreateEditProfessorScreen';
import ListStudentsScreen from '../screens/ListStudentsScreen';
import CreateEditStudentScreen from '../screens/CreateEditStudentScreen';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const { signed } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#4f46e5' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PostDetail" 
          component={PostDetailScreen} 
          options={{ title: 'Artigo' }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Acesso Restrito', headerShown: false }} 
        />

        {signed && (
          <>
            <Stack.Screen 
              name="AdminPosts" 
              component={AdminPostsScreen} 
              options={{ title: 'Painel Geral' }} 
            />
            <Stack.Screen 
              name="CreateEditPost" 
              component={CreateEditPostScreen} 
              options={{ title: 'Gerenciar Post' }} 
            />
            <Stack.Screen 
              name="ListProfessors" 
              component={ListProfessorsScreen} 
              options={{ title: 'Docentes' }} 
            />
            <Stack.Screen 
              name="CreateEditProfessor" 
              component={CreateEditProfessorScreen} 
              options={{ title: 'Gerenciar Docente' }} 
            />
            <Stack.Screen 
              name="ListStudents" 
              component={ListStudentsScreen} 
              options={{ title: 'Estudantes' }} 
            />
            <Stack.Screen 
              name="CreateEditStudent" 
              component={CreateEditStudentScreen} 
              options={{ title: 'Gerenciar Estudante' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}