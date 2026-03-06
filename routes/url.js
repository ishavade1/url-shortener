
const express = require('express');
const {
    handleGenerateNewShortURL,
    handleRedirect,
    handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/:shortId", handleRedirect);

module.exports = router;