import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack
} from '@chakra-ui/react';

import { CopyableInput } from '../components/CopyableInput';

const PAIRS = ["SOL/USDT", "ETH/USDT", "XRP/USDT"];

interface PreTradeResponse {
  entry_price: number;
  quantity: number;
  stop_loss_price: number;
  take_profit_price: number;
}

interface PostTradeResponse {
  stop_loss_price: number;
  take_profit_price: number;
}

export default function TradingCalculator() {
  const [pair, setPair] = useState<string>(PAIRS[0]);
  const [leverage, setLeverage] = useState<number>(2);
  const [stopLoss, setStopLoss] = useState<number>(1.5);
  const [takeProfit, setTakeProfit] = useState<number>(3.0);
  const [balance, setBalance] = useState<string>('');
  const [positionSize, setPositionSize] = useState<string>('');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLossPrice, setStopLossPrice] = useState<string>('');
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>('');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [isFirstCallComplete, setIsFirstCallComplete] = useState(false);
  const toast = useToast();

  const handleNumericInput = (value: string, setter: (value: string) => void) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const calculatePreTrade = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/calculate/pre-trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pair,
          leverage: Number(leverage),
          stop_loss_percent: stopLoss,
          take_profit_percent: takeProfit,
          balance: Number(balance) || 0,
          side
        }),
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      const data: PreTradeResponse = await response.json();
      setEntryPrice(data.entry_price.toString());
      setPositionSize(data.quantity.toString());
      setStopLossPrice(data.stop_loss_price.toString());
      setTakeProfitPrice(data.take_profit_price.toString());
    } catch (error) {
        setIsFirstCallComplete(false);  // Reset on error
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to calculate',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const calculatePostTrade = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/calculate/post-trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pair,
          leverage: Number(leverage),
          stop_loss_percent: stopLoss,
          take_profit_percent: takeProfit,
          balance: Number(balance) || 0,
          side,
          entry_price: Number(entryPrice) || 0,
          quantity: Number(positionSize) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      const data: PostTradeResponse = await response.json();
      setStopLossPrice(data.stop_loss_price.toString());
      setTakeProfitPrice(data.take_profit_price.toString());
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to calculate',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Card bg="gray.800" color="white">
        <CardHeader>
          <Heading size="md" color="white">Trading Calculator</Heading>
        </CardHeader>
        <CardBody>
          <HStack align="start" spacing={8}>
            {/* --- Left Panel - Trading Parameters --- */}
            <VStack spacing={6} align="stretch" w={40}>
                <CopyableInput
                  label="Balance (USDT)"
                  isReadOnly={false}
                  onChange={setBalance}
                  precision={4}
                />

              <FormControl>
                <FormLabel color="white">Side</FormLabel>
                <Select
                  value={side}
                  onChange={(e) => setSide(e.target.value as 'BUY' | 'SELL')}
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: 'blue.500' }}
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel color="white">Pair</FormLabel>
                <Select
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: 'blue.500' }}
                >
                  {PAIRS.map((p) => (
                    <option key={p} value={p} style={{ backgroundColor: '#1a202c' }}>
                      {p}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel color="white">Leverage</FormLabel>
                <NumberInput
                  min={1}
                  max={10}
                  step={1}
                  value={leverage}
                  onChange={(valueString) => setLeverage(parseFloat(valueString))}
                  precision={0}
                >
                  <NumberInputField bg="gray.700" borderColor="gray.600" color="white" _hover={{ borderColor: 'blue.500' }} />
                  <NumberInputStepper>
                    <NumberIncrementStepper color="white" />
                    <NumberDecrementStepper color="white" />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel color="white">Stop Loss %</FormLabel>
                <NumberInput
                  min={0}
                  max={50}
                  step={0.5}
                  value={stopLoss}
                  onChange={(valueString) => setStopLoss(parseFloat(valueString))}
                  precision={1}
                >
                  <NumberInputField bg="gray.700" borderColor="gray.600" color="white" _hover={{ borderColor: 'blue.500' }} />
                  <NumberInputStepper>
                    <NumberIncrementStepper color="white" />
                    <NumberDecrementStepper color="white" />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel color="white">Take Profit %</FormLabel>
                <NumberInput
                  min={0}
                  max={50}
                  step={0.5}
                  value={takeProfit}
                  onChange={(valueString) => setTakeProfit(parseFloat(valueString))}
                  precision={1}
                >
                  <NumberInputField bg="gray.700" borderColor="gray.600" color="white" _hover={{ borderColor: 'blue.500' }} />
                  <NumberInputStepper>
                    <NumberIncrementStepper color="white" />
                    <NumberDecrementStepper color="white" />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Button
                colorScheme="blue"
                width="100%"
                onClick={calculatePreTrade}
                mt={4}
              >
                Pre-Trade
              </Button>
            </VStack>

            {/* --- Right Panel - Position Details ---  */}
            <VStack spacing={6} align="stretch" w={48} mt={48} ml={8}>
                <CopyableInput
                  label="Entry Price (USDT)"
                  value={entryPrice}
                  placeholder="0.0000"
                />
              <FormControl>
                <FormLabel color="white">Quantity</FormLabel>
                <NumberInput
                  value={positionSize}
                  onChange={(valueString) => setPositionSize(valueString)}
                  precision={4}
                >
                  <NumberInputField
                    placeholder="0.0000"
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: 'blue.500' }}
                  />
                </NumberInput>
              </FormControl>

                <CopyableInput
                  label="Stop Loss Price (USDT)"
                  value={stopLossPrice}
                />

                <CopyableInput
                  label="Take Profit Price (USDT)"
                  value={takeProfitPrice}
                />

              <Button
                colorScheme="green"
                variant="outline"
                width="100%"
                mt={4}
                onClick={calculatePostTrade}
                isDisabled={!isFirstCallComplete}  // Disable until first call succeeds
              >
                Re-calculate TP/SL
              </Button>
            </VStack>
          </HStack>
        </CardBody>
      </Card>
    </Container>
  );
}
