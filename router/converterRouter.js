const express = require("express");
const router = express.Router();
const converterController = require("../controllers/mainController");

router.get("/", converterController.getIndex);

router.post("/convert", converterController.converter);

module.exports = router;
