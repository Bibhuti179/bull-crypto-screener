const cron = require("node-cron");

const { scanMarket } = require("./scannerService");

const startScheduler = () => {

    console.log("Scheduler Started...");

    // Every hour at HH:00:05 UTC
    cron.schedule("5 0 * * * *", async () => {

        console.log("=================================");
        console.log("Automatic Scan Started");
        console.log("=================================");

        try {

            await scanMarket();

        } catch (error) {

            console.log(error.message);

        }

    }, {
        timezone: "UTC"
    });

};

module.exports = startScheduler;