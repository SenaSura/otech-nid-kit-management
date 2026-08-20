const crypto = require("crypto");
const { User } = require("../models");

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
    const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${passwordHash}`;
};

const passwordMatches = (password, storedHash) => {
    const [salt, expectedHash] = storedHash.split(":");
    const actualHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(
        Buffer.from(actualHash, "hex"),
        Buffer.from(expectedHash, "hex")
    );
};

const userResponse = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
});

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });

    if (existingUser) {
        return res.status(409).json({ message: "An account with that email already exists." });
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
    });

    return res.status(201).json({ user: userResponse(user) });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const user = normalizedEmail ? await User.findOne({ where: { email: normalizedEmail } }) : null;

    if (!user || !password || !passwordMatches(password, user.passwordHash)) {
        return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({ user: userResponse(user) });
};

module.exports = { register, login };