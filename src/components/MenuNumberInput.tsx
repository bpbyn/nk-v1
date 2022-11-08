import { Button, HStack, Text, useControllableState } from '@chakra-ui/react';
import React from 'react';

const MenuNumberInput = ({ onChange, id, initialValue }) => {
  const [value, setValue] = useControllableState({
    defaultValue: initialValue,
    shouldUpdate: (prev, next) => {
      if (next >= 0) {
        onChange(next, id, 'quantity');
        return true;
      } else {
        return false;
      }
    },
  });

  return (
    <HStack maxW="320px" pt={2}>
      <Button
        size="xs"
        variant="outline"
        colorScheme="orange"
        borderRadius={100}
        disabled={value < 1}
        onClick={() => setValue(value - 1)}
      >
        -
      </Button>
      <Text fontSize="md">{value}</Text>
      <Button
        size="xs"
        variant="outline"
        colorScheme="orange"
        borderRadius={100}
        onClick={() => setValue(value + 1)}
      >
        +
      </Button>
    </HStack>
  );
};

export default MenuNumberInput;
