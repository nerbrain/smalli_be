const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();
var authenticateToken = require('../Auth/Auth');

router.get('/', authenticateToken, function(req, res, next) {
  main(res)
  
});

router.post('/generateUrl', async function(req, res, next){
  var longUrl = req.body.url;
  // console.log(longUrl);
  var shortUrl = await generateUrl(longUrl, 5);
  saveUrl(shortUrl, longUrl, res);
})

async function generateUrl(longUrl, length){
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charLength = chars.length;
  var result = '';
  for ( var i = 0; i < length; i++ ) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  console.log(result);
  return result;
}

async function saveUrl(shortUrl, longUrl, res){
  try{
    var url = await prisma.URL.create({
      data:{
        longURL: longUrl,
        shortURL: shortUrl,
        threatLevel: 0,
      }
    });
    console.log(url);
    res.status(200).send(url)
  } catch (e) {
    throw e;
  }
}

async function main(res) {
  const urls = await prisma.URL.findMany()
  console.log(urls);
  res.send(urls);
}

module.exports = router;