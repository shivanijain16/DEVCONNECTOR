const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){

//Get token Header
const token = req.header('x-auth-token');

// if token not found
if(!token){
    return res.status(401).json({msg:"No token, authorization denied"});
}

// verify token 
try{
const decoded = jwt.verify(token, config.get('jwtSecret'));
//console.log(decoded);
req.user = decoded.user;
//console.log(decoded.user);
//console.log(req.user);
next();
}
catch(err){
return res.status(401).json({msg:"Token is not valid"})
}

}