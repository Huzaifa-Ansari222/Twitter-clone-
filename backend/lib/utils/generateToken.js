import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (userId, res) => { //creating token
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d' //token exp 15d
    })
    //token send 
    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000, //ms / cookie max age
        httpOnly: true,//prevetn xss atkk cross-site script atkk
        sameSite:"strict",//CRF atkk cross site scripts req forgery atkk
        secure: process.env.NODE_ENV !=="development",
    })
}

// 46:33