// app/user/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

export default function UserProfile() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  // Поля з Firestore
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Слідкуємо за станом авторизації
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchUserDoc() {
      if (!firebaseUser) return; // якщо не авторизовані, не робимо
      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data) {
          setName(data.name || '');
          setPhone(data.phone || '');
        }
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
      <View style={styles.container}>
        <Text>Ви не авторизовані</Text>
        <Button title="Перейти до логіну" onPress={() => router.push('/auth')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профіль користувача</Text>
      <Text>UID: {firebaseUser.uid}</Text>
      <Text>Email: {firebaseUser.email}</Text>

      <Text>Ім'я: {name}</Text>
      <Text>Телефон: {phone}</Text>

      <Button title="Вийти" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});
