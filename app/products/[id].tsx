import React, { useEffect, useState, useContext } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CartContext } from '@/AppProvider';
import { Product } from '@/types';
import { 
  Box, 
  Text, 
  Button, 
  Heading, 
  Image, 
  AspectRatio, 
  Icon, 
  HStack, 
  VStack, 
  ZStack,
  useToast,
  Skeleton
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const PLACEHOLDER_IMAGE = require('@/assets/images/placeholder.png');

export default function ProductDetailScreen() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useContext(CartContext);
  const toast = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (typeof params.id !== 'string') {
          toast.show({ title: 'Невірний ID товару', bg: 'red.500' });
          return;
        }

        const docRef = doc(db, 'products', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ 
            id: docSnap.id,
            title: data.title || 'Без назви',
            price: Number(data.price) || 0,
            image: String(data.image || ''),
            description: data.description || 'Опис відсутній', // Виправлено помилку в тексті
            isNew: Boolean(data.isNew),
            quantity: 1
          });
        } else {
          toast.show({ title: 'Товар не знайдено', bg: 'warning.500' });
        }
      } catch (error) {
        toast.show({
          title: 'Помилка завантаження',
          description: 'Спробуйте пізніше',
          bg: 'red.500'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);
    toast.show({
      title: `${product.title} додано в кошик 🛒`,
      bg: 'success.500'
    });
    router.push('/cart');
  };

  if (loading) {
    return (
      <Box flex={1} p={4} bg="white">
        <Skeleton h="300px" mb={4} borderRadius="2xl" />
        <Skeleton.Text lines={3} py={2} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="white">
        <Icon
          as={MaterialIcons}
          name="error-outline"
          size={12}
          color="primary.600"
          mb={2}
        />
        <Text fontSize="lg" color="coolGray.600">
          Товар не існує
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="coolGray.50" pt={16} p={4}>
      {/* Виправлено позиціонування бейджа */}
      <Box position="relative"> 
        {product.isNew && (
          <Box
            position="absolute"
            top={2}
            right={2}
            bg="primary.600"
            px={3}
            py={1}
            borderRadius="full"
            zIndex={2} // Додано zIndex
          >
            <Text color="white" fontSize="xs" bold>
              NEW
            </Text>
          </Box>
        )}
        <AspectRatio ratio={1} w="100%">
          <Image
            source={product.image ? { uri: product.image } : PLACEHOLDER_IMAGE}
            alt={product.title}
            resizeMode="contain"
            borderRadius="2xl"
            bg="primary.50"
            borderWidth={1}
            borderColor="coolGray.200"
          />
        </AspectRatio>
      </Box>

      <VStack space={4} mt={6}>
        <Heading fontSize="3xl" color="coolGray.800">
          {product.title}
        </Heading>

        <HStack alignItems="center" space={2}>
          <Text fontSize="2xl" fontWeight="bold" color="primary.600">
            {product.price.toLocaleString('uk-UA')} грн
          </Text>
          <Text fontSize="sm" color="coolGray.500">
            (Включно з ПДВ)
          </Text>
        </HStack>

        <Button 
          size="lg" 
          bg="primary.600"
          _pressed={{ bg: 'primary.700' }}
          leftIcon={
            <Icon as={MaterialIcons} name="add-shopping-cart" size={5} color="white" />
          }
          onPress={handleAddToCart}
        >
          Додати в кошик
        </Button>

        {/* Виправлено відображення опису */}
        <VStack space={2} mt={4}>
          <Text fontSize="lg" bold color="coolGray.800">
            Опис
          </Text>
          <Text color="coolGray.600">
            {product.description || 'Опис відсутній'} {/* Виправлено помилку */}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}