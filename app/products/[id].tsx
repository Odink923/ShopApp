// app/products/[id].tsx
import React, { useEffect, useState, useContext } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CartContext } from '@/AppProvider'; // ваш шлях до CartContext
import { Box, Text, Button, Heading } from 'native-base';

interface Product {
  id: string;
  title: string;
  price: number;
}

export default function ProductDetailScreen() {
  const [product, setProduct] = useState<Product | null>(null);

  const params = useLocalSearchParams();
  const router = useRouter();

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id || typeof params.id !== 'string') return;
      try {
        const docRef = doc(db, 'products', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.log('Error fetching product details:', error);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (!product) {
    return (
      <Box flex={1} p={4} justifyContent="center" bg="white">
        <Text>Завантаження...</Text>
      </Box>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`Товар "${product.title}" додано в кошик!`);
    router.push('/cart');
  };

  return (
    <Box flex={1} p={4} bg="white">
      <Heading size="lg" mb={2}>{product.title}</Heading>
      <Text fontSize="lg" mb={4}>
        {product.price} грн
      </Text>
      <Button onPress={handleAddToCart}>Додати в кошик</Button>
    </Box>
  );
}
