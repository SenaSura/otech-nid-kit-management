const express = require("express");

const router = express.Router();

const {
    createKit,
    getAllKits,
    getKitById,
    updateKit,
    deleteKit,
} = require("../controllers/kitController");

router.post("/", createKit);

router.get("/", getAllKits);

router.get("/:id", getKitById);

router.put("/:id", updateKit);

router.delete("/:id", deleteKit);

module.exports = router;