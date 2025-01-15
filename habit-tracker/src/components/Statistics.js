import {
    Box,
    Heading,
    Text,
    Progress,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
  } from '@chakra-ui/react';
  
  function Statistics({ routines }) {
    const today = new Date().toISOString().split('T')[0];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });
  
    // 오늘의 완료율 계산
    const todayCompleted = routines.filter(r => r.completedDates?.[today]).length;
    const todayCompletionRate = (todayCompleted / routines.length) * 100 || 0;
  
    // 주간 완료율 계산
    const weeklyCompletions = routines.reduce((acc, routine) => {
      let completed = 0;
      last7Days.forEach(date => {
        if (routine.completedDates?.[date]) completed++;
      });
      return acc + (completed / 7);
    }, 0);
    const weeklyCompletionRate = (weeklyCompletions / routines.length) * 100 || 0;
  
    return (
      <Box w="full" bg="white" p={6} borderRadius="lg" boxShadow="sm">
        <Heading size="md" mb={6}>통계</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Stat mb={4}>
              <StatLabel>오늘의 완료율</StatLabel>
              <StatNumber>{todayCompletionRate.toFixed(1)}%</StatNumber>
              <StatHelpText>
                {todayCompleted}/{routines.length} 완료
              </StatHelpText>
            </Stat>
            <Progress 
              value={todayCompletionRate} 
              colorScheme="green" 
              size="lg" 
              borderRadius="full"
            />
          </Box>
  
          <Box>
            <Stat mb={4}>
              <StatLabel>주간 평균 완료율</StatLabel>
              <StatNumber>{weeklyCompletionRate.toFixed(1)}%</StatNumber>
              <StatHelpText>지난 7일 평균</StatHelpText>
            </Stat>
            <Progress 
              value={weeklyCompletionRate} 
              colorScheme="blue" 
              size="lg" 
              borderRadius="full"
            />
          </Box>
        </SimpleGrid>
  
        {routines.map(routine => {
          const weeklyRoutineCompletions = last7Days.filter(
            date => routine.completedDates?.[date]
          ).length;
          const routineCompletionRate = (weeklyRoutineCompletions / 7) * 100;
  
          return (
            <Box key={routine.id} mt={6}>
              <Text fontWeight="medium" mb={2}>{routine.title}</Text>
              <Progress 
                value={routineCompletionRate} 
                colorScheme="purple" 
                size="sm" 
                borderRadius="full"
              />
              <Text fontSize="sm" color="gray.600" mt={1}>
                주간 완료율: {routineCompletionRate.toFixed(1)}%
              </Text>
            </Box>
          );
        })}
      </Box>
    );
  }
  
  export default Statistics;