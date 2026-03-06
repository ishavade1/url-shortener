
const shortid = require("shortid");
const axios = require("axios");
const useragent = require("useragent");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const shortId = shortid();

    await URL.create({
        shortId,
        redirectURL: body.url,
        visitHistory: [],
    });

    return res.json({ id: shortId });
}

async function handleRedirect(req, res) {
    const shortId = req.params.shortId;

    const entry = await URL.findOne({ shortId });

    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    const ipAddress =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    let country = "";
    let city = "";

    try {
        const geo = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
        country = geo.data.country_name;
        city = geo.data.city;
    } catch (err) {
        console.log("Geo API failed");
    }

    const agent = useragent.parse(req.headers["user-agent"]);
    const browser = agent.toAgent();
    const os = agent.os.toString();

    await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    ip: ipAddress,
                    country,
                    city,
                    browser,
                    os,
                },
            },
        }
    );

    res.redirect(entry.redirectURL);
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;

    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleRedirect,
    handleGetAnalytics,
};