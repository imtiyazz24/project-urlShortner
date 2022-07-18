const urlModel = require("../models/urlModel");
const validUrl = require('valid-url');
const shortid = require('shortid');



const createShortUrl= async function(req,res){
    try{
          //==defining baseUrl==//
        const baseUrl = 'http://localhost:3000'

         //==validating request body==//
         if(Object.keys(req.body).length==0) return res.status(400).send({status: false, message: "Invalid request, please provide details"})

           //==validating long url==//
        let longUrl=req.body.longUrl
        if (!validUrl.isUri(longUrl)) return res.status(400).send({status: false, message: "Invalid long URL"})

        let url = await urlModel.findOne({ longUrl }).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
        if(url) return res.status(200).send({status: true, data : url})
       
       return res.status(201).send({status: true, data : data}) 
    }catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

const getShortUrl = async function (req, res) {
    try{

        const url = await Url.findOne({urlcode:req.params.code });
        if(url){
            return res.status(307).redirect(urlData.longUrl)    
        }else {
            return res.status(404).send({status: false, message: "No URL Found "});
        }
    }catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }

}

module.exports={createShortUrl,getShortUrl}