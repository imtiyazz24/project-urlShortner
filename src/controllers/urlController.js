const urlModel = require("../models/urlModel");
const shortid = require('shortid');
const redis = require("redis");
const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    12111,
    "redis-12111.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("3WdcphRZFG39cn3wZohzc1dpQ1OIe76c", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});
//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const createShortUrl = async function (req, res) {
    try {
        //==defining baseUrl==//
        const baseUrl = 'http://localhost:3000'

        //==validating request body==//
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Invalid request, please provide details" })

        //==validating long url==//
        let data = req.body
        let validLongUrl = (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&//=]*)/.test(data.longUrl.trim()))
        if (!validLongUrl) return res.status(400).send({ status: false, msg: "Enter valid url" })

        let cache = await GET_ASYNC(`${data.longUrl}`)
        cache = JSON.parse(cache)
        if (cache) { return res.status(200).send({ status: true, cacheData: cache }) }


        let findUrl = await urlModel.findOne({ longUrl: data.longUrl }).select({ __v: 0, updatedAt: 0, createdAt: 0, _id: 0 })
        if (findUrl) return res.status(200).send({ status: true, data: findUrl })

        let urlCode = shortid.generate().toLowerCase()
        let shortUrl = baseUrl + '/' + urlCode
        data.urlCode = urlCode
        data.shortUrl = shortUrl

        const urlCreate = await urlModel.create(data)
        const response = await urlModel.findOne({ urlCreate }).select({ __v: 0, updatedAt: 0, createdAt: 0, _id: 0 })

        await SET_ASYNC(`${data.longUrl}`, JSON.stringify(data))

        return res.status(201).send({ status: true, data: response })
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


const getShortUrl = async function (req, res) {
    try { 
        const cachedUrlData = await GET_ASYNC(`${req.params.urlCode}`)
        const parsingData = JSON.parse(cachedUrlData);
        if (cachedUrlData) return res.status(302).redirect(parsingData)

        const urlData = await urlModel.findOne({ urlCode: req.params.urlCode.trim() })
        if (!urlData)
        return res.status(404).send({ status: false, message: "No URL Found " });

        await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(urlData.longUrl));
        return res.status(302).redirect(urlData.longUrl)

    }  catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}
module.exports = { createShortUrl, getShortUrl }