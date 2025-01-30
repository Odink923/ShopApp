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
  VStack, 
  HStack, 
  Icon, 
  Avatar, 
  Spinner,
  Divider,
  useToast
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function UserProfile() {
  const router = useRouter();
  const toast = useToast();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchUserDoc() {
      if (!firebaseUser) return;
      try {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data?.name || '');
          setPhone(data?.phone || '');
        }
      } catch (error) {
        toast.show({
          title: 'Помилка завантаження даних',
          variant: 'solid',
          bg: 'red.500',
          placement: 'top'
        });
      }
    }
    fetchUserDoc();
  }, [firebaseUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/auth');
    } catch (error) {
      toast.show({
        title: 'Помилка при виході',
        variant: 'solid',
        bg: 'red.500',
        placement: 'top'
      });
    }
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="white">
        <Spinner size="lg" color="primary.600" />
      </Box>
    );
  }

  if (!firebaseUser) {
    return (
      <Box flex={1} p={8} justifyContent="center" alignItems="center" bg="white">
        <VStack space={4} alignItems="center">
          <Icon
            as={MaterialIcons}
            name="error-outline"
            size={12}
            color="primary.600"
          />
          <Heading size="md" color="coolGray.800">
            Ви не авторизовані
          </Heading>
          <Button
            variant="solid"
            bg="primary.600"
            _pressed={{ bg: 'primary.700' }}
            onPress={() => router.push('/auth')}
            leftIcon={<Icon as={MaterialIcons} name="login" size="sm" color="white" />}
          >
            Увійти в акаунт
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="coolGray.50">
      <Box bg="primary.600" p={6} pt={12} pb={8}>
        <VStack space={4} alignItems="center">
          <Avatar
            bg="primary.700"
            size="2xl"
            source={{ uri: firebaseUser.photoURL || undefined }}
          >
            {firebaseUser.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Heading color="white" mt={4}>
            {name || firebaseUser.displayName || 'Користувач'}
          </Heading>
        </VStack>
      </Box>

      <Box mx={4} mt={-8} bg="white" borderRadius="2xl" shadow={4} p={6}>
        <VStack space={4}>
          <InfoItem icon="email" title="Email" value={firebaseUser.email} />
          <InfoItem icon="person" title="Ім'я" value={name || 'Не вказано'} />
          <InfoItem icon="phone" title="Телефон" value={phone || 'Не вказано'} />
        </VStack>
      </Box>

      <Box mt={8} mx={4}>
        <Button
          variant="outline"
          borderColor="red.500"
          _text={{ color: 'red.500' }}
          onPress={handleLogout}
          leftIcon={<Icon as={MaterialIcons} name="logout" color="red.500" />}
        >
          Вийти з акаунта
        </Button>
      </Box>
    </Box>
  );
}

const InfoItem = ({ icon, title, value }: { icon: string; title: string; value: string }) => (
  <HStack space={4} alignItems="center">
    <Icon
      as={MaterialIcons}
      name={icon}
      size={6}
      color="primary.600"
      mr={2}
    />
    <VStack flex={1}>
      <Text fontSize="sm" color="coolGray.500">
        {title}
      </Text>
      <Text fontSize="md" fontWeight="medium" color="coolGray.800">
        {value}
      </Text>
    </VStack>
  </HStack>
);