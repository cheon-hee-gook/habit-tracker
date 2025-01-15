import { Box, Tooltip, SimpleGrid, HStack, Button, Select } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { CONTRIBUTION_COLORS } from './RoutineForm';

function Calendar({ routine }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // 날짜가 선택된 연도에 속하는지 확인
  const isDateInSelectedYear = (date) => {
    return date.getFullYear() === selectedYear;
  };

  // 선택된 연도의 첫 주 시작일 구하기
  const getYearDates = () => {
    const weeks = [];
    const yearStart = new Date(Date.UTC(selectedYear, 0, 1));
    const yearEnd = new Date(Date.UTC(selectedYear, 11, 31));
  
    const firstWeekStart = new Date(yearStart);
    firstWeekStart.setUTCHours(0, 0, 0, 0);
    firstWeekStart.setDate(firstWeekStart.getDate() - firstWeekStart.getUTCDay());
  
    const lastWeekEnd = new Date(yearEnd);
    lastWeekEnd.setUTCHours(23, 59, 59, 999);
    lastWeekEnd.setDate(lastWeekEnd.getDate() + (6 - lastWeekEnd.getUTCDay()));
  
    let currentDate = new Date(firstWeekStart);
  
    while (currentDate <= lastWeekEnd) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push({
          date: new Date(currentDate),
          isInSelectedYear: isDateInSelectedYear(currentDate),
        });
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }
      weeks.push(week);
    }
  
    return weeks;
  };

  const weeks = getYearDates();

  // 색상 강도 계산
  const getColor = (date, isInSelectedYear) => {
    if (!isInSelectedYear) return '#ebedf0'; // 선택된 연도가 아닌 경우
    const dateStr = date.toISOString().split('T')[0];
    if (!routine.completedDates?.[dateStr]) return '#ebedf0'; // 완료되지 않은 날짜

    // color_theme 사용 (snake_case)
    const theme = routine.color_theme?.theme || 'green';
    const intensity = routine.color_theme?.intensity ?? 3;

    return CONTRIBUTION_COLORS[theme]?.colors[intensity] || '#ebedf0';
  };

  // 날짜 포맷팅
  const formatDate = (date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <Box p={2}>
      <HStack spacing={4} mb={4} justify="flex-end">
        <Button
          size="sm"
          leftIcon={<ChevronLeftIcon />}
          onClick={() => setSelectedYear(selectedYear - 1)}
        >
          이전
        </Button>
        <Select
          size="sm"
          width="120px"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(year => (
            <option key={year} value={year}>{year}년</option>
          ))}
        </Select>
        <Button
          size="sm"
          rightIcon={<ChevronRightIcon />}
          onClick={() => setSelectedYear(selectedYear + 1)}
        >
          다음
        </Button>
      </HStack>

      <SimpleGrid columns={weeks.length} spacing={1}>
        {weeks.map((week, weekIndex) => (
          <Box key={weekIndex}>
            {week.map(({ date, isInSelectedYear }) => {
              const dateStr = date.toISOString().split('T')[0];
              const isCompleted = routine.completedDates?.[dateStr];
              
              return (
                <Tooltip 
                  key={date.toISOString()} 
                  label={`${formatDate(date)} ${isCompleted ? '완료' : '미완료'}`}
                  hasArrow
                >
                  <Box
                    w="14px"
                    h="14px"
                    bg={getColor(date, isInSelectedYear)}
                    borderRadius="sm"
                    cursor="pointer"
                    opacity={isInSelectedYear ? 1 : 0.5}
                    _hover={{ transform: 'scale(1.2)' }}
                    transition="transform 0.2s"
                    mb={1}
                  />
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Calendar;