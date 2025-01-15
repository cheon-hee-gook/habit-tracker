import { 
    Box, 
    Heading, 
    Text, 
    HStack, 
    IconButton,
    Checkbox,
    VStack,
    Flex,
    useDisclosure,
    Input,
    Button,
    FormControl,
    FormLabel,
    SimpleGrid,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
  } from '@chakra-ui/react';
  import { 
    DeleteIcon, 
    EditIcon, 
    CalendarIcon,
    BellIcon 
  } from '@chakra-ui/icons';
  import { useState, useRef } from 'react';
  import Calendar from './Calendar';
  import NotificationSettings from './NotificationSettings';
  import CategorySelect from './CategorySelect';
  import { CONTRIBUTION_COLORS } from './RoutineForm';
  
  function RoutineItem({ routine, onDelete, onUpdate, onComplete, onUnComplete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showCalendar, setShowCalendar] = useState(true);
    const [editedTitle, setEditedTitle] = useState(routine.title);
    const [editedDescription, setEditedDescription] = useState(routine.description);
    const [editedCategory, setEditedCategory] = useState(routine.category);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);
    const [isUncheckDialogOpen, setIsUncheckDialogOpen] = useState(false);
    const cancelRef = useRef();
    
    const [editedColorTheme, setEditedColorTheme] = useState({
      theme: routine.color_theme?.theme || 'green',
      intensity: routine.color_theme?.intensity || 0
    });
  
    const today = new Date().toISOString().split('T')[0];
  
    const handleEdit = () => {
      setEditedTitle(routine.title);
      setEditedDescription(routine.description);
      setEditedColorTheme({
        theme: routine.color_theme?.theme || 'green',
        intensity: routine.color_theme?.intensity || 0
      });
      setEditedCategory(routine.category);
      setIsEditing(true);
    };
  
    const getColorFromTheme = (colorTheme) => {
      if (!colorTheme || !colorTheme.theme || typeof colorTheme.intensity !== 'number') {
        return 'gray.100';
      }
      return CONTRIBUTION_COLORS[colorTheme.theme]?.colors[colorTheme.intensity] || 'gray.100';
    };
  
    const handleCheckboxClick = () => {
        const isCurrentlyChecked = routine.completedDates?.[today];
        if (isCurrentlyChecked) {
          setIsUncheckDialogOpen(true);  // 체크 해제 확인
        } else {
          setIsCheckDialogOpen(true);    // 체크 확인
        }
      };
  
    const handleConfirmCheck = () => {
      onComplete(routine.id, today);  // 체크 함수 호출
      setIsCheckDialogOpen(false);
    };

    const handleConfirmUncheck = () => {
        onUnComplete(routine.id, today);  // 체크 해제 함수 호출
        setIsUncheckDialogOpen(false);
      };
  
    const handleSave = () => {
      if (editedTitle.trim()) {
        const updatedRoutine = {
          ...routine,
          title: editedTitle.trim(),
          description: editedDescription.trim(),
          category: editedCategory,
          color_theme: {
            theme: editedColorTheme.theme,
            intensity: editedColorTheme.intensity
          },
          notification: routine.notification || {
            enabled: false,
            time: "09:00"
          }
        };
        
        console.log('Sending updated routine:', updatedRoutine);
        onUpdate(routine.id, updatedRoutine);
        setIsEditing(false);
      }
    };
  
    const handleCancel = () => {
      setEditedTitle(routine.title);
      setEditedDescription(routine.description);
      setEditedColorTheme({
        theme: routine.color_theme?.theme || 'green',
        intensity: routine.color_theme?.intensity || 0
      });
      setEditedCategory(routine.category);
      setIsEditing(false);
    };
  
    if (isEditing) {
      return (
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <VStack align="stretch" spacing={4}>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="루틴 제목"
            />
            <Input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="설명"
            />
            <CategorySelect 
              value={editedCategory}
              onChange={setEditedCategory}
            />
            
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
                        onClick={() => {
                          setEditedColorTheme({ theme: themeKey, intensity });
                        }}
                        borderWidth={2}
                        borderColor={
                          editedColorTheme?.theme === themeKey && 
                          editedColorTheme?.intensity === intensity 
                            ? 'blue.500' 
                            : 'transparent'
                        }
                        borderRadius="md"
                        _hover={{ 
                          transform: 'scale(1.05)',
                          boxShadow: 'lg'
                        }}
                        _active={{
                          transform: 'scale(0.95)'
                        }}
                        transition="all 0.2s"
                      />
                    ))}
                  </VStack>
                ))}
              </SimpleGrid>
            </FormControl>
      
            <HStack spacing={2}>
              <Button colorScheme="blue" onClick={handleSave}>
                저장
              </Button>
              <Button onClick={handleCancel}>
                취소
              </Button>
            </HStack>
          </VStack>
        </Box>
      );
    }
  
    return (
      <>
        <Box 
          p={4} 
          borderWidth={1} 
          borderRadius="md" 
          mt={2}
          position="relative"
          _hover={{ bg: 'gray.50' }}
          borderLeftWidth="8px"
          borderLeftColor={getColorFromTheme(routine.color_theme)}
        >
          <VStack align="stretch" spacing={4}>
            <Flex justify="space-between" align="center">
              <HStack spacing={4}>
                <Checkbox
                  isChecked={routine.completedDates?.[today]}
                  onChange={handleCheckboxClick}
                  colorScheme={routine.color_theme?.theme || 'green'}
                >
                  <Box>
                    <Heading 
                      size="sm" 
                      textDecoration={routine.completedDates?.[today] ? "line-through" : "none"}
                    >
                      {routine.title}
                    </Heading>
                    {routine.description && (
                      <Text color="gray.600" mt={1}>{routine.description}</Text>
                    )}
                  </Box>
                </Checkbox>
              </HStack>
              <HStack>
                <IconButton
                  icon={<BellIcon />}
                  variant="ghost"
                  colorScheme={routine.notification?.enabled ? "green" : "gray"}
                  size="sm"
                  onClick={onOpen}
                  aria-label="알림 설정"
                />
                <IconButton
                  icon={<CalendarIcon />}
                  variant="ghost"
                  colorScheme={showCalendar ? "blue" : "gray"}
                  size="sm"
                  onClick={() => setShowCalendar(!showCalendar)}
                  aria-label="달력 보기"
                />
                <IconButton
                  icon={<EditIcon />}
                  variant="ghost"
                  colorScheme="blue"
                  size="sm"
                  onClick={handleEdit}
                  aria-label="루틴 수정"
                />
                <IconButton
                  icon={<DeleteIcon />}
                  variant="ghost"
                  colorScheme="red"
                  size="sm"
                  onClick={() => onDelete(routine.id)}
                  aria-label="루틴 삭제"
                />
              </HStack>
            </Flex>
            
            {showCalendar && (
              <Box borderTop="1px" borderColor="gray.200" pt={4}>
                <Calendar routine={routine} />
              </Box>
            )}
  
            <NotificationSettings
              isOpen={isOpen}
              onClose={onClose}
              routine={routine}
              onUpdate={onUpdate}
            />
          </VStack>
        </Box>
  
        <AlertDialog
        isOpen={isCheckDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsCheckDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              루틴 완료 확인
            </AlertDialogHeader>
            <AlertDialogBody>
              "{routine.title}" 루틴을 완료하셨나요?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsCheckDialogOpen(false)}>
                아니오
              </Button>
              <Button colorScheme={routine.color_theme?.theme || 'green'} onClick={handleConfirmCheck} ml={3}>
                예
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isUncheckDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsUncheckDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              루틴 완료 취소 확인
            </AlertDialogHeader>
            <AlertDialogBody>
              "{routine.title}" 루틴의 완료를 취소하시겠습니까?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsUncheckDialogOpen(false)}>
                아니오
              </Button>
              <Button colorScheme="red" onClick={handleConfirmUncheck} ml={3}>
                예
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      </>
    );
  }
  
  export default RoutineItem;