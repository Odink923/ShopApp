// app/index.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Box, Heading, Text, VStack, Button, FlatList, Pressable } from 'native-base';
import { useRouter } from 'expo-router';

interface Product {
  id: string;
  title: string;
  price: number;
}

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items: Product[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(items);
    }
    fetchProducts();
  }, []);
  const router = useRouter();
  return (
    <Box flex={1} p={4} bg="white">
      <Heading mb={4}>Головна</Heading>

      <VStack space={2} mb={4}>
      <Button variant="outline" colorScheme="primary" onPress={() => router.push('/auth')}>
    Перейти до Авторизації
  </Button>
        
        <Button variant="outline" colorScheme="primary" onPress={() => router.push('/cart')}>
            Перейти до Кошика
          </Button>
     
        
        <Button variant="outline" colorScheme="primary" onPress={() => router.push('/user')}>
            Мій профіль
          </Button>
      
      </VStack>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            bg="gray.100"
            p={3}
            borderRadius={6}
            mb={2}
          >
            {/* Для навігації */}
            <Link href={`/products/${item.id}`}>
              <Text fontSize="md" color="black">
                {item.title} – {item.price} грн
              </Text>
            </Link>
          </Pressable>
        )}
      />
    </Box>
  );
}
