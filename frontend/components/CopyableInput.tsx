import { Input, InputGroup, InputRightElement, IconButton, FormControl, FormLabel, InputProps } from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { useState } from 'react';

interface CopyableInputProps extends InputProps {
  label: string;
  value: string;
  isReadOnly?: boolean;
  onChange?: (value: string) => void;
}

export const CopyableInput = ({
  label,
  value,
  isReadOnly = true,  // Default to true for backward compatibility
  onChange,
  ...rest
}: CopyableInputProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <FormControl>
      <FormLabel color="white">{label}</FormLabel>
      <InputGroup>
        <Input
          value={value}
          isReadOnly={isReadOnly}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          bg="gray.700"
          borderColor="gray.600"
          color="white"
          _hover={{ borderColor: 'blue.500' }}
          {...rest}
        />
        {isReadOnly && (  // Only show copy button in read-only mode
          <InputRightElement width="4.5rem">
            <IconButton
              h="1.75rem"
              size="sm"
              onClick={() => copyToClipboard(value)}
              icon={isCopied ? <CheckIcon color="green.500" /> : <CopyIcon />}
              aria-label="Copy to clipboard"
              variant="ghost"
              _hover={{ bg: 'transparent' }}
              isDisabled={!value}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};
