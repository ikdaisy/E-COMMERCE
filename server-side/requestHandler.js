import userSchema from './models/user.model.js'
import addressSchema from './models/address.model.js'
import companySchema from './models/company.model.js'
import productSchema from './models/product.model.js'
import categorySchema from './models/category.model.js'
import wishlistSchema from './models/wishlist.model.js'
import cartSchema from './models/cart.model.js'
import orderSchema from './models/order.model.js'


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

export async function checkEmail(req, res) {
    try {
        const { email, type } = req.body; // Expecting 'type' to be either 'signup' or 'forgot-password'

        let subject, htmlContent, buttonText, buttonUrl;

        // Logic to handle different email types
        if (type === 'signup') {
            subject = "EMAIL VERIFICATION";
            buttonText = "Verify Your Account";
            buttonUrl = "http://localhost:5173/signup";
            htmlContent = `
                <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            color: #333;
        }

        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background-color: #4f46e5;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }

        .content {
            padding: 30px;
            text-align: center;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #555;
        }

        .btn {
            display: inline-block;
            background-color: #4f46e5;
            color: #ffffff !important;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 6px;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
            transition: all 0.3s ease;
        }

        .btn:hover {
            background-color: #3e40c9;
            box-shadow: 0 6px 14px rgba(79, 70, 229, 0.4);
        }

        .footer {
            background-color: #f8fafc;
            color: #888;
            text-align: center;
            padding: 15px;
            font-size: 14px;
        }

        .footer a {
            color: #4f46e5;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            Email Verification
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Thank you for signing up! To verify your email address, please click the button below.</p>
            <a href="${buttonUrl}" class="btn">${buttonText}</a>
        </div>
        <div class="footer">
            <p>If you did not request this email, you can safely ignore it.</p>
            <p>Need help? <a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>

            `;
        } else if (type === 'forgot-password') {
            subject = "RESET PASSWORD";
            buttonText = "Reset Your Password";
            buttonUrl = "http://localhost:5173/confirmpassword"; // You may want to replace this with a dynamic reset link
            htmlContent = `
                <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            color: #333;
        }

        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background-color: #d97706;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }

        .content {
            padding: 30px;
            text-align: center;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #555;
        }

        .btn {
            display: inline-block;
            background-color: #d97706;
            color: #ffffff !important;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 6px;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(217, 119, 6, 0.3);
            transition: all 0.3s ease;
        }

        .btn:hover {
            background-color: #c36504;
            box-shadow: 0 6px 14px rgba(217, 119, 6, 0.4);
        }

        .footer {
            background-color: #f8fafc;
            color: #888;
            text-align: center;
            padding: 15px;
            font-size: 14px;
        }

        .footer a {
            color: #d97706;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            Password Reset
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You recently requested to reset your password. Click the button below to proceed:</p>
            <a href="${buttonUrl}" class="btn">Reset Password</a>
            <p style="margin-top: 20px;">If you did not request this password reset, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Need help? <a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>

            `;
        } else {
            return res.status(400).send({ msg: "Invalid request type" });
        }

        // Send the email using the transporter
        const info = await transporter.sendMail({
            from: 'safakallianthodi6@gmail.com',
            to: email, // list of receivers
            subject: subject,
            text: "Please verify your action.",
            html: htmlContent, // html body
        });

        res.status(200).send({ msg: `${type.charAt(0).toUpperCase() + type.slice(1)} email sent successfully` });

    } catch (error) {
        return res.status(400).send(error);
    }
}


export async function changePassword(req,res) {

    const {password,email}=req.body
    //update the new password (hash before updating)
    bcrypt.hash(password,10).then((hashedPassword)=>{
        userSchema.updateOne({email},{$set:{password:hashedPassword}}).then(()=>{
               res.status(200).send({msg:"Your password has been succesfully updated"})
             }).catch((error)=>{
                console.log(error);
                
             })

    })
  
}

export async function getUser(req,res) {
   try {
    const _id=req.user 
    const data = await userSchema.findOne({_id})
    const address = await addressSchema.findOne({userID:_id})

    // console.log(data);
        return res.status(200).send(data)
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
    const {username,email,phone,profile}=req.body
    await userSchema.updateOne({_id},{$set:{username,email,phone,profile}}).then(()=>{
        res.status(201).send({msg:"Successfully Updated"})
    }).catch (()=>{
        return res.status(400).send(error)

    })
    
}



//address 
export async function addAddress(req,res){
    try {
        const _id=req.user
        const{house,place,pincode}=req.body
        if(!(house&&place&&pincode))
            return res.status(404).send({msg:"Oops! You forgot to fill in the fields."})
        await addressSchema.create({house,place,pincode,userID:_id}).then(()=>{
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
        const _id=req.user
        const {...addr}=req.body
        const address=await addressSchema.find({userID:_id})
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
    const {name,email,place,phone,profile}=req.body
    const userData=await userSchema.findOne({_id},{username:1})

    const user = await companySchema.findOne({userID:_id})
    if(user){
        await companySchema.updateOne({userID:_id},{$set:{place,phone,email,name,profile}}).then(()=>{
            res.status(201).send({msg:"Successfully Updated",userData})
        }).catch (()=>{
            return res.status(400).send(error)
    
        })

    }
    else{
        await companySchema.create({userID:_id,place,name,phone,email,profile}).then(()=>{
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
    const userData=await userSchema.findOne({_id},{username:1,profile:1})
    res.status(200).send({companyData,userData})
   } catch (error) {
    res.status(404).send(error)
   }  
}


// add product
export async function addProduct(req,res) {
    const _id=req.user 
    const {name,price,category,photo,sizes,description}=req.body
    await productSchema.create({name,price,category,photo,sizes,description,sellerID:_id}).then(()=>{
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
        const _id=req.user
        const data=await productSchema.find({sellerID:_id})
        return res.status(200).send(data)
        
    } catch (error) {
        console.log(error);
        return res.status(404).send(error)
    }
    
}

export async function getProduct(req,res) {
    try {
        const id=req.user
        const user =await userSchema.findOne({_id:id})
        const {_id}=req.params
        const product=await productSchema.findOne({_id})
       
        
        const isOnWishlist = await wishlistSchema.exists({productID:_id });
        const isOnCart = await cartSchema.exists({"product._id":_id,buyerID:id});


        // console.log(isOnCart);
        return res.status(200).send({product,username:user.username,profile:user.profile,accountType:user.accountType,isOnWishlist,isOnCart})
        
    } catch (error) {
        console.log(error);
        return res.status(404).send(error)
    }
    
}


export async function getCatProducts(req,res) {
    try {
        const id=req.user
        const user =await userSchema.findOne({_id:id})
        const {category}=req.params
        const data=await productSchema.find({sellerID:id,category})
        return res.status(200).send({data,username:user.username,profile:user.profile})
        
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

//get products except the seller
export async function home(req,res) {
    try {
        const _id=req.user 
        const user=await userSchema.findOne({_id});
        const products=await productSchema.find({sellerID: {  $ne: _id}})

        return res.status(200).send({username:user.username,profile:user.profile,accountType:user.accountType,products});
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
    
}

//wishlist

export async function addToWishlist(req,res) {
   try {
    const _id=req.user
    const {id}=req.body
    const isExisting= await wishlistSchema.findOne({productID:id})
    if(!isExisting){
        await wishlistSchema.create({buyerID:_id,productID:id}).then(()=>{
            return res.status(200).send({msg:"Success"});
    
        }).catch(()=>{
            return res.status(404).send({msg:"Error"})
        })
    }
    else{
        return res.status(404).send({msg:" Already Existing"})


    }
   
   } catch (error) {
        return res.status(404).send({msg:"error"})
   }   
}

export async function getFromWishlist(req,res) {
    try {
     const _id=req.user
     const user = await userSchema.findOne({_id})
        const wishlist= await wishlistSchema.find({buyerID:_id})
        const productPromises = wishlist.map(async (list) => {
            return await productSchema.findOne({ _id: list.productID });
        });
        const products = await Promise.all(productPromises);
        return res.status(200).send({products,username:user.username,profile:user.profile});
    } catch (error) {
        return res.status(404).send({msg:"error"})   
    }
    
}

export async function removeFromWishlist(req,res) {
    try {
     const _id=req.user
     const {id}=req.params
     
     await wishlistSchema.deleteOne({$and:[{buyerID:_id},{productID:id}]}).then(()=>{
         return res.status(200).send({msg:"Successfully removed"});
 
     }).catch(()=>{
         return res.status(404).send({msg:"Error"})
     })
    } catch (error) {
         return res.status(404).send({msg:"error"})
    }   
 }

//cart

export async function addToCart(req,res) {
    try {
        const {product,size,quantity}=req.body;
        
        const id=req.user;
       
        await cartSchema.create({buyerID:id,product,size,quantity}).then(()=>{
            return res.status(201).send({msg:"Added to Cart"});
        }).catch((error)=>{
        return res.status(404).send({msg:error})

        })
       
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
    
}
export async function getCart(req,res) {
    try {
        const _id=req.user;
        const user=await userSchema.findOne({_id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized access"});
        const cart=await cartSchema.find({buyerID:_id});
        const address=await addressSchema.find({userID:_id})
        return res.status(200).send({username:user.username,profile:user.profile,accountType:user.accountType,cart,address})
    } catch (error) {
        return res.status(404).send({msg:"error"})

    }

    
}

export async function deleteCart(req,res) {
    try {
        const id = req.user
        const _id=req.params
        
        cartSchema.deleteOne({_id}).then(()=>{
            res.status(200).send({msg:"Deleted successfully"})
    
        }).catch((error)=>{
            console.log(error);
            
        })
    } catch (error) {
        console.log(error);  
    }
    
}

export async function getCartCount(req,res) {
    try {
        const _id=req.user
        const cartCount = await cartSchema.find({ buyerID: _id }).countDocuments(); // Use countDocuments for modern MongoDB
        res.status(200).send({cartCount})
    } catch (error) {
        return res.status(404).send({msg:"error"})


        
    }
    
}
export async function getSingleCart(req,res) {
    try {
        const {_id}=req.params;
        // console.log(_id);
        
        const id=req.user;
        const user=await userSchema.findOne({_id:id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized access"});
        const cart=await cartSchema.findOne({buyerID:id,'product._id': _id});
        const addresses=await addressSchema.find({userID:id})
        return res.status(200).send({username:user.username,profile:user.profile,accountType:user.accountType,cart,addresses})
    } catch (error) {
        return res.status(404).send({msg:"error"})
    }
}



//orders
export async function addOrders(req, res) {
    try {

        const {selectedAddress,totalWithTax}=req.body;
        const _id = req.user;
        const cart = await cartSchema.find({ buyerID:_id}); 
        
        const address=await addressSchema.findOne({_id:selectedAddress})
        // console.log(address);
        
        
        if (!cart || cart.length===0)
            return res.status(404).send({ msg:"Your cart is empty"});

        const cartPromises=await cart.map(async(data)=>{
            const size=data.size
            // console.log(size);
            
            const quantity=await productSchema.findOne({_id:data.product._id})
            // console.log(quantity);
            
            const sizeQuantity= quantity.sizes.find((d)=>d.size===size)
            // console.log(sizeQuantity);
            // console.log(data.quantity,sizeQuantity.quantity);
            
            if(data.quantity <= sizeQuantity.quantity){
                const newQuantity = sizeQuantity.quantity - data.quantity;
                // await productSchema.updateOne({_id: data.product._id, "sizes.size": size }, {  $set: { "sizes.$.quantity": newQuantity }  });
                await cartSchema.deleteOne({ buyerID: _id, "product._id": data.product._id });
                await orderSchema.create({ buyerID: _id, product: data.product, address:address,totalPrice:totalWithTax});
                res.status(201).send({ msg: "Orders placed successfully"});
            }
            else{
                 return res.status(404).send({msg:"Insufficient stock for product"});
            }

        })
    } catch (error) {
        console.error(error);
        return res.status(404).send(error);
    }
}


export async function addSingleOrder(req, res) {
        try {
            const { selectedAddress, productId, size, quantity,totalWithTax } = req.body;
            // console.log(selectedAddress, productId, size, quantity);
            
            const _id = req.user;
    
            // Fetch the selected address
            const address = await addressSchema.findOne({ _id: selectedAddress });
            if (!address) {
                return res.status(404).send({ msg: "Invalid address selected" });
            }
    
            // Fetch the product
            const product = await productSchema.findOne({ _id: productId });
            if (!product) {
                return res.status(404).send({ msg: "Product not found" });
            }
    
            // Find the size and quantity of the product
            const sizeDetails = product.sizes.find((d) => d.size === size);
            if (!sizeDetails) {
                return res.status(404).send({ msg: "Size not available for this product" });
            }
    
            // Check if the quantity is sufficient
            if (quantity > sizeDetails.quantity) {
                return res.status(404).send({ msg: "Insufficient stock for the selected product" });
            }
    
            // Update the product's stock
            const newQuantity = sizeDetails.quantity - quantity;
            // await productSchema.updateOne(
            //     { _id: productId, "sizes.size": size },
            //     { $set: { "sizes.$.quantity": newQuantity } }
            // );
            await cartSchema.deleteOne({ buyerID: _id, "product._id": productId });
    
            // Add the order to the order collection
            await orderSchema.create({
                buyerID: _id,
                product: product,
                size: size,
                quantity: quantity,
                address: address,
                totalPrice:totalWithTax,
            });

            return res.status(201).send({ msg: "Order placed successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: "An error occurred while placing the order", error });
        }
    }
    

export async function getOrders(req,res) {
    try {
        const _id=req.user;
        const user=await userSchema.findOne({_id});
        if(!user)
            return res.status(403).send({msg:"Unauthorized access"})

        const orders=await orderSchema.find({buyerID:_id},{product:1,address:1,totalPrice:1,createdAt:1,status:1});
        const sellerOrders=await orderSchema.find({"product.sellerID":_id},{product:1,address:1,totalPrice:1,createdAt:1,status:1})
        
        
        return res.status(200).send({username:user.username,profile:user.profile,accountType:user.accountType,orders,sellerOrders})

    } catch (error) {
        return res.status(404).send({msg:"error"})

        
    }
    
}


export async function updateQuantity(req,res) {
   
    try {
        const { cartItemId, action } = req.body;
    
        if (!cartItemId || !['increment', 'decrement'].includes(action)) {
          return res.status(400).send({ msg: 'Invalid input' });
        }
    
        const updateValue = action === 'increment' ? 1 : -1;
    
        const updatedCartItem = await cartSchema.findOneAndUpdate(
          { _id: cartItemId },
          { $inc: { quantity: updateValue } },
          { new: true }
        );
    
        if (!updatedCartItem) {
          return res.status(404).send({ msg: 'Cart item not found' });
        }
    
        res.status(200).send({ msg: 'Quantity updated successfully', updatedCartItem });
      } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).send({ msg: 'Server error' });
      }
    
}



// update order status
export const updateOrderStatus = async (req, res) => {
  const { orderId, action,quantity,size } = req.body;
//   console.log(quantity);
//   console.log(size);

  
  const {buyerID}=await orderSchema.findOne({_id:orderId},{_id:0,buyerID:1,"product._id":1})
  const productID=await orderSchema.findOne({_id:orderId},{_id:0,"product._id":1})

  
//   const { email } = req.user;  // Assuming user info is in req.user

  if (!orderId || !action) {
    return res.status(400).send({ msg: "Order ID and action are required." });
  }

  try {
    // Update the order status based on the action
    const orderUpdate = {
      status: action === "accept" ? "Accepted" : action === "reject" ? "Rejected" : "Pending",
    };

    // Find and update the order status
    const updatedOrder = await orderSchema.updateOne(
      { _id: orderId },  // Find the order by ID
      { $set: orderUpdate },  // Set the new status
      { new: true }  // Return the updated document
    );
    // console.log(updatedOrder);
    

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    // After updating the status, send an email to the buyer
    if (action === "accept") {
        // console.log("product id",productID.product._id);
        
       
        
      // Send email to the buyer to notify that the order was accepted 
      await productSchema.updateOne(
        { _id: productID.product._id,"sizes.size":size }, // Find the product by its ID
        { $inc: { "sizes.$.quantity": -quantity } } // Decrease quantity
      );
      await sendEmailToBuyer(buyerID, "Your order has been accepted.")
    } else if (action === "reject") {
       
      // Send email to the buyer to notify that the order was rejected
      await sendEmailToBuyer(buyerID, "Your order has been rejected.")
    }

    // Send success response
    res.status(200).send({ msg: `Order ${action}ed successfully!`, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send({ msg: "Failed to update order status." });
  }
};

// Function to send email to the buyer
const sendEmailToBuyer = async (buyerId, message) => {
  try {
    // Fetch the buyer's email from the database (replace with your logic)
    // console.log(buyerId);
    
    const buyer = await userSchema.findOne({_id:buyerId});  // Assuming buyer's info is stored in a User model
    if (!buyer) {
      throw new Error("Buyer not found.");
    }

    const buyerEmail = buyer.email;

  

    const mailOptions = {
      from: 'safakallianthodi6@gmail.com',
      to: buyerEmail,
      subject: "Order Status Update",
      html:` <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #4CAF50;
              color: #fff;
              text-align: center;
              padding: 10px 0;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .footer {
              text-align: center;
              padding: 10px;
              background-color: #f1f1f1;
              font-size: 12px;
              color: #777;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background-color: #4CAF50;
              color: #fff;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
              text-align: center;
            }
            .button:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Order Status Update</h2>
            </div>
            <div class="content">
              <h3>${message}</h3>
              <p>Dear ${buyer.username || "Customer"},</p>
              <p>We wanted to let you know that  ${message.toLowerCase()}.</p>
              <p>If you have any questions, feel free to reach out to us. We're here to help!</p>
            

            </div>
            <div class="footer">
              <p>&copy; 2025 Your Company. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>`
   
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", buyerEmail);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

  






