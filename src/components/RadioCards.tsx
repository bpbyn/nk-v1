import { Box, Flex, useRadio, useRadioGroup } from '@chakra-ui/react';

import { MenuDetails } from '../types';

interface RadioCardsProps {
  menu: MenuDetails;
  onChange: (size: string | number, id: string, category: string) => void;
}

const RadioCards: React.FC<RadioCardsProps> = ({ menu, onChange }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: `${menu.id}`,
    onChange: (e) => onChange(e, menu.id, 'size'),
  });

  const group = getRootProps();

  return (
    <Flex justify="start" gap={1} {...group}>
      {Object.keys(menu.price)
        .sort()
        .reverse()
        .map((size, i) => {
          const radio = getRadioProps({
            value: `${size}`,
          });
          return (
            <RadioCard key={`${i}-${menu.id}`} {...radio}>
              {size.toLocaleLowerCase()}
            </RadioCard>
          );
        })}
    </Flex>
  );
};

export default RadioCards;

const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius={20}
        textTransform="capitalize"
        fontSize="sm"
        _checked={{
          bg: 'nk_orange',
          color: 'white',
          transitionDuration: '.2s',
          transitionTimingFunction: 'linear',
        }}
        _focus={{
          bg: 'nk_orange',
          color: 'white',
        }}
        _active={{
          bg: 'nk_orange',
          color: 'white',
        }}
        _hover={{
          bg: 'nk_orange',
          color: 'white',
          transitionDuration: '.2s',
          transitionTimingFunction: 'linear',
        }}
        py={1}
        px={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};
