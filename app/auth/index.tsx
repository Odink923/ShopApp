// app/auth/index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
            // Ті поля, які ви хочете зберігати
            name: name,
            phone: phone,
            email: user.email,
            createdAt: Date.now(),
          });
        }
      }
      router.replace('/'); // Переходимо на головну (або '/user'), як бажаєте
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Логін' : 'Реєстрація'}</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}

      {/* Загальні поля */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {/* Поля, що потрібні лише при реєстрації */}
      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Ім'я"
            onChangeText={setName}
            value={name}
          />
          <TextInput
            style={styles.input}
            placeholder="Телефон"
            onChangeText={setPhone}
            value={phone}
          />
        </>
      )}

      <Button title={isLogin ? 'Увійти' : 'Зареєструватись'} onPress={handleAuth} />
      <Button
        title={isLogin ? 'Перейти до реєстрації' : 'Перейти до логіну'}
        onPress={() => setIsLogin(!isLogin)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  error: { color: 'red', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 4,
    padding: 8
  }
});
