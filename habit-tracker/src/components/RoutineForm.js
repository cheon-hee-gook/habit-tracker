import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    SimpleGrid,
    Text
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import CategorySelect from './CategorySelect';
  
  // 깃허브 스타일의 색상 옵션 (회색 제외, 4단계)
  export const CONTRIBUTION_COLORS = {
    green: {
      name: '초록색',
      colors: ['#9be9a8', '#40c463', '#30a14e', '#216e39']
    },
    blue: {
      name: '파란색',
      colors: ['#79b8ff', '#2188ff', '#0366d6', '#044289']
    },
    purple: {
      name: '보라색',
      colors: ['#d8b9ff', '#a371f7', '#8957e5', '#6e40c9']
    },
    orange: {
      name: '주황색',
      colors: ['#ffb366', '#ff9933', '#ff7f00', '#cc6600']
    },
    pink: {
      name: '분홍색',
      colors: ['#ff9ecd', '#ff69b4', '#ff1493', '#cc1478']
    }
  };
  
  function RoutineForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('etc');
    const [selectedColor, setSelectedColor] = useState({ theme: 'green', intensity: 3 }); // intensity: 0-3
    const toast = useToast();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!title.trim()) {
        toast({
          title: '제목을 입력해주세요',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      const newRoutine = {
        title: title.trim(),
        description: description.trim(),
        category: category,
        color_theme: {  // snake_case로 수정
          theme: selectedColor.theme,
          intensity: selectedColor.intensity
        },
        notification: {
          enabled: false,
          time: "09:00"
        }
      };
  
      onAdd(newRoutine);
      
      setTitle('');
      setDescription('');
      setCategory('etc');
      setSelectedColor({ theme: 'green', intensity: 3 });
    };
  
    return (
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>루틴 제목</FormLabel>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 매일 운동하기"
            />
          </FormControl>
  
          <FormControl>
            <FormLabel>설명</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 30분 이상 운동하기"
            />
          </FormControl>
  
          <FormControl>
            <FormLabel>카테고리</FormLabel>
            <CategorySelect 
              value={category} 
              onChange={setCategory}
            />
          </FormControl>
  
          <FormControl>
            <FormLabel>잔디 색상</FormLabel>
            <SimpleGrid columns={5} spacing={3}>
              {Object.entries(CONTRIBUTION_COLORS).map(([themeKey, { name, colors }]) => (
                <VStack key={themeKey} spacing={1}>
                  <Text fontSize="sm" color="gray.600">{name}</Text>
                  {colors.map((color, intensity) => (
                    <Box
                      key={intensity}
                      w="100%"
                      h="20px"
                      bg={color}
                      cursor="pointer"
                      onClick={() => setSelectedColor({ theme: themeKey, intensity })}
                      borderWidth={2}
                      borderColor={
                        selectedColor.theme === themeKey && 
                        selectedColor.intensity === intensity 
                          ? 'blue.500' 
                          : 'transparent'
                      }
                      borderRadius="md"
                      _hover={{ transform: 'scale(1.05)' }}
                      transition="all 0.2s"
                    />
                  ))}
                </VStack>
              ))}
            </SimpleGrid>
          </FormControl>
  
          <Button type="submit" colorScheme="blue" w="full">
            루틴 추가
          </Button>
        </VStack>
      </Box>
    );
  }
  
  export default RoutineForm;