import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { BiShowAlt, BiHide } from 'react-icons/bi';

import { getDocument } from '../lib/api/service';

const SecurityWrapper = ({ allowLogIn }) => {
  const router = useRouter();
  const { onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [storedPassword, setStoredPassword] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState(null);
  const handleClick = () => setShowPassword(!showPassword);
  const handlePassword = (e) => {
    setPassword(e.target.value);

    if (e.target.value === storedPassword) {
      allowLogIn(true);
    }
  };

  useEffect(() => {
    getDocument('security', 'analytics').then((result) => {
      if (result) setStoredPassword(result.data().password);
    });
  }, []);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent margin="auto" width={350} borderRadius={20} bg="gray.100">
        <ModalBody px="0.5rem">
          <Flex align="center" justify="space-around">
            <IconButton
              size="sm"
              colorScheme="green"
              borderRadius={100}
              aria-label="Go Back"
              mr="1rem"
              icon={<ChevronLeftIcon onClick={() => router.back()} />}
            />
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                focusBorderColor="nk_orange"
                variant="filled"
                onChange={handlePassword}
              />
              <InputRightElement width="3.5rem">
                <IconButton
                  size="sm"
                  colorScheme="orange"
                  borderRadius={100}
                  onClick={handleClick}
                  aria-label="Show Password"
                  icon={showPassword ? <BiHide /> : <BiShowAlt />}
                />
              </InputRightElement>
            </InputGroup>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SecurityWrapper;
