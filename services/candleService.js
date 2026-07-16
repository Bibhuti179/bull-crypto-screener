const { BB_PERIOD, BB_STD_DEV } = require("../config/constants");

/*
|--------------------------------------------------------------------------
| Convert Normal Candles to Heikin Ashi
|--------------------------------------------------------------------------
*/

const convertToHeikinAshi = (candles) => {

    const haCandles = [];

    let previousHaOpen;
    let previousHaClose;

    candles.forEach((candle, index) => {

       const open = Number(candle.open);
const high = Number(candle.high);
const low = Number(candle.low);
const close = Number(candle.close);

        const haClose = (open + high + low + close) / 4;

        let haOpen;

        if (index === 0) {
            haOpen = (open + close) / 2;
        } else {
            haOpen = (previousHaOpen + previousHaClose) / 2;
        }

        const haHigh = Math.max(high, haOpen, haClose);

        const haLow = Math.min(low, haOpen, haClose);

        haCandles.push({

            open: haOpen,

            high: haHigh,

            low: haLow,

            close: haClose,

           openTime: candle.time,

closeTime: candle.time

        });

        previousHaOpen = haOpen;

        previousHaClose = haClose;

    });

    return haCandles;
};

/*
|--------------------------------------------------------------------------
| Simple Moving Average
|--------------------------------------------------------------------------
*/

const calculateSMA = (values) => {

    const sum = values.reduce((a, b) => a + b, 0);

    return sum / values.length;
};

/*
|--------------------------------------------------------------------------
| Standard Deviation
|--------------------------------------------------------------------------
*/

const calculateStandardDeviation = (values, mean) => {

    const variance =
        values.reduce((sum, value) => {

            return sum + Math.pow(value - mean, 2);

        }, 0) / values.length;

    return Math.sqrt(variance);
};

/*
|--------------------------------------------------------------------------
| Bollinger Bands
|--------------------------------------------------------------------------
*/

const applyBollingerBands = (haCandles) => {

    for (let i = 0; i < haCandles.length; i++) {

        if (i < BB_PERIOD - 1) {

            haCandles[i].upperBB = null;
            haCandles[i].middleBB = null;
            haCandles[i].lowerBB = null;

            continue;
        }

        const closes = haCandles
            .slice(i - BB_PERIOD + 1, i + 1)
            .map(candle => candle.close);

        const sma = calculateSMA(closes);

        const std = calculateStandardDeviation(closes, sma);

        haCandles[i].middleBB = sma;

        haCandles[i].upperBB =
            sma + (BB_STD_DEV * std);

        haCandles[i].lowerBB =
            sma - (BB_STD_DEV * std);

    }

    return haCandles;
};

module.exports = {

    convertToHeikinAshi,

    applyBollingerBands

};