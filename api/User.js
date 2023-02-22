const express = require('express');
const router = express.Router();


//monggose user model
const User = require('./../models/User');
//password hadnler
const bcrypt = require('bcrypt');

router.post('/signup',(req,res)=>{
    let{name,email,password,dateOfBirth}=req.body;
    name=name.trim();
    email=email.trim();
    password=password.trim();
    dateOfBirth=dateOfBirth.trim();
    if(name==""||email==""||password==""||dateOfBirth==""){
res.json({
status: "FAILED",
message: "Empty input fields!"
});
    }
    else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status: "FAILED",
            message: "Empty name Entred!"
    })
    }else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email Entred!"
    })
    } else if(!new Date (dateOfBirth).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
    })
}else if(password.length<8){
    res.json({
        status: "FAILED",
        message: "Password is too short"
})
}else{
//user exist
User.find({email}).then(result =>{

    if(result.length){
        res.json({
            status: "FAILED",
            message: "User with the provided email already exist"
})
}
else{
//create new user

//password
const saltRounds = 10;
bcrypt.hash(password,saltRounds).then(hashedPassword =>{  
    const newUser = new User({
name,
email,
password:hashedPassword,
dateOfBirth,
    });
newUser.save().then(result=>{

    res.json({
        status: "Sucess",
        message: "SignUp Sucessfully",
        data:result,
})
})
.catch(err => {
    console.log(err);
    res.json({
        status: "FAILED",
        message: "An Error Occured While Saving user Password"
    })
})
})
.catch(err => {
    console.log(err);
    res.json({
        status: "FAILED",
        message: "An Error Occured While Hashing Password"
    })
})
}
}).catch(err => {
console.log(err);
res.json({
    status: "FAILED",
    message: "An Error Occured While Chechking for existing User"
})

})
}
})

router.post('/signin',(req,res)=>{
    let{email,password}=req.body;
    email = email.trim();
    password = password.trim();
    if(email == "" || password == ""){

        res.json({
            status: "FAILED",
            message: "Empty credentials Supplied"
        })
    }else{

        User.find({email})
        .then(data =>{
if (data.length){//user exist
    const hashedPassword = data[0].password;
    bcrypt.compare(password,hashedPassword).then(result =>{
if(result){
    res.json({
    status: "Sucess",
    message: "Signin Sucessfully",
    data:data
})
}else{

    res.json({
        status: "FAILED",
        message: "Invalid Password entered"
    })
}
    })

    .catch(err =>{
        res.json({
        status: "FAILED",
        message: "An error occured while comparing passwords"

    })
})
}else{
    res.json({
        status: "FAILED",
        message: "invalid credentials entered"

    })

}
        
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An Error Occured While Checking for exisitng User"
        
            })
        })
    }
    
})
module.exports = router;