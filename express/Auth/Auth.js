require('dotenv').config();
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

//Auth middleware

var authenticateToken = function(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        req.user = null;
        next();
        
        // return res.sendStatus(401);
    }
    else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
            if(err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    }
}

module.exports = authenticateToken;