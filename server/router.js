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

//add or edit address
router.route('/editAddress').post(Auth,rh.editAddress)
router.route("/deleteAddress").delete(Auth,rh.deleteAddress)

//add data or edit 
router.route('/editCompanyData').post(Auth,rh.editCompanyData)
router.route("/getcompanydata").get(Auth,rh.getCompanyData)
// router.route("/deletecompanydata").delete(Auth,rh.deleteCompanyData)

//product
router.route('/addProduct').post(rh.addProduct)
router.route('/getproducts').get(rh.getProducts)
//add category into categorySchema
router.route('/addcategory').post(rh.addCategory)

router.route('/getcategory').get(rh.getCategory)
















export default router;

