import { Select, HStack, Text } from '@chakra-ui/react';

function RoutineSort({ sortBy, onSortChange }) {
  return (
    <HStack spacing={3}>
      <Text fontSize="sm" color="gray.600">정렬:</Text>
      <Select 
        size="sm" 
        width="200px" 
        value={sortBy} 
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="name">이름순</option>
        <option value="date">생성일순</option>
        <option value="completion">완료율순</option>
      </Select>
    </HStack>
  );
}

export default RoutineSort;