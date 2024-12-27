
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



function App() {
  const [user,setUser]=useState("")
 

  return (
    <BrowserRouter>
     {user && <Nav user={user} setUser={setUser}  />}
        <Routes>
          <Route path='/' element={<Home setUser={setUser}/>}/>
          <Route path='/signin' Component={SignIn}/>
          <Route path='/signup' Component={SignUp}/>
          <Route path='/email' Component={Email}/>
          <Route path='/profile' element={<Profile setUser={setUser}/>}/>
          <Route path='/editcompany' element={<EditCompany setUser={setUser}/>}/>

          <Route path='/company' element={<Company setUser={setUser}/>}/>
          <Route path='/addproduct' element={<AddProduct setUser={setUser} />}/>
          <Route path='/allproducts' element={<Products setUser={setUser} />}/>




        </Routes>
    </BrowserRouter>
   
  )
}

export default App
