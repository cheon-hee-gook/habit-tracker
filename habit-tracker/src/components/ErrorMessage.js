import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';

function ErrorMessage({ message }) {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}

export default ErrorMessage;