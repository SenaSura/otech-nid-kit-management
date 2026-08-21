const { Kit } = require("../models");

// Register new kit
exports.createKit = async (req, res) => {
    try {
        const kit = await Kit.create(req.body);
        res.status(201).json(kit);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get all kits
exports.getAllKits = async (req, res) => {
    params = req.query;
    if (params.status) {
        try {
            const kits = await Kit.findAll({ where: { status: params.status } });
            res.json(kits);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    } else {
        try {
            const kits = await Kit.findAll();
            res.json(kits);
        } catch (error) {
            res.status(500).json({
            message: error.message,
        });
    }}
};

// Get one kit
exports.getKitById = async (req, res) => {
    try {
        const kit = await Kit.findByPk(req.params.id);

        if (!kit) {
            return res.status(404).json({
                message: "Kit not found",
            });
        }

        res.json(kit);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update kit
exports.updateKit = async (req, res) => {
    try {

        const kit = await Kit.findByPk(req.params.id);

        if (!kit) {
            return res.status(404).json({
                message: "Kit not found",
            });
        }

        await kit.update(req.body);

        res.json(kit);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete kit
exports.deleteKit = async (req, res) => {

    try {

        const kit = await Kit.findByPk(req.params.id);

        if (!kit) {
            return res.status(404).json({
                message: "Kit not found",
            });
        }

        await kit.destroy();

        res.json({
            message: "Kit deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};