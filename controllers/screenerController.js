const { scanMarket } = require("../services/scannerService");

const runManualScan = async (req, res) => {
    try {
        const result = await scanMarket();

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    runManualScan,
};