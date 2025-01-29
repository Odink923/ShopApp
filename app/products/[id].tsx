// app/products/[id].tsx
import React, { useEffect, useState, useContext } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CartContext } from '@/AppProvider';
import { Product } from '@/types';
import { Box, Text, Button, Heading, Image, AspectRatio } from 'native-base';

export default function ProductDetailScreen() {
  const [product, setProduct] = useState<Product | null>(null);
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      if (typeof params.id !== 'string') return;
      try {
        const docRef = doc(db, 'products', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ 
            id: docSnap.id, 
            ...docSnap.data(), 
            quantity: 1 
          } as Product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      router.push('/cart');
    }
  };

  if (!product) {
    return (
      <Box flex={1} p={4} justifyContent="center" bg="white">
        <Text>Завантаження...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} p={4} bg="white">
      <AspectRatio ratio={1} w="100%">
        <Image
          source={{ uri: product.image }}
          alt={product.title}
          resizeMode="contain"
          borderRadius="lg"
          bg="blue.50"
        />
      </AspectRatio>
      
      <Heading size="lg" mt={4} mb={2}>
        {product.title}
      </Heading>
      
      <Text fontSize="2xl" fontWeight="bold" color="primary.600" mb={6}>
        {product.price.toLocaleString('uk-UA')} грн
      </Text>

      <Button size="lg" bg="primary.600" onPress={handleAddToCart}>
        Додати в кошик
      </Button>
    </Box>
  );
}