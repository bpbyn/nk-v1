import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Input,
  useEditableControls,
} from '@chakra-ui/react';
import React from 'react';

interface EditableProps {
  onChange: (category: string, note: string) => void;
  value: string;
}

const EditableNotes: React.FC<EditableProps> = ({ onChange, value }) => {
  return (
    <Editable
      placeholder="Customer name"
      fontSize={{ base: 'lg', md: 'xl' }}
      isPreviewFocusable={true}
      selectAllOnFocus={false}
      startWithEditView={value ? false : true}
      defaultValue={value}
      onSubmit={(e) => onChange('customerName', e)}
      w="80%"
      display="flex"
    >
      <EditablePreview
        borderBottom="2px solid #DF8527"
        borderRadius="none"
        w="50%"
      />
      <Input
        max={2}
        as={EditableInput}
        variant="flushed"
        fontSize={{ base: 'md', md: 'lg' }}
        // onChange={(e) => setValue(e)}
        focusBorderColor="orange.500"
        _focusVisible={{
          boxShadow: 'none',
          borderBottom: '1px solid #DF8527',
        }}
      />
      <EditableControls />
    </Editable>
  );
};

const EditableControls = () => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm" w="full" pt={3}>
      <IconButton
        aria-label="Close Icon"
        size="xs"
        variant="outline"
        colorScheme="orange"
        borderRadius={100}
        icon={<CloseIcon />}
        {...getCancelButtonProps()}
      />
      <IconButton
        aria-label="Check Icon"
        size="xs"
        variant="outline"
        colorScheme="orange"
        borderRadius={100}
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
    </ButtonGroup>
  ) : null;
};

export default EditableNotes;
