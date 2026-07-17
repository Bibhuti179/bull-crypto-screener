const {
    getAllFutureSymbols,
    getCandles,
} = require("./coindcxService");

const {
    convertToHeikinAshi,
    applyBollingerBands,
} = require("./candleService");

const {
    getPreviousDailyCandle,
} = require("./dailyService");

const {
    checkStrategy1,
} = require("./strategy1Service");

const {
    checkStrategy2,
} = require("./strategy2Service");

const { convertToIST } = require("../utils/timeUtils");

const sleep = require("../utils/sleep");

const {
    TIMEFRAME,
    DAILY_TIMEFRAME,
    BATCH_SIZE,
    BATCH_DELAY,
} = require("../config/constants");

/*
|--------------------------------------------------------------------------
| Scan Single Symbol
|--------------------------------------------------------------------------
*/

const scanSingleSymbol = async (symbol) => {

    try {

        console.log(`Scanning : ${symbol}`);

        const [hourlyRaw, dailyRaw] = await Promise.all([

            getCandles(symbol, TIMEFRAME, 120),

            getCandles(symbol, DAILY_TIMEFRAME, 40)

        ]);

        if (
            hourlyRaw.length < 50 ||
            dailyRaw.length < 5
        ) {
            return null;
        }

        // Remove currently forming candle
        hourlyRaw.pop();
        dailyRaw.pop();

        let hourlyCandles =
            convertToHeikinAshi(hourlyRaw);
            console.log("\n================ NORMAL CANDLES ================");

console.table(hourlyRaw.slice(-5));

console.log("\n================ HEIKIN ASHI ================");

console.table(hourlyCandles.slice(-5));

        let dailyCandles =
            convertToHeikinAshi(dailyRaw);

        hourlyCandles =
    applyBollingerBands(hourlyRaw, hourlyCandles);
            console.log("\n==============================");
console.log(`${symbol} 1H Heikin Ashi`);
console.log("==============================");

const last4 = hourlyCandles.slice(-4);

last4.forEach((candle, index) => {

    console.log({

        Candle: index - 3,

        Time: convertToIST(candle.closeTime),

        Open: candle.open,

        High: candle.high,

        Low: candle.low,

        Close: candle.close,

        UpperBB: candle.upperBB,

        LowerBB: candle.lowerBB,

        MiddleBB: candle.middleBB,

        Green: candle.close > candle.open,

        NoLowerWick:
            Math.abs(candle.low - candle.open) < 0.00000001,

        CloseAboveUpperBB:
            candle.close >= candle.upperBB

    });

});

        dailyCandles =
    applyBollingerBands(dailyRaw, dailyCandles);
            console.log("\n==============================");
console.log(`${symbol} Daily Heikin Ashi`);
console.log("==============================");

const last2Daily = dailyCandles.slice(-2);

last2Daily.forEach((candle, index) => {

    console.log({

        Candle: index - 1,

        Time: convertToIST(candle.closeTime),

        Open: candle.open,

        High: candle.high,

        Low: candle.low,

        Close: candle.close,

        Green: candle.close > candle.open

    });

});

        //-------------------------------------
        // Strategy 1
        //-------------------------------------

        const strategy1Reference =
            hourlyCandles[hourlyCandles.length - 2];

        const strategy1Daily =
            getPreviousDailyCandle(
                strategy1Reference,
                dailyCandles
            );

        const strategy1Signal =
            checkStrategy1(
                hourlyCandles,
                strategy1Daily,
                symbol
            );

        //-------------------------------------
        // Strategy 2
        //-------------------------------------

        const strategy2Reference =
            hourlyCandles[hourlyCandles.length - 3];

        const strategy2Daily =
            getPreviousDailyCandle(
                strategy2Reference,
                dailyCandles
            );

        const strategy2Signal =
            checkStrategy2(
                hourlyCandles,
                strategy2Daily,
                symbol
            );

        if (strategy1Signal) {
            strategy1Signal.candleTime =
                convertToIST(strategy1Signal.candleTime);
        }

        if (strategy2Signal) {
            strategy2Signal.candleTime =
                convertToIST(strategy2Signal.candleTime);
        }

        return {

            strategy1Signal,

            strategy2Signal

        };

    } catch (error) {

        console.log(`${symbol} : ${error.message}`);

        return null;

    }

};
/*
|--------------------------------------------------------------------------
| Scan Market
|--------------------------------------------------------------------------
*/

const scanMarket = async () => {

    try {

        console.log("======================================");
        console.log("CRYPTO SCREENER STARTED");
        console.log("======================================");

       const symbols = await getAllFutureSymbols();
      //const symbols = ["B-ESPORTS_USDT"];
       // DEBUG ONLY
          // const symbols = ["BTCUSDT"];
       // console.log(`Total Symbols : ${symbols.length}`);

        const strategy1Signals = [];
        const strategy2Signals = [];

        for (let i = 0; i < symbols.length; i += BATCH_SIZE) {

            const batch = symbols.slice(i, i + BATCH_SIZE);

            const results = await Promise.all(

                batch.map(symbol => scanSingleSymbol(symbol))

            );

            for (const result of results) {

                if (!result) continue;

                if (result.strategy1Signal) {
                    strategy1Signals.push(result.strategy1Signal);
                }

                if (result.strategy2Signal) {
                    strategy2Signals.push(result.strategy2Signal);
                }

            }

            console.log(
                `Completed : ${Math.min(i + BATCH_SIZE, symbols.length)} / ${symbols.length}`
            );

            if (i + BATCH_SIZE < symbols.length) {
                await sleep(BATCH_DELAY);
            }

        }

        console.log("======================================");
        console.log("SCANNING COMPLETED");
        console.log("======================================");

        return {

            success: true,

            scannedSymbols: symbols.length,

            strategy1Count: strategy1Signals.length,

            strategy2Count: strategy2Signals.length,

            strategy1: strategy1Signals,

            strategy2: strategy2Signals

        };

    } catch (error) {

        console.log(error.message);

        return {

            success: false,

            message: error.message

        };

    }

};

module.exports = {
    scanMarket
};