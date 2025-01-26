// app/user/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import {
  Box,
  Text,
  Button,
  Heading,
  VStack
} from 'native-base';

export default function UserProfile() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchUserDoc() {
      if (!firebaseUser) return;
      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data?.name || '');
        setPhone(data?.phone || '');
      }
    }
    fetchUserDoc();
  }, [firebaseUser]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/auth');
  };

  if (!firebaseUser) {
    return (
      <Box flex={1} p={4} justifyContent="center" alignItems="center" bg="white">
        <Text mb={2}>Ви не авторизовані</Text>
        <Button variant="outline" onPress={() => router.push('/auth')}>
          Перейти до логіну
        </Button>
      </Box>
    );
  }

  return (
    <Box flex={1} p={4} bg="white">
      <Heading mb={4}>Профіль користувача</Heading>

      <VStack space={2}>
        <Text>UID: {firebaseUser.uid}</Text>
        <Text>Email: {firebaseUser.email}</Text>
        <Text>Ім'я: {name}</Text>
        <Text>Телефон: {phone}</Text>
      </VStack>

      <Button onPress={handleLogout} mt={6}>
        Вийти
      </Button>
    </Box>
  );
}
