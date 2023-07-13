require('dotenv').config();
var express = require('express');
var router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.sendStatus(403);
});


router.post('/', function (req, res, next) {
    res.send('Incomplete url');
});

//Sign In route
router.post("/signIn", bodyParser.json(), function (req, res, next) {
    var email = req.body.formData.email;
    var password = req.body.formData.password;

    // console.log(email)

    findUser(email, password, res);
})

//Sign Up route that calls addUser function
router.post("/signUp", bodyParser.json(), function (req, res, next) {
    addUser(req.body.formData, res);
})

/*Find User*/
async function findUser(email, password, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        // console.log(user);

        if (user != null) {
            if (await bcrypt.compare(password, user.password)) {
                console.log("Successful");

                const userInfo = { email: email, userId: user.id };
                const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
                res.status(200).json({
                    status: "success",
                    accessToken: accessToken
                });
                //TODO : Log user sign In
            } else {
                res.status(401).send("Wrong email or password");
            }
        } else {
            console.log("Wrong Credentials");
            res.status(401).send("Wrong Credentials");
        }
    } catch (e) {
        throw e;
    }
}

/* Creating user account and ensuring password is encypted using bcrypt */
async function addUser(user_data, res) {
    try {
        const salt = await bcrypt.genSalt();
        user_data.password = await bcrypt.hash(user_data.password, salt);
        try {
            var user = await prisma.user.create({
                data: {
                    firstName: user_data.firstName,
                    lastName: user_data.lastName,
                    email: user_data.email,
                    password: user_data.password
                }
            })
            console.log(user)
            res.status(200).send("user created");
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (e.code === 'P2002') {
                    console.log(
                        'There is a unique constraint violation, a new user cannot be created with this email'
                    )
                    res.send("Email already exists");
                }
            }
            throw e
        }

    } catch { }
}

module.exports = router;