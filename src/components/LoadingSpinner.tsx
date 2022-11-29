import { Center, Flex, Spinner } from '@chakra-ui/react';

const LoadingSpinner: React.FC = () => {
  return (
    <Center as={Flex} align="center" h="full">
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
