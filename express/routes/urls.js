require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();
var authenticateToken = require('../Auth/Auth');
var scanURL = require('../utils/urlScan');

router.get('/list', authenticateToken, function (req, res, next) {
  // console.log(req)
  if (req.user == null) {
    console.log(req.user)
    return res.sendStatus(401);
  } else {
    listUrls(res, req)
  }
});

router.get('/:shortUrl', function (req, res, next) {
  find(req, res);
});

router.post('/generateUrl', authenticateToken, scanURL, async function (req, res, next) {
  var longUrl = req.body.url;
  // console.log(longUrl);
  var shortUrl = await generateUrl(5);
  saveUrl(shortUrl, longUrl, res, req);
})

router.get('/analytics/:id', authenticateToken,async function(req, res, next){
  getAnalytics(req.params.id, res);
})

async function getAnalytics(id,res){
  const litics = await prisma.UrlAnalytic.count({
    where:{
      url_id: id
    }
  });
  console.log("entries:"+ litics)
  const jsres = {
    'entries': litics
  }
  res.send(jsres)
}

//Function to generate random string
async function generateUrl(length) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charLength = chars.length;
  var result = '';
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  console.log(result);
  return result;
}

async function saveUrl(shortUrl, longUrl, res, req) {
  var threatLevel = req.threatLevel;
  var threatScan = req.threatScan;

  //User does not have an account
  if (req.user == null) {
    console.log("null")
    try {
      var url = await prisma.URL.create({
        data: {
          longURL: longUrl,
          shortURL: shortUrl,
          threatLevel: threatLevel,
          threatScan: threatScan,
        }
      });
      console.log(url);
      res.status(200).send(url)
    } catch (e) {
      throw e;
    }
  }
  //User is a registered member
  else {
    try {
      var url = await prisma.URL.create({
        data: {
          longURL: longUrl,
          shortURL: shortUrl,
          threatLevel: threatLevel,
          threatScan: threatScan,
          userId: req.user.userId,
        }
      });
      console.log(url);
      res.status(200).send(url)
    } catch (e) {
      throw e;
    }
  }
}

async function find(req, res) {
  try {
    const url = await prisma.URL.findUnique({
      where: {
        shortURL: req.params.shortUrl,
      },
    })
    if (url != null) {
      console.log(url);
      analytics(req,url);
      res.status(200).send(url);
    } else {
      console.log("Url doesn't exist");
      res.status(401).send("Url doesn't exist");
    }
  } catch (e) {
    throw e;
  }
}

async function analytics(req,url){
  const analytics = await prisma.UrlAnalytic.create({
    data:{
      // url: url.shortURL,
      url_id: url.id,
      user_agent: req.headers['user-agent']
    }
  })
  console.log(analytics)
}

async function listUrls(res, req) {
  const urls = await prisma.URL.findMany({
    where: {
      userId: req.user.userId,
    },
  })
  // console.log(urls)
  res.send(urls);
}

module.exports = router;