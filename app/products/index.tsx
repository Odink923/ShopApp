// app/products/index.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Box, Heading, FlatList, Text, Pressable } from 'native-base';

interface Product {
  id: string;
  title: string;
  price: number;
}

export default function ProductsIndex() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items: Product[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <Box flex={1} p={4} bg="white">
      <Heading mb={4}>Список товарів</Heading>

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
