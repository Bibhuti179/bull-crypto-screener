const axios = require("axios");

const BASE_URL = "https://api.coindcx.com";

/*
|--------------------------------------------------------------------------
| Get All Active Futures Symbols
|--------------------------------------------------------------------------
*/

const getAllFutureSymbols = async () => {

    try {

        const { data } = await axios.get(
            `${BASE_URL}/exchange/v1/derivatives/futures/data/active_instruments`
        );

        console.log(`Total Active Futures : ${data.length}`);

        return data;

    } catch (error) {

        console.log("Error Fetching Symbols :", error.message);

        return [];

    }

};
/*
|--------------------------------------------------------------------------
| Get Candles
|--------------------------------------------------------------------------
*/

const getCandles = async (
    symbol,
    interval,
    limit = 120
) => {

    try {

        const { data } = await axios.get(
            `${BASE_URL}/market_data/candles`,
            {
                params: {
                    pair: symbol,
                    interval,
                    limit,
                },
                timeout: 10000,
            }
        );
        console.log("================================");
console.log(symbol, interval);
console.dir(data[0], { depth: null });
console.log("================================");

        /*
        CoinDCX returns latest candle first.

        We convert to oldest → newest
        */

        return data.reverse();
        console.log("\nLast 3 Candles Returned");

console.log(data.slice(-3));

    } catch (error) {

        console.log(`${symbol} : ${error.message}`);

        return [];

    }

};

module.exports = {

    getAllFutureSymbols,

    getCandles,

};