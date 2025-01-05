import Router from 'express'
import * as rh from './requestHandler.js'
import { Auth } from './middleware/auth.js'
const router=Router()


router.route("/signup").post(rh.signUp)
router.route("/signin").post(rh.signIn)
router.route("/checkemail").post(rh.checkEmail)
router.route("/getuser").get(Auth,rh.getUser)
router.route("/edituser").put(Auth,rh.editUser)
router.route("/deleteuser").delete(Auth,rh.deleteUser)

// address
router.route('/address').post(rh.addAddress)
router.route('/getAddress').get(rh.displayAddress)
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
router.route('/addProduct').post(rh.addProduct)
router.route('/getproducts').get(rh.getProducts)
router.route('/getproduct/:_id').get(rh.getProduct)
router.route('/updateproduct/:_id').put(rh.updateProduct)
router.route('/deleteproduct/:_id').delete(rh.deleteProduct)




//get products based on category
router.route('/getcatproducts/:category').get(rh.getCatProducts)



















export default router;

