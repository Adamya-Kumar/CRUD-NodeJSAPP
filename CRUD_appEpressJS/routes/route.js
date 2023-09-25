const { render } = require('ejs')
const express = require('express')
const User = require("../models/schema")
const multer=require('multer')
const router = express.Router()
const fs= require('fs')

// image upload..
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null,file.fieldname+"_"+Date.now()+"_"+ file.originalname)
    }
})
var upload = multer({
    storage: storage,
    
}).single("image")


// insert data into db
router.post('/add', upload, (req, res) => {
    
        console.log(req.body)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image:  req.file.filename,
    })
    user.save((err) => {
        if (err) {
            res.json({ msg: err.message,type :"danger" })
        }
        else {
            req.session.message = {
                type: "Success",
                message: "User add successfully!"
            };
            res.redirect("/");
        }
    })
})

// get all User..
router.get("/", (req, res) => {
    User.find().exec((err, user) => {
        if (err) {
            res.json({message:err.message})
        } else {
            res.render("index", {
                title: "Home Page",
                users:user,
            })
        }
    })
})
router.get("/add", (req, res) => {
    res.render("add_User",{title:"Add Users"})
})

//edit an user route
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, data) => {
        if (err) {
            res.redirect('/')
        } else {
            if (data === null) {
                res.redirect('/')
            }
            else {
                res.render("edit_users", {
                    title: "Edit User",
                    user: data,
                })
            }
        }
    })
})
// update user route
router.post("/update/:id", upload, (req, res) => {
    let id = req.params.id;
    let new_image = ""
    if (req.file) {
        new_image = req.file.filename;
        try {
           fs.unlinkSync('./uploads/'+req.body.old_image) 
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }
    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image:new_image,
    }, (err, data) => {
        if (err) {
            req.json({message:err.message,type:'danger'})
        } else {
            req.session.message = {
                type: "success",
                message:"User Updated successfully"
            }
            res.redirect("/")
        }
    })
})
//delete user route
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, data) => {
        if (data.image != "") {
            try {
                fs.unlinkSync('./uploads/'+data.image)
            } catch (err) {
                console.log(err);
            }
        }

        if (err) {
            res.json({message:err.message})
        } else {
            req.session.message = {
                type: "success",
                message:"User Deleted successfully"
            }
            res.redirect('/');
        }

    })
})
router.get("/about", (req, res) => {
    res.render("about")
})
module.exports = router
