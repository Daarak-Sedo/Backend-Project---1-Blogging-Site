const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
    try {
        let Author = req.body
        //<------Checking Whether Request Body is empty or not----------->//
        if (!Author.fname) return res.status(400).send({ status: false, msg: " First name is required " })
        if (!Author.lname) return res.status(400).send({status: false, msg: " Last name is required " })
        if (!Author.email) return res.status(400).send({status: false, status: false, msg: " email is required " })
        if (!Author.password) return res.status(400).send({status: false, status: false, msg: " password is required " })

        //<---------Validating Request Body Deatils Format----------->//
        if (!/^[a-zA-Z:-]+$/.test(Author.fname)) return res.status(400).send({ status: false, msg: "First name contain only alphabets" })

        if (!/^[a-zA-Z:-]+$/.test(Author.lname)) return res.status(400).send({ status: false, msg: "last name contain only alphabets" })

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Author.email)) {
            return res.status(400).send({ status: false, message: "Email should be a valid email address" });
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(Author.password)) { return res.status(400).send({ status: false, message: `password shoud be 6 to 20 characters,Which contain at least 1 numeric digit, 1 uppercase and 1 lowercase letter and 1 Caractor` }) }    //------- Validating password


        if (!Author.title) { res.status(400).send({ status: false, msg: "plz provide title" }) }
        if (Author.title != "Mr" && Author.title != "Mrs" && Author.title != "Miss") {
            return res.status(400).send({ status: false, msg: "Title can only be Mr Mrs or Miss" })
        }  // ----- Validating title

        //<-------Validation of email--already-present-or-not----------->//
        let emailValidation = await authorModel.findOne({ email: Author.email })
        if (emailValidation) {
            return res.status(409).send({ status: false, msg: "This  email  already exists " })
        }

        let authorCreated = await authorModel.create(Author)

        res.status(201).send({ status: true, data: authorCreated })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



//<---------------This function is used for Logging an Author----------------->//
const login = async function (req, res) {
    try {
        const Email = req.body.email
        const Password = req.body.password

        if (!(req.body.email && req.body.password)) {
            return res.status(400).send({ status: false, msg: "All fields are mandatory " })
        }

        const userMatch = await authorModel.findOne({ email: Email, password: Password })

        if (!userMatch) return res.status(400).send({ status: false, msg: "Email or Password is incorrect" })


        // ---------  Token Will Generate After 1st Log In -----------//
        const token = jwt.sign({
            authorId: userMatch._id.toString(), batch: "Radon", project: "blog"
        }, "Secret-Key")

        // res.setHeader("x-api-key", "token");
        return res.status(200).send({ status: true, msg: "You are successfully logged in", token: token })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}




module.exports.createAuthor = createAuthor;
module.exports.login = login