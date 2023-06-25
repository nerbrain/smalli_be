const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
  main()
  res.send("urls");
});

async function main() {

  const urls = await prisma.URL.findMany()

  console.log(urls)
  return(urls);

}

module.exports = router;