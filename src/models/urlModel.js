const mongoose = require('mongoose')

const UrlSchema = new mongoose.Schema({

     urlcode:   
     {                        
         type:String,               //example: iith 
         unique:true,
         required:true,
         trim:true,
         lowercase: true

     },

    longUrl:  
     {
         type:String,               //example: `Indian Institute of Technology, Hyderabad`
         required:true,
         trim:true

     },

     shortUrl:
     {
        type:String,
        required:true,
        unique : true,
        trim:true
     }

    },{timestamps:true})

    module.exports = mongoose.model("URL",UrlSchema)
    
       