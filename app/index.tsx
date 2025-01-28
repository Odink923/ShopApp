// app/index.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Box, Heading, Text, FlatList, Pressable, Image, Spinner, AspectRatio } from 'native-base';
import { router } from 'expo-router';

interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
}

const sampleImages = [
  'https://i.imgur.com/1G9pW3J.png',
  'https://i.imgur.com/3nQ3ZYa.png',
  'https://i.imgur.com/5X2JQ9C.png'
];

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items: Product[] = [];
        let index = 0;
        querySnapshot.forEach((doc) => {
          items.push({ 
            id: doc.id,
            ...doc.data(),
            image: sampleImages[index % sampleImages.length]
          } as Product);
          index++;
        });
        setProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" color="blue.600" />
      </Box>
    );
  }

  return (
    <Box flex={1} safeAreaTop>
      <Heading p={4} color="blue.800" fontSize="2xl">
        Популярні товари
      </Heading>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ 
          paddingHorizontal: 12,
          paddingBottom: 20 // Відступ для контенту
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/products/${item.id}`)}
            mx={1.5}
            mb={3}
            flex={1}
          >
            <Box
              bg="white"
              borderRadius="xl"
              p={3}
              shadow={2}
              minH={260}
            >
              <AspectRatio ratio={1} w="100%">
                <Image
                  source={{ uri: item.image }}
                  alt={item.title}
                  resizeMode="contain"
                  borderRadius="lg"
                  bg="blue.50"
                />
              </AspectRatio>
              
              <Text 
                fontSize="md" 
                fontWeight="medium" 
                mt={2} 
                color="blue.800"
                numberOfLines={2}
                height={45}
              >
                {item.title}
              </Text>
              
              <Text 
                fontSize="lg" 
                color="blue.600" 
                fontWeight="bold" 
                mt={1}
              >
                {item.price.toLocaleString('uk-UA')} грн
              </Text>
            </Box>
          </Pressable>
        )}
        numColumns={2}
        columnWrapperStyle={{ 
          justifyContent: 'space-between',
          marginBottom: 12
        }}
      />
    </Box>
  );
}