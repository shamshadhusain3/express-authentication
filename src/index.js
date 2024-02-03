const exp = require('constants')
const express=require('express')
const app= express()
const user=require('./database')
const { log } = require('console')
path=require('path')
let login=true
phash=require('bcrypt')

app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
// setting css file
app.use(express.static('public'));


app.get('/login',(req,res)=>{
    res.render('login')
})



app.post('/register',async(req,res)=>{
   let {  username, password }=req.body
   saltRound=10
password = await phash.hash(password,saltRound)
//    console.log("Password Hashed",enpass)
   const exist=await  user.findOne({username:req.body.username})
   

   if (exist) {
    res.send({error:"Username already exists try a different name"})
   } else{
    newuser=new user({username,password,login})
    await newuser.save()
    
    
    res.redirect('login')
   }
   
})
app.get('/register',(req,res)=>{
    res.render('register')
})

// app.post('/login', async(req, res) => {
//     try{
//             const foundUser = await user.findOne({ username: req.body.username });

//         if(foundUser){
//             const result = await phash.compare(req.body.pass, foundUser.password);
//             if(result){
//                 //res.send('Login Successful')
//                 res.render('home')
//             }
//             else{
//                 res.send('Incorrect password')
//             }
//         }
//         else{
//             res.send('User does not exist')
//         }
//     }
//     catch(error){
//         res.send(error)
//     }
// })

// app.post('/login', async (req, res) => {
//     const foundUser = await user.findOne({ username: req.body.username });

//     if (!foundUser) {
//         res.send('User not found');
//     } else {
//         result=phash.compare(req.body.password, foundUser.password );
//         if (result) {
//             console.log('password matched')
//             res.redirect('home')
            
//         }else{
//             res.send('Wrong Password')
//         }
//     }
// });
app.post('/login', async(req, res) => {
    try{
        const check = await user.findOne({username: req.body.username});
        if(check){
            const result = await phash.compare(req.body.password, check.password);
            if(result){
                //res.send('Login Successful')
                res.send('login successfull')
            }
            else{
                res.send('Incorrect password')
            }
        }
        else{
            res.send('User does not exist')
        }
    }
    catch(error){
        res.send(error)
    }
})

// logout= async()=> {
//     const mila=await user.findOneAndUpdate({login:true},{login:false})
//     console.log('kch to hua')
// }

app.get('/',async(req,res)=>{
    
   okk=await user.findOne({login:login})
   if (okk) {
    
       res.render('home',{user})
   }else{
    res.redirect('login')
   }
})




app.listen(3000,()=>console.log(`server runnind` ))