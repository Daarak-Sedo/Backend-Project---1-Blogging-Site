const jwt = require("jsonwebtoken");


const authenticate= function ( req, res, next) {
    try{
       let token = req.headers["x-api-key"];        
  if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
   let decodedToken = jwt.verify(token, "Secret-Key");
   
  if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });
  
      next()
    }
    catch(error){
      res.status(500).send({msg: error.message})
    }
  }

  

  const authorize= function ( req, res, next) {
    try{
      let token = req.headers["x-api-key"];
      
  if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
  let decodedToken = jwt.verify(token, "Secret-Key");
  let userTobeModified =req.query.authorId
  let userLoggedIn = decodedToken.authorId
  
  if (!decodedToken)
     return res.status(401).send({ status: false, msg: "token is invalid" });
     
     if(userTobeModified != userLoggedIn) return res.status(403).send({status:false,msg:"You are not Authorized"})
     
     next()
    }catch(error){
      res.status(500).send({msg: error.message})
    }
  }



module.exports.authenticate = authenticate
module.exports.authorize = authorize