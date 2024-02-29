const express=require("express");
const { register, login, google, logout} = require("../controllers/usercontroller");
const { isAuthenticated, authorizeRoles } = require("../middleware/Authenticated");

const router=express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/google", google)
router.get("/logout", isAuthenticated, logout)


module.exports = router