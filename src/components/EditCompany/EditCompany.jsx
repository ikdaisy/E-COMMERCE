import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

import './EditCompany.css'

const EditCompany = ({setUser}) => {
    const navigate=useNavigate()
    const token = localStorage.getItem("Token")
    const [updateData,setUpdateData]=useState({})
    const [proBool,setProBool]=useState(false);
    useEffect(()=>{
        fetchUserData()
  
    },[])

    const fetchUserData=async()=>{
        const res = await axios.get("http://localhost:3000/api/getcompanydata",{headers:{"Authorization":`Bearer ${token}`}})
        console.log(res);
        if(res.status==200){
          setUser(res.data.userData.username)
        
           if(res.data.companyData){
            const data= {name:res.data.companyData.name,email:res.data.companyData.email,phone:res.data.companyData.phone,place:res.data.companyData.place}
            setUpdateData(data)
            setProBool(true)
           }
           
        }
      }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const res = await axios.post("http://localhost:3000/api/editCompanyData",updateData,{headers:{"Authorization":`Bearer ${token}`}})
        console.log(res);
        if(res.status==201){
          alert(res.data.msg)
          navigate('/company')
         
        }
       
        }

        const handleChange=(e)=>{
            setUpdateData((pre)=>({...pre,[e.target.name]:e.target.value}))
            
        }
  return (
    <>
   <div className='body'>
   <div className="e-container">
        <h2>Edit Information</h2>
        <form>
            <label htmlFor="inputField">Name:</label>
            <input type="text" className='name' id="inputField" name="name" value={updateData.name} placeholder="" onChange={handleChange}/>
            <label htmlFor="inputField">Email:</label>
            <input type="email" className='' id="inputField" name="email" value={updateData.email} placeholder="" onChange={handleChange}/>

            <label htmlFor="inputField">Phone:</label>
            <input type="text" className='phone' id="inputField" value={updateData.phone} name="phone" placeholder="" onChange={handleChange}/>
            <label htmlFor="inputField">Place:</label>
            <input type="text" className='place' id="inputField" value={updateData.place} name="place" placeholder="" onChange={handleChange}/>
            <button className='edit' type="submit" onClick={handleSubmit} >{proBool?'Update':'Add'}</button>
        </form>
        <div className="footer">

        </div>

    </div>
   </div>

   </>
  )
}

export default EditCompany