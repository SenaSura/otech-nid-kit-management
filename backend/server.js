const express = require("express");
const cors = require("cors");

const { sequelize, User } = require("./models");
const { hashPassword } = require("./controllers/authController");

const kitRoutes = require("./routes/kitRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/kits", kitRoutes);
app.use("/api/auth", authRoutes);

sequelize.sync().then(async () => {

    const userColumns = await sequelize.getQueryInterface().describeTable("Users");
    if (!userColumns.role) {
        await sequelize.getQueryInterface().addColumn("Users", "role", {
            type: "TEXT",
            allowNull: false,
            defaultValue: "user",
        });
    }

    const [admin, created] = await User.findOrCreate({
        where: { email: "admin" },
        defaults: {
            name: "Administrator",
            passwordHash: hashPassword("admin"),
            role: "admin",
        },
    });
    if (!created && admin.role !== "admin") {
        await admin.update({ role: "admin" });
    }

    console.log("Database Connected");

    app.listen(5000, () => {

        console.log("Server running on http://localhost:5000");

    });

});