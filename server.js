require("dotenv").config();

const express = require("express");
const cors = require("cors");

const screenerRoutes = require("./routes/screenerRoutes");
const startScheduler = require("./services/schedulerService");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/screener", screenerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);

    startScheduler();
});