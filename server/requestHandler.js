import userSchema from './models/user.model.js'
import addressSchema from './models/address.model.js'
import companySchema from './models/company.model.js'
import productSchema from './models/product.model.js'
import categorySchema from './models/category.model.js'


import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const {sign}= jwt

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "safakallianthodi6@gmail.com",
      pass: "fbtw wgph qsuv ngvk",
    },
  });

export async function signUp(req,res){
    const {username,email,password,cpassword,accountType,phone}=req.body
    if(!(username&&email&&password&&cpassword&&accountType&&phone))
        return res.status(400).send({msg:"Fields are empty"})
    const userEmail=await userSchema.findOne({email})
    if(userEmail){
        return res.status(400).send({msg:"Email already exists"})
    }
    if(password!=cpassword){
        return res.status(400).send({msg:"Passwords are not matching"})
    }
    bcrypt.hash(password,10).then(async(hashedPassword)=>{
        await userSchema.create({username,email,password:hashedPassword,accountType,phone}).then(()=>{
        return res.status(201).send({msg:"Successfully registered"})
        }).catch((error)=>{
        return res.status(400).send(error)
        })
    })  
}

export async function signIn(req,res){
   try {
    const {email,password}=req.body
    if(!(email&&password))
        return res.status(400).send({msg:"Fields are empty"})
    const user=await userSchema.findOne({email})
    if(!user){
        return res.status(400).send({msg:"User doesnt exist"})
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        return res.status(400).send({msg:"Invalid password"})
    }
    const token = await sign({userId:user._id},'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',{expiresIn:"24h"})
    res.status(200).send({msg:"Successfully logged in",token})
   } catch (error) {
        return res.status(400).send(error) 
   }  
}

export async function checkEmail(req,res) {
   try {
    const {email}=req.body

    const info = await transporter.sendMail({
        from: 'safakallianthodi6@gmail.com', // sender address
        to: `${email}`, // list of receivers
        subject: "EMAIL VERIFICATION", // Subject line
        text: "PLEASE VERIFY", // plain text body
        html: `<!DOCTYPE html>
        
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .btn {
            display: inline-block;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            padding: 15px 30px;
            margin-top: 20px;
            border-radius: 4px;
            font-size: 18px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <p>Hello,</p>
        <p>Please verify your email address by clicking the button below.</p>
        <a href="http://localhost:5173/signup" class="btn">Verify Your Account</a>
    </div>

</body>
</html>`, // html body
})   
res.status(200).send({msg:"Email verification sent successfully"})
    
   } catch (error) {
    return res.status(400).send(error)
   }
}

export async function getUser(req,res) {
   try {
    const _id=req.user 
    const data = await userSchema.findOne({_id})
    const address = await addressSchema.findOne({userID:_id})

    console.log(data);
    res.status(200).send(data)
   } catch (error) {
    return res.status(400).send(error)
   }
    
}

export async function deleteUser(req,res) {
    const _id=req.user 
    await userSchema.deleteOne({_id}).then(()=>{
        res.status(200).send({msg:"Successfully deleted"})
    }).catch (()=>{
        return res.status(400).send(error)

    })  
}



export async function editUser(req,res) {
    const _id=req.user 
    const {username,email,phone}=req.body
    await userSchema.updateOne({_id},{$set:{username,email,phone}}).then(()=>{
        res.status(201).send({msg:"Successfully Updated"})
    }).catch (()=>{
        return res.status(400).send(error)

    })
    
}



//address 
export async function addAddress(req,res){
    try {
        const{house,place,pincode}=req.body
        if(!(house&&place&&pincode))
            return res.status(404).send({msg:"Oops! You forgot to fill in the fields."})
        await addressSchema.create({house,place,pincode}).then(()=>{
            res.status(201).send({msg:"New address added to your profile"})
        }).catch((error)=>{
            res.status(404).send({msg:error})  
        })

    } catch (error) {
        console.log(error);
        
    }
}


export async function displayAddress(req,res) {
    try {
        const {...addr}=req.body
        const address=await addressSchema.find()
        res.status(200).send(address)
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})    
    }
}
export async function editAddress(req,res) {
    try {
        const _id=req.params
        const {...addr}=req.body
        await addressSchema.updateOne({_id},{$set:{...addr}}).then(()=>{
            res.status(201).send({msg:"Address Successfully Updated"})
        }).catch((error)=>{
            console.log(error);
            
        })
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})    
    }
}

export async function deleteAddress(req,res) {
    try {
        const _id=req.params
        const address=await addressSchema.deleteOne({_id}).then(()=>{
            res.status(200).send({msg:'Successfully Deleted'})
        }).catch((error)=>{
            console.log(error);
        })
    } catch (error) {
        console.log(error);
        res.status(404).send({msg:error})    
    }
}

//company

export async function editCompanyData(req,res) {
    const _id=req.user 
    const {name,email,place,phone}=req.body
    const userData=await userSchema.findOne({_id},{username:1})

    const user = await companySchema.findOne({userID:_id})
    if(user){
        await companySchema.updateOne({userID:_id},{$set:{place,phone,email,name}}).then(()=>{
            res.status(201).send({msg:"Successfully Updated",userData})
        }).catch (()=>{
            return res.status(400).send(error)
    
        })

    }
    else{
        await companySchema.create({userID:_id,place,name,phone,email}).then(()=>{
                    res.status(201).send({msg:"Successfully Added" ,userData})
                }).catch (()=>{
                    return res.status(400).send(error)
            
                })
    }  

    
}

export async function getCompanyData(req,res) {
   try {
    const _id=req.user 
    const companyData= await companySchema.findOne({userID:_id})
    const userData=await userSchema.findOne({_id},{username:1})
    res.status(200).send({companyData,userData})
   } catch (error) {
    res.status(404).send(error)
   }  
}


// add product
export async function addProduct(req,res) {
    const {name,price,category,photo,sizes,description}=req.body
    await productSchema.create({name,price,category,photo,sizes,description}).then(()=>{
        res.status(201).send({msg:"Successfully Added"})
    }).catch((error)=>{
         res.status(404).send(error)
    })
}
// update product 

export async function updateProduct(req,res) {
    const {...data}=req.body
    const {_id}=req.params
    await productSchema.updateOne({_id},{$set:{...data}}).then(()=>{
        res.status(200).send({msg:"Successfully Updated"})
    }).catch((error)=>{
         res.status(404).send(error)
    })  
}

//delete product

export async function deleteProduct(req,res) {
    const {_id}=req.params
    await productSchema.deleteOne({_id}).then(()=>{
        res.status(200).send({msg:"Successfully Deleted"})
    }).catch((error)=>{
         res.status(404).send(error)
    })  
}

//add category
export async function addCategory(req,res) {
    try {
        
        const {newCategory}=req.body
        await categorySchema.create({category:newCategory}).then(()=>{
            res.status(201).send({msg:"Category Added"})
        }).catch((error)=>{
             res.status(404).send(error)
        })
        
    } catch (error) {
        console.log(error);
         return res.status(404).send(error)
  
    }
    
}

export async function getProducts(req,res) {
    try {
        const data=await productSchema.find()
        return res.status(200).send(data)
        
    } catch (error) {
        console.log(error);
        return res.status(404).send(error)
    }
    
}

export async function getProduct(req,res) {
    try {
        const {_id}=req.params
        const data=await productSchema.findOne({_id})
        return res.status(200).send(data)
        
    } catch (error) {
        console.log(error);
        return res.status(404).send(error)
    }
    
}


export async function getCatProducts(req,res) {
    try {
        const {category}=req.params
        const data=await productSchema.find({category})
        return res.status(200).send(data)
        
    } catch (error) {
        console.log(error);
        return res.status(404).send(error)
    }
    
}

export async function getCategory(req,res) {
    try {
        const data=await categorySchema.find()
        return res.status(200).send(data)
        
    } catch (error) {
        console.log(error);
        return res.status(404).send(error)
    }
    
}







