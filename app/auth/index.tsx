// app/auth/index.tsx
import React, { useState } from 'react';
import { Box, Heading, Input, Button, Text, VStack } from 'native-base';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Нові поля:
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    try {
      if (isLogin) {
        // Логін
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Реєстрація
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Якщо користувач створений, зберігаємо дод. дані у Firestore
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            name,
            phone,
            email: user.email,
            createdAt: Date.now(),
          });
        }
      }
      router.replace('/'); // Переходимо на головну
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box flex={1} justifyContent="center" p={4} bg="white">
      <Heading textAlign="center" mb={4}>
        {isLogin ? 'Логін' : 'Реєстрація'}
      </Heading>

      {!!error && (
        <Text color="red.500" mb={2}>
          {error}
        </Text>
      )}

      <VStack space={4}>
        {/* Базові поля */}
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Додаткові поля для реєстрації */}
        {!isLogin && (
          <>
            <Input
              placeholder="Ім'я"
              value={name}
              onChangeText={setName}
            />
            <Input
              placeholder="Телефон"
              value={phone}
              onChangeText={setPhone}
            />
          </>
        )}

        {/* Кнопки */}
        <Button onPress={handleAuth}>
          {isLogin ? 'Увійти' : 'Зареєструватись'}
        </Button>
        <Button variant="outline" onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Перейти до реєстрації' : 'Перейти до логіну'}
        </Button>
      </VStack>
    </Box>
  );
}
