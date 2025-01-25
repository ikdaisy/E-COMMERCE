import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2';



const EditCompany = ({setUser}) => {
    const navigate=useNavigate()
    const token = localStorage.getItem("Token")
    const [updateData,setUpdateData]=useState({})
    const [proBool,setProBool]=useState(false);
     const [errors, setErrors] = useState({
           email:""
          });
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
          Swal.fire({
                     title: 'Updated!',
                     text: res.data.msg,
                     icon: 'success',
                     confirmButtonText: 'OK',
                     customClass: {
                       popup: 'bg-white rounded-lg shadow-md',
                       title: 'text-lg font-semibold text-gray-800',
                       htmlContainer: 'text-sm text-gray-600',
                       confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
                     },
                   });
          navigate('/company')
         
        }
       
        }

        const handleChange=(e)=>{
            // setUpdateData((pre)=>({...pre,[e.target.name]:e.target.value}))
            const { name, value } = e.target;
      
            // Update the user data
            setUpdateData((prev) => ({ ...prev, [name]: value }));
            if (name === "email") {
                  const emailRegex = /^\S+@\S+\.\S+$/;
              
              if (!value) {
                setErrors((prev) => ({ ...prev, email: "" })); // Handle empty field
              } else if (!emailRegex.test(value)) {
                setErrors((prev) => ({
                  ...prev,
                  email:  "Invalid email",
                }));
              } else {
                setErrors((prev) => ({ ...prev, email: "" }));
              }
            }
            
        }

        const handleFile=async(e)=>{
          const profile=await convertToBase64(e.target.files[0])
          setUpdateData((pre)=>({...pre,profile:profile}))
        }
        function convertToBase64(file) {
          return new Promise((resolve,reject)=>{
              const fileReader=new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload=()=>{
                  resolve(fileReader.result)
              }
              fileReader.onerror= (error)=>{
                  reject(error)
              }
          })
        }
  return (
    <>
 <h2 className='mt-5 text-center  text-2xl font-medium text-gray-900'>Edit Information</h2>
<form className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
  <div className="mb-4">
    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
      Name
    </label>
    <input
      type="text"
      id="name"
      name="name"
      value={updateData.name}
      placeholder="Enter your name"
      onChange={handleChange}
      className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
      Email
    </label>
    <input
      type="email"
      id="email"
      name="email"
      value={updateData.email}
      placeholder="Enter your email"
      onChange={handleChange}
      className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
    />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

  </div>

  <div className="mb-4">
    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
      Phone
    </label>
    <input
      type="text"
      id="phone"
      name="phone"
      value={updateData.phone}
      placeholder="Enter your phone number"
      onChange={handleChange}
      className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="place" className="block text-sm font-medium text-gray-700">
      Place
    </label>
    <input
      type="text"
      id="place"
      name="place"
      value={updateData.place}
      placeholder="Enter your location"
      onChange={handleChange}
      className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
      Profile Picture
    </label>
    <input
      type="file"
      id="profilePic"
      name="profilePic"
      accept="image/*"
      onChange={handleFile}
      className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-gray-900"
    />
  </div>

  <div className="mt-6">
    <button
      type="submit"
      onClick={handleSubmit}
      className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
    >
      {proBool ? 'Update' : 'Add'}
    </button>
  </div>
</form>


   </>
  )
}

export default EditCompany