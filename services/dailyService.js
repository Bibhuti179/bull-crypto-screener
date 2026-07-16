const getPreviousDailyCandle = (referenceHourCandle, dailyCandles) => {

    const referenceDate = new Date(referenceHourCandle.closeTime);

    referenceDate.setUTCHours(0, 0, 0, 0);

    for (let i = dailyCandles.length - 1; i >= 0; i--) {

        const dailyDate = new Date(dailyCandles[i].openTime);

        dailyDate.setUTCHours(0, 0, 0, 0);

        if (dailyDate.getTime() < referenceDate.getTime()) {
            return dailyCandles[i];
        }
    }

    return null;
};

module.exports = {
    getPreviousDailyCandle
};