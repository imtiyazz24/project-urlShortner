const express = require('express')
const router = express.Router()
const { createShortUrl, getShortUrl } = require("../controllers/urlController")

//--Create short URL
router.post("/url/shorten", createShortUrl)

//--Get short URL
router.get("/:urlCode", getShortUrl)

// -No Page Found
router.all('*', (req, res) => { res.status(404).send({ status: false, message: "No Page Found !!" }) })

module.exports = router