import { Center, Spinner } from '@chakra-ui/react';

function LoadingSpinner() {
  return (
    <Center h="200px">
      <Spinner size="xl" />
    </Center>
  );
}

export default LoadingSpinner;