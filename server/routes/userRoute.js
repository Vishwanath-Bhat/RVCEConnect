const express = require('express')
const { upload, cleanUpFile } = require('../middlewares/fileHandler');
//controller functions
const {signupUser, loginUser,getProfileDetails, logoutUser} = require('../controllers/userController')
const  verifyToken  = require('../middlewares/requireAuth')
const router = express.Router()



//login route
router.post('/login', loginUser)


//Siign up Route
router.post('/signup',upload.single('profilePhoto'), signupUser)
//Logut Route
router.post('/logout',logoutUser)

router.get("/me",verifyToken,getProfileDetails)

module.exports = router