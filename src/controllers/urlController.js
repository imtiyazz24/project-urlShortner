const urlModel = require("../models/urlModel")




const shortUrl = async (req, res) => {
    
    try{
        const data = req.body;
         // The API base Url endpoint
        const baseUrl = 'http://localhost:3000'

        
        if(Object.keys(data).length == 0) return res.status(400).send({status: false, message: "Invalid URL Please Enter valid details"}) 
        if(!data.longUrl) return res.status(400).send({status: false, message: "longUrl is required"})

// check long url if valid using the validUrl.isUri method
        if(validUrl.isUri(data.longUrl)){
    // if url exist and return the respose
                let getUrl = await GET_ASYNC(`${data.longUrl}`)
                let url = JSON.parse(getUrl)
                if(url){
                    return res.status(200).send({status: true, message: "Success",data: url});
                }else{
    // if valid, we create the url code
                    let urlCode = shortid.generate().toLowerCase();
     // join the generated urlcode to the baseurl   
                    let shortUrl = baseUrl + "/" + urlCode;

                    data.urlCode = urlCode
                    data.shortUrl = shortUrl
                     
                    url = await urlModel.create(data)
                    
                    let responseData  = await urlModel.findOne({urlCode:urlCode}).select({_id:0, __v:0,createdAt: 0, updatedAt: 0 });
     //using set to assign new key value pair in cache
                    await SET_ASYNC(`${data.longUrl}`, JSON.stringify(responseData))
                    return res.status(201).send({status: true, message: "URL create successfully",data:responseData});

                }
        }else{
           return res.status(400).send({status: false, message: "Enter a valid Url"});
        }    

    }catch(err){
        return res.status(500).send({status: false, Error: err.message})
    }
}


const FetchUrl = async(req,res) => {

}

module.exports.shortUrl = shortUrl
module.exports.FetchUrl = FetchUrl