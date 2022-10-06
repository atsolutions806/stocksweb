const express = require('express')
const router = express.Router();
const {protect}=require('../middleware/auth')
const{register,login,forgotpassword,updateProfile,resetpassword,users,deleteUser,updateUser,getUser,findUser,totalUsers}=require('../controller/user.controller')
router.route('/findUser').get(protect,findUser)
router.route('/users').get(protect,users)
router.route('/totalUsers').get(protect,totalUsers)
router.route('/user').get(protect,getUser)
router.route('/user').delete(protect,deleteUser)
router.route('/updateuser/:id').put(protect,updateUser)
router.route('/updateProfile/:id').put(protect,updateProfile)
router.route('/register').post(register)
router.route("/login").post(login)
router.route('/forgotpassword').post(forgotpassword)
router.route('/passwordreset/:resetToken').put(resetpassword)

module.exports =router