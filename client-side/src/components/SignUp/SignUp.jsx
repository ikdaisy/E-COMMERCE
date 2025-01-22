import axios from 'axios'
import React, { useState } from 'react'
import Api from '../Api';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const SignUp = () => {
  const api=Api()
  const navigate = useNavigate()
  const email = localStorage.getItem("Email");
    const [userData,setUserData]=useState({
        username:"",
        email:email,
        phone:"",
        password:"",
        cpassword:"",
        accountType:"",
    })
    const [errors, setErrors] = useState({
        password: "",
        cpassword: "",
        phone: "",
      });

      const handleChange = async (e) => {
        const { name, value } = e.target;
      
        // Update the user data
        setUserData((prev) => ({ ...prev, [name]: value }));
      
        // Validation logic
        if (name === "password") {
          const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
          if (!value) {
            setErrors((prev) => ({ ...prev, password: "" })); // Handle empty field
          } else if (!passwordRegex.test(value)) {
            setErrors((prev) => ({
              ...prev,
              password: "Password must be 8-16 characters, include uppercase, lowercase, number, and special character.",
            }));
          } else {
            setErrors((prev) => ({ ...prev, password: "" }));
          }
        }
      
        if (name === "cpassword") {
          if (!value) {
            setErrors((prev) => ({ ...prev, cpassword: "" })); // Handle empty field
          } else if (value !== userData.password) {
            setErrors((prev) => ({ ...prev, cpassword: "Passwords do not match." }));
          } else {
            setErrors((prev) => ({ ...prev, cpassword: "" }));
          }
        }
      
        if (name === "phone") {
          const phoneRegex = /^\d{10}$/;
          if (!value) {
            setErrors((prev) => ({ ...prev, phone: "" })); // Handle empty field
          } else if (!phoneRegex.test(value)) {
            setErrors((prev) => ({
              ...prev,
              phone: "Phone number must be a 10-digit number.",
            }));
          } else {
            setErrors((prev) => ({ ...prev, phone: "" }));
          }
        }
      };
      
    const handleSubmit=async(e)=>{
       e.preventDefault()
       try {
        const res = await axios.post(`${api}/signup`,userData)
        console.log(res);
         if(res.status==201){
              toast.success(`🦄 ${res.data.msg}!`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
                
            }
            setTimeout(() => {
                navigate('/signin');
               }, 5000);
        
        
       } catch (error) {
         toast.error(`🦄 ${error.response.data.msg}!`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              });
        
       }


        

    }
  return (
    <section className=" bg-gray-50 ">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Create free account</h2>
            <p className="max-w-xl mx-auto mt-3  text-base leading-relaxed text-gray-600">It's quick and easy.</p>
        </div>

        <div className="relative max-w-md mx-auto mt-5 md:mt-5">
            <div className="overflow-hidden bg-white rounded-md shadow-md">
                <div className="px-4 py-6 sm:px-8 sm:py-7">
                    <form>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="" className="text-base font-medium text-gray-900"> Username </label>
                                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>

                                    <input
                                        type="text"
                                        name="username" onChange={handleChange}
                                       
                                        placeholder="Enter your name"
                                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                    />
                                </div>
                            </div>

                           
                            <div>
                                <label htmlFor="" className="text-base font-medium text-gray-900"> Phone </label>
                                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>

                                    <input
                                        type="text"
                                        name="phone" onChange={handleChange}
                                       
                                        placeholder="Enter your phone number"
                                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                    />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                                </div>
                            </div>

                            <div>
                                <label htmlFor="" className="text-base font-medium text-gray-900"> Password </label>
                                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                                            />
                                        </svg>
                                    </div>

                                    <input
                                        type="password" onChange={handleChange}
                                        name="password"
                                       
                                        placeholder="Enter your password"
                                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                    />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                                </div>
                            </div>
                            <div>
                                <label htmlFor="" className="text-base font-medium text-gray-900"> Confirm Password </label>
                                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                                            />
                                        </svg>
                                    </div>

                                    <input
                                        type="password" onChange={handleChange}
                                        name="cpassword"
                                       
                                        placeholder="Confirm your password"
                                        className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                    />
            {errors.cpassword && <p className="text-red-500 text-sm">{errors.cpassword}</p>}

                                </div>
                            </div>

                            <div>
  <label htmlFor="account-type" className="text-base font-medium text-gray-900">Account Type</label>
  <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
    </div>

    <select
      id="account-type" onChange={handleChange}
      name="accountType"
      className="block w-full py-4 pl-10 pr-4 text-gray-500 focus-within:text-gray-600 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
    >
        <option   value="">Select a type</option>
      <option value="Seller">Seller</option>
      <option value="Buyer">Buyer</option>
    </select>
  </div>
</div>


                           
                           

                            <div>
                                <button type="submit" onClick={handleSubmit} className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700">
                                    Create account
                                </button>
                                 <ToastContainer />
                            </div>

                            {/* <div className="text-center">
                                <p className="text-base text-gray-600">Already have an account? <a href="#" title="" className="font-medium text-orange-500 transition-all duration-200 hover:text-orange-600 hover:underline">Login here</a></p>
                            </div> */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

  )
}

export default SignUp