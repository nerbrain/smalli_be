require('dotenv').config();
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const { response } = require('../app');

var scanURL = async function(req, res, next){
    var url = req.body.url;

    encodedUrl = encodeURIComponent(url);

    console.log(encodedUrl)

    var request = process.env.IPSCANURL+process.env.IPSCANAPI+"/"+encodedUrl;

    try{
        await fetch(request)
        .then((response) => response.json())
        .then((response) => {
            // console.log(response);

            if(response.unsafe == false && response.risk_score < 75 && response.dns_valid == true){
                req.threatLevel = response.risk_score;
                req.threatScan = new Date().toISOString();
                next()
            } else{
                res.send("URL is Unsafe");
            }
        });
    } catch (e){
        throw e
    }
}

module.exports = scanURL;