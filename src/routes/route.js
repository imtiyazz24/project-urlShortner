const express = require('express')
const router = express.Router()
const shorturlController = require("../controllers/urlController")


router.post("/url/shorten",shorturlController.shortUrl)
router.get("/functionup/collegeDetails",shorturlController.fetchUrl)

module.exports = router;  // --> exported