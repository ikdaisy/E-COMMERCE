import Router from 'express'
import * as rh from './requestHandler.js'
import { Auth } from './middleware/auth.js'
const router=Router()


router.route("/signup").post(rh.signUp)
router.route("/signin").post(rh.signIn)
router.route("/checkemail").post(rh.checkEmail)
router.route("/changepassword").post(rh.changePassword)
router.route("/getuser").get(Auth,rh.getUser)
router.route("/edituser").put(Auth,rh.editUser)
router.route("/deleteuser").delete(Auth,rh.deleteUser)

// address
router.route('/address').post(Auth,rh.addAddress)
router.route('/getAddress').get(Auth,rh.displayAddress)
router.route('/editAddress/:_id').put(rh.editAddress)
router.route('/deleteAddress/:_id').delete(rh.deleteAddress)

//add data or edit 
router.route('/editCompanyData').post(Auth,rh.editCompanyData)
router.route("/getcompanydata").get(Auth,rh.getCompanyData)
// router.route("/deletecompanydata").delete(Auth,rh.deleteCompanyData)

//add category into categorySchema
router.route('/addcategory').post(rh.addCategory)
router.route('/getcategory').get(rh.getCategory)

//product
router.route('/addProduct').post(Auth,rh.addProduct)
router.route('/getproducts').get(rh.getProducts)
router.route('/getproduct/:_id').get(Auth,rh.getProduct)
router.route('/updateproduct/:_id').put(rh.updateProduct)
router.route('/deleteproduct/:_id').delete(rh.deleteProduct)

//get all products except the login user 
router.route('/home').get(Auth,rh.home)

//wishlist
router.route('/addwishlist').post(Auth,rh.addToWishlist)
router.route('/getwishlist').get(Auth,rh.getFromWishlist)
router.route('/removewishlist/:id').delete(Auth,rh.removeFromWishlist)


//cart
router.route("/addtocart").post(Auth,rh.addToCart);
router.route("/getcart").get(Auth,rh.getCart); 
router.route("/getcartcount").get(Auth,rh.getCartCount); 
router.route("/getsinglecart/:_id").get(Auth,rh.getSingleCart); 
router.route("/deletecart/:_id").delete(rh.deleteCart); 


//order
router.route('/placeorder').post(Auth,rh.addOrders)
router.route("/buynow").post(Auth,rh.addSingleOrder);
router.route('/getorders').get(Auth,rh.getOrders)
router.route('/updatequantity').put(Auth,rh.updateQuantity)











//get products based on category
router.route('/getcatproducts/:category').get(rh.getCatProducts)



















export default router;

