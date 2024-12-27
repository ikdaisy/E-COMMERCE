import express from 'express'
import Connection from './connection.js'
import router from './router.js'
import cors from 'cors'
// import env from 'dotenv'
// env.config()

const app=express()

app.use(cors())
app.use(express.json({limit:"50mb"}))
app.use('/api',router)


Connection().then(()=>{
    app.listen(3000,()=>{
        console.log('Server at http://localhost:3000');
        
    })
}).catch((error)=>{
    console.log(error);
    
})