module.exports = {

    TOP_SYMBOLS: Number(process.env.TOP_SYMBOLS) || 350,

    TIMEFRAME: process.env.TIMEFRAME || "1h",

    DAILY_TIMEFRAME: process.env.DAILY_TIMEFRAME || "1d",

    BB_PERIOD: Number(process.env.BB_PERIOD) || 20,

    BB_STD_DEV: Number(process.env.BB_STD_DEV) || 2,

    SCAN_DELAY_SECONDS: Number(process.env.SCAN_DELAY_SECONDS) || 5,

    BATCH_SIZE: Number(process.env.BATCH_SIZE) || 20,

    BATCH_DELAY: Number(process.env.BATCH_DELAY) || 300

};