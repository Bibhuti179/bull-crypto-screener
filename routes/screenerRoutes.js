const express = require("express");

const {
    runManualScan,
} = require("../controllers/screenerController");

const router = express.Router();

router.get("/scan", runManualScan);

module.exports = router;