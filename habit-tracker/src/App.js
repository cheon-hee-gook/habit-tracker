import { Box, Container, Heading, VStack, useToast, Flex, Spacer } from '@chakra-ui/react';
import RoutineForm from './components/RoutineForm';
import RoutineItem from './components/RoutineItem';
import Statistics from './components/Statistics';
import RoutineSort from './components/RoutineSort';
import CategorySelect from './components/CategorySelect';
import DataManagement from './components/DataManagement';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

import { useState, useEffect, useMemo } from 'react';
import { routineApi } from './services/api';


function App() {
  // 초기 상태 설정
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [sortBy, setSortBy] = useState('name');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const toast = useToast();


// 루틴 목록 조회
useEffect(() => {
  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const response = await routineApi.getAll();
      console.log('Fetched routines:', response.data); // 디버깅용

      // 데이터 형식 변환 및 기본값 설정
      const formattedRoutines = response.data.map(routine => ({
        ...routine,
        completedDates: routine.completed_dates || {}, // snake_case를 camelCase로 변환
        color_theme: routine.color_theme || {  // 기본 color_theme 설정
          theme: 'green',
          intensity: 0
        },
        notification: routine.notification || {  // 기본 notification 설정
          enabled: false,
          time: "09:00"
        }
      }));

      console.log('Formatted routines:', formattedRoutines); // 디버깅용
      setRoutines(formattedRoutines);
    } catch (err) {
      setError('루틴을 불러오는데 실패했습니다.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchRoutines();
}, []);

  // 루틴 추가
  const handleAddRoutine = async (newRoutine) => {
    try {
      const response = await routineApi.create(newRoutine);
      setRoutines(prev => [...prev, response.data]);
      toast({
        title: '루틴이 추가되었습니다.',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: '루틴 추가에 실패했습니다.',
        status: 'error',
        duration: 2000,
      });
    }
  };

  // 루틴 수정
const handleUpdateRoutine = async (id, updatedRoutine) => {
  try {
    console.log('Updating routine:', updatedRoutine); // 디버깅용
    const response = await routineApi.update(id, updatedRoutine);
    setRoutines(prev => prev.map(routine => 
      routine.id === id 
        ? {
            ...routine,           // 기존 데이터 유지
            ...response.data,     // 새로운 데이터로 업데이트
            completedDates: routine.completedDates, // 기존 completedDates 유지
            color_theme: updatedRoutine.color_theme // 새로운 color_theme 사용
          }
        : routine
    ));
    toast({
      title: '루틴이 수정되었습니다.',
      status: 'success',
      duration: 2000,
    });
  } catch (err) {
    console.error('Update error:', err);
    toast({
      title: '루틴 수정에 실패했습니다.',
      status: 'error',
      duration: 2000,
    });
  }
};

  // 루틴 삭제
  const handleDeleteRoutine = async (id) => {
    try {
      await routineApi.delete(id);
      setRoutines(prev => prev.filter(routine => routine.id !== id));
      toast({
        title: '루틴이 삭제되었습니다.',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: '루틴 삭제에 실패했습니다.',
        status: 'error',
        duration: 2000,
      });
    }
  };

  // 루틴 완료 체크
  const handleCompleteRoutine = async (id, date) => {
    try {
      const response = await routineApi.completeRoutine(id, date);
      setRoutines(prev => prev.map(routine => {
        if (routine.id === id) {
          return {
            ...routine,
            completedDates: response.data.completed_dates
          };
        }
        return routine;
      }));
      toast({
        title: '루틴을 완료했습니다.',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      console.error('Complete error:', err);
      toast({
        title: '루틴 완료 처리에 실패했습니다.',
        status: 'error',
        duration: 2000,
      });
    }
  };

  // 루틴 완료 해제
  const handleUncompleteRoutine = async (id, date) => {
    try {
      const response = await routineApi.uncompleteRoutine(id, date);
      setRoutines(prev => prev.map(routine => {
        if (routine.id === id) {
          return {
            ...routine,
            completedDates: response.data.completed_dates
          };
        }
        return routine;
      }));
      toast({
        title: '루틴 완료를 취소했습니다.',
        status: 'info',
        duration: 2000,
      });
    } catch (err) {
      console.error('Uncomplete error:', err);
      toast({
        title: '루틴 완료 해제에 실패했습니다.',
        status: 'error',
        duration: 2000,
      });
    }
  };

  // 알림 권한 요청
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // // 로컬 스토리지에 데이터 저장
  // useEffect(() => {
  //   localStorage.setItem('routines', JSON.stringify(routines));
  // }, [routines]);

  // 알림 체크
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      routines.forEach(routine => {
        if (routine.notification?.enabled && 
            routine.notification.time === currentTime &&
            !routine.completedDates?.[now.toISOString().split('T')[0]]) {
          new Notification(`${routine.title} 할 시간입니다!`, {
            body: routine.description || '루틴을 완료해주세요.',
            icon: '/favicon.ico'
          });
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // 1분마다 체크
    return () => clearInterval(interval);
  }, [routines]);

  // 필터링 및 정렬된 루틴 계산
  const filteredAndSortedRoutines = useMemo(() => {
    let filtered = routines;
    if (categoryFilter !== 'all') {
      filtered = routines.filter(routine => routine.category === categoryFilter);
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'date') {
        return b.id - a.id;
      }
      if (sortBy === 'completion') {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        });
        
        const getCompletionRate = (routine) => {
          const completed = last7Days.filter(date => routine.completedDates?.[date]).length;
          return completed / 7;
        };
        
        return getCompletionRate(b) - getCompletionRate(a);
      }
      return 0;
    });
  }, [routines, sortBy, categoryFilter]);

  // const handleAddRoutine = (newRoutine) => {
  //   setRoutines([...routines, { 
  //     ...newRoutine, 
  //     id: Date.now(),
  //     completedDates: {},
  //     notification: { enabled: false, time: '09:00' },
  //     colorTheme: newRoutine.colorTheme || 'green'  // 색상 테마 추가
  //   }]);
    
  //   toast({
  //     title: '루틴이 추가되었습니다.',
  //     status: 'success',
  //     duration: 2000,
  //     isClosable: true,
  //   });
  // };

  // // 루틴 삭제 핸들러
  // const handleDeleteRoutine = (id) => {
  //   setRoutines(routines.filter(routine => routine.id !== id));
    
  //   toast({
  //     title: '루틴이 삭제되었습니다.',
  //     status: 'info',
  //     duration: 2000,
  //     isClosable: true,
  //   });
  // };

  // // 루틴 수정 핸들러
  // const handleUpdateRoutine = (id, updatedRoutine) => {
  //   setRoutines(routines.map(routine => 
  //     routine.id === id ? updatedRoutine : routine
  //   ));

  //   toast({
  //     title: '루틴이 수정되었습니다.',
  //     status: 'success',
  //     duration: 2000,
  //     isClosable: true,
  //   });
  // };

  // 루틴 완료 토글 핸들러
  // const handleToggleComplete = (id, date) => {
  //   setRoutines(routines.map(routine => {
  //     if (routine.id === id) {
  //       const completedDates = { ...routine.completedDates };
  //       completedDates[date] = !completedDates[date];
  //       return { ...routine, completedDates };
  //     }
  //     return routine;
  //   }));
  // };

  // 데이터 가져오기 핸들러
  const handleImportData = (importedData) => {
    setRoutines(importedData);
    toast({
      title: '데이터를 성공적으로 가져왔습니다.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={6}>
        <VStack spacing={6}>
          <Box w="full" bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <Heading size="lg" mb={4}>Habit Tracker</Heading>
            <VStack spacing={4}>
              <RoutineForm onAdd={handleAddRoutine} />
              <DataManagement 
                routines={routines}
                onImport={handleImportData}
              />
            </VStack>
          </Box>

          <Box w="full" bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <VStack align="stretch" spacing={4}>
              <Flex align="center" gap={4} wrap="wrap">
                <Heading size="md">나의 루틴 ({filteredAndSortedRoutines.length})</Heading>
                <Spacer />
                <RoutineSort
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </Flex>

              <CategorySelect
                value={categoryFilter}
                onChange={setCategoryFilter}
                isFilter={true}
              />

              {filteredAndSortedRoutines.length === 0 ? (
                <Box textAlign="center" py={4} color="gray.500">
                  {routines.length === 0 ?
                    "아직 등록된 루틴이 없습니다." :
                    "해당 카테고리의 루틴이 없습니다."
                  }
                </Box>
              ) : (
                filteredAndSortedRoutines.map(routine => (
                  <RoutineItem
                    key={routine.id}
                    routine={routine}
                    onDelete={handleDeleteRoutine}
                    onUpdate={handleUpdateRoutine}
                    onComplete={handleCompleteRoutine}
                    onUnComplete={handleUncompleteRoutine}

                  />
                ))
              )}
            </VStack>
          </Box>
          
          {routines.length > 0 && (
            <Statistics routines={filteredAndSortedRoutines} />
          )}
          

        </VStack>
      </Container>
    </Box>
  );
}

export default App;