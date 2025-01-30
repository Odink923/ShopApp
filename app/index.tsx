// app/index.tsx
import React, { useEffect, useState, useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { 
  Box, 
  Heading, 
  FlatList, 
  Pressable, 
  Image, 
  Spinner, 
  AspectRatio, 
  Text, 
  Icon, 
  HStack,
  VStack,
  useToast,
  Button
} from 'native-base';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { CartContext } from '@/AppProvider';
import { Product } from '@/types';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const toast = useToast();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({ 
            id: doc.id,
            title: data.title || 'Без назви',
            price: data.price || 0,
            image: data.image || '',
            quantity: 1,
            isNew: data.isNew || false
          });
        });
        setProducts(items);
      } catch (error) {
        toast.show({
          title: 'Помилка завантаження товарів',
          variant: 'solid',
          bg: 'red.500',
          placement: 'top'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.show({
      title: 'Товар додано в кошик',
      variant: 'solid',
      bg: 'success.500',
      placement: 'top'
    });
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="white">
        <Spinner size="lg" color="primary.600" />
      </Box>
    );
  }

  return (
    <Box flex={1} bg="coolGray.50" safeAreaTop>
      <Heading p={4} fontSize="2xl" color="primary.600">
        Популярні товари
      </Heading>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ 
          paddingHorizontal: 8,
          paddingBottom: 24
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/products/${item.id}`)}
            mb={4}
            flex={1}
            _pressed={{ opacity: 0.9 }}
            style={{ 
              width: '48%',
              marginHorizontal: 4
            }}
          >
            <Box
              bg="white"
              borderRadius="2xl"
              p={3}
              shadow={4}
              minH={260}
              w="100%"
            >
              <AspectRatio ratio={1} w="100%">
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    alt={item.title}
                    resizeMode="contain"
                    borderRadius="lg"
                    bg="primary.50"
                    defaultSource={require('@/assets/images/placeholder.png')}
                  />
                ) : (
                  <Box 
                    bg="primary.50" 
                    justifyContent="center" 
                    alignItems="center"
                    borderRadius="lg"
                    h="100%"
                  >
                    <Icon
                      as={MaterialIcons}
                      name="image-not-supported"
                      size={12}
                      color="primary.600"
                    />
                  </Box>
                )}
              </AspectRatio>
              
              <HStack justifyContent="space-between" alignItems="flex-start" mt={2}>
                <VStack flex={1}>
                  <Text 
                    fontSize="md" 
                    fontWeight="medium" 
                    color="coolGray.800"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text 
                    fontSize="lg" 
                    color="primary.600" 
                    fontWeight="bold"
                    mt={1}
                  >
                    {item.price.toLocaleString('uk-UA')} грн
                  </Text>
                </VStack>
                {item.isNew && (
                  <Box
                    bg="primary.600"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    <Text color="white" fontSize="xs" bold>NEW</Text>
                  </Box>
                )}
                     <Button
                variant="unstyled"
                mt={5}
                alignSelf="flex-end"
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
              >
                <Icon
                  as={MaterialIcons}
                  name="add-shopping-cart"
                  size={7}
                  color="primary.600"
                />
              </Button>
              </HStack>
              
         
            </Box>
          </Pressable>
        )}
        numColumns={2}
        columnWrapperStyle={{ 
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingHorizontal: 4
        }}
      />
    </Box>
  );
}