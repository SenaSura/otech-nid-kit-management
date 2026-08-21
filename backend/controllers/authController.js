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
    role: user.role,
});

const requireAdmin = async (req, res) => {
    const userId = req.get("x-user-id");
    const user = userId ? await User.findByPk(userId) : null;

    if (!user || user.role !== "admin") {
        res.status(403).json({ message: "Admin access is required." });
        return null;
    }

    return user;
};

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
        role: "user",
    });

    return res.status(201).json({ user: userResponse(user) });
};

const listUsers = async (req, res) => {
    if (!await requireAdmin(req, res)) return;
    const users = await User.findAll({ order: [["createdAt", "DESC"]] });
    return res.json({ users: users.map(userResponse) });
};

const createUser = async (req, res) => {
    if (!await requireAdmin(req, res)) return;
    const { name, email, password, role = "user" } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ message: "Role must be admin or user." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ where: { email: normalizedEmail } })) {
        return res.status(409).json({ message: "An account with that email already exists." });
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        role,
    });
    return res.status(201).json({ user: userResponse(user) });
};

const updateUser = async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const { name, email, password, role } = req.body;
    if (role && !["admin", "user"].includes(role)) {
        return res.status(400).json({ message: "Role must be admin or user." });
    }
    if (email) {
        const normalizedEmail = email.trim().toLowerCase();
        const duplicate = await User.findOne({ where: { email: normalizedEmail } });
        if (duplicate && duplicate.id !== user.id) {
            return res.status(409).json({ message: "An account with that email already exists." });
        }
        user.email = normalizedEmail;
    }
    if (name?.trim()) user.name = name.trim();
    if (role) user.role = role;
    if (password) {
        if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
        user.passwordHash = hashPassword(password);
    }
    await user.save();
    return res.json({ user: userResponse(user) });
};

const deleteUser = async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    if (Number(req.params.id) === admin.id) {
        return res.status(400).json({ message: "You cannot delete your own admin account." });
    }
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "User not found." });
    return res.status(204).send();
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

module.exports = { register, login, listUsers, createUser, updateUser, deleteUser, hashPassword };