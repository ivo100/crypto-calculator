from crypto import StopLossCalc, TickerData

symbol = 'SOL'
pair = f"{symbol}/USDT"

calc = StopLossCalc()
calc.read_ticker(pair)
