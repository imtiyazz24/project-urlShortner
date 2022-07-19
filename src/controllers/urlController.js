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
        let data=req.body
        if(!validUrl.isUri(data.longUrl))  return res.status(400).send({status:false, msg:"Enter valid url"})
      //  if (!validUrl(longUrl)) return res.status(400).send({status: false, message: "Invalid long URL"})
        let findUrl = await urlModel.findOne({longUrl:data.longUrl}).select({__v:0,updatedAt:0,createdAt:0,_id:0})
        if(findUrl) return res.status(200).send({status:true, data:findUrl})

        let urlCode = shortid.generate().toLowerCase()      
        let shortUrl = baseUrl + '/' + urlCode
        data.urlCode = urlCode
        data.shortUrl = shortUrl


        const urlCreate = await urlModel.create(data)
        const response =await urlModel.findOne({urlCreate}).select({__v:0,updatedAt:0,createdAt:0,_id:0})
       
       return res.status(201).send({status: true, data :response})
    }catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


const getShortUrl = async function (req, res) {
    try { 
        const code = req.params.urlCode
        const urlData = await urlModel.findOne({ urlCode: code})  
        if (!urlData)  
            return res.status(404).send({status: false, message: "No URL Found "});
        return res.status(302).redirect(urlData.longUrl)    
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}
module.exports={createShortUrl,getShortUrl}


