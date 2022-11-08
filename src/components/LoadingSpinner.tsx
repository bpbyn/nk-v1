import { Center, Spinner } from '@chakra-ui/react';

const LoadingSpinner: React.FC = () => {
  return (
    <Center position="fixed" bottom="50%" left="50%">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="nk_orange"
        size="xl"
      />
    </Center>
  );
};

export default LoadingSpinner;
