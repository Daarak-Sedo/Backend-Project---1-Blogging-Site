const jwt = require("jsonwebtoken");

const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
    let decodedToken = jwt.verify(token, "Secret-Key");

    if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });

    next()
  }
  catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}



const authorize = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "Secret-Key");
    if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });


    let userTobeModified = req.params.authorId    
    let userLoggedIn = decodedToken.authorId


    if (userLoggedIn = userTobeModified) return res.status(403).send({ status: false, msg: " you are not Authorized" })
    else next()

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}


module.exports.authenticate = authenticate
module.exports.authorize = authorize