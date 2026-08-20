const express = require("express");
const cors = require("cors");

const { sequelize } = require("./models");

const kitRoutes = require("./routes/kitRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/kits", kitRoutes);
app.use("/api/auth", authRoutes);

sequelize.sync().then(() => {

    console.log("Database Connected");

    app.listen(5000, () => {

        console.log("Server running on http://localhost:5000");

    });

});