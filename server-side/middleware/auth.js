import pkg from 'jsonwebtoken';
import userSchema from '../models/user.model.js'
 const { verify } = pkg;

export async function Auth(req,res,next) {
    try {
        const token = req.headers.authorization
    const key = token.split(" ")[1]
    // console.log(key);
    const auth = await verify(key,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
    // console.log(auth);
    const user = await userSchema.findOne({_id:auth.userId})
    // console.log(user);
    if(!user){
        return res.status(402).send({msg:"Unauthorized access"})
    }
    req.user=auth.userId
    next()
    } catch (error) {
        console.log(error);
        
        
    }
}