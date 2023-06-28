const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();
var authenticateToken = require('../Auth/Auth');
var scanURL = require('../utils/urlScan');

router.get('/list', authenticateToken, function(req, res, next) {
  main(res)
});

router.get('/:shortUrl', authenticateToken, function(req, res, next) {
  find(req.params.shortUrl, res);
});

router.post('/generateUrl',scanURL, async function(req, res, next){
  var longUrl = req.body.url;
  // console.log(longUrl);
  var shortUrl = await generateUrl(5);
  saveUrl(shortUrl, longUrl, res);
})

async function generateUrl(length){
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

async function find(shortUrl, res){
  try{
    const url = await prisma.URL.findUnique({
      where: {
        shortURL: shortUrl,
      },
    })

    if(url != null){
      console.log(url);
      res.status(200).send(url);
    } else {
      console.log("Url doesn't exist");
      res.status(401).send("Url doesn't exist");
    }

  } catch (e){
    throw e;
  }
}

async function main(res) {
  const urls = await prisma.URL.findMany()
  console.log(urls);
  res.send(urls);
}

module.exports = router;