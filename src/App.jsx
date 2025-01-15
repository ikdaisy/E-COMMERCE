
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './components/Home/Home'
import SignUp from './components/SignUp/SignUp'
import Email from './components/Email/Email'
import Profile from './components/Profile/Profile'
import SignIn from './components/SignIn/signIn'
import Company from './components/Company/Company'
import { useState } from 'react'
import Nav from './components/Nav/Nav'
import EditCompany from './components/EditCompany/EditCompany'
import AddProduct from './components/AddProduct/AddProduct'
import Products from './components/Products/Products'
import ProductDesc from './components/ProductDescription/ProductDesc'
import EditProduct from './components/EditProduct/EditProduct'
import Wishlist from './components/Wishlist/Wishlist'
import DisplayProduct from './components/DisplayProduct/DisplayProduct'
import Cart from './components/Cart/Cart'
import ConfirmPassword from './components/ConfirmPassword/ConfirmPassword'
import PurchaseCompleted from './components/PurchaseCompleted/PurchaseCompleted'
import Orders from './components/Orders/Orders'
import Scart from './components/Scart/Scart'



function App() {
  const [user,setUser]=useState("")
  const [type,setType]=useState("")
  const [cartCount,setCartCount]=useState("")

  

 

  return (
    <BrowserRouter>
     {user && <Nav user={user} setUser={setUser} type={type} cartCount={cartCount} setCartCount={setCartCount}   />}
        <Routes>
          <Route path='/' element={<Home setUser={setUser} setType={setType}  />}/>
          <Route path='/signin' Component={SignIn}/>
          <Route path='/signup' Component={SignUp}/>
          <Route path='/email' Component={Email}/>
          <Route path='/confirmpassword' element={<ConfirmPassword />}/>
          <Route path='/profile' element={<Profile setUser={setUser} type={type} setType={setType}/>}/>
          <Route path='/editcompany' element={<EditCompany setUser={setUser}/>}/>
          <Route path='/company' element={<Company setUser={setUser}/>}/>
          <Route path='/addproduct' element={<AddProduct setUser={setUser} />}/>
          <Route path='/catproducts/:category' element={<Products setUser={setUser} />}/>
          <Route path='/proddesc/:_id' element={<ProductDesc  setUser={setUser} setType={setType}/>}/>
          <Route path='/editproduct/:_id'  element={<EditProduct/>}/>
          <Route path='/displayproduct/:_id' element={<DisplayProduct setUser={setUser}/>}/>
          <Route path='/wishlist' element={<Wishlist setUser={setUser}/>}/>
          <Route path='/cart' element={<Cart setUser={setUser}/>}/>
          <Route path='/purchasecompleted' element={<PurchaseCompleted setUser={setUser} setType={setType}/>}/>
          <Route path='/orders' element={<Orders setUser={setUser} setType={setType}/>}/>
          <Route path='/scart/:_id' element={<Scart setUser={setUser} setType={setType}/>}/>












        </Routes>
    </BrowserRouter>
   
  )
}

export default App
