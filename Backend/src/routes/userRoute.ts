import express, {Router} from "express"
import { registerUser,loginUser,getUser,uploadImage, updateProfile } from "../controllers/userController.js";
import upload from "../config/multer.js";

const router : Router = express.Router()


router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile',getUser)
router.post('/upload-image', upload.single('profileImage'), uploadImage);
router.put('/profile',updateProfile)





export default router