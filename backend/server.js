const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");

const kitRoutes = require("./routes/kitRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/kits", kitRoutes);

sequelize.sync().then(() => {

    console.log("Database Connected");

    app.listen(5000, () => {

        console.log("Server running on http://localhost:5000");

    });

});