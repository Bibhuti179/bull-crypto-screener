const isGreen = (candle) => {
    return candle.close > candle.open;
};

const hasNoLowerWick = (candle) => {
    return Math.abs(candle.low - candle.open) < 0.00000001;
};

const closeAboveUpperBB = (candle) => {
    return candle.upperBB !== null && candle.close >= candle.upperBB;
};

const closeBelowUpperBB = (candle) => {
    return candle.upperBB !== null && candle.close < candle.upperBB;
};

const checkStrategy1 = (hourlyCandles, dailyCandle, symbol) => {

    if (hourlyCandles.length < 3 || !dailyCandle) {
        return null;
    }

    const C0 = hourlyCandles[hourlyCandles.length - 1];
    const C1 = hourlyCandles[hourlyCandles.length - 2];
    const C2 = hourlyCandles[hourlyCandles.length - 3];

    if (
        isGreen(C0) &&
        closeAboveUpperBB(C0) &&
        hasNoLowerWick(C0) &&

        isGreen(C1) &&
        closeAboveUpperBB(C1) &&
        hasNoLowerWick(C1) &&

        isGreen(C2) &&
        closeBelowUpperBB(C2) &&

        isGreen(dailyCandle)
    ) {

        return {
            strategy: "Strategy 1",
            symbol,
            currentHigh: C0.high,
            previousLow: C1.low,
            candleTime: convertToIST(C0.closeTime)
        };
    }

    return null;
};

module.exports = {
    checkStrategy1
};