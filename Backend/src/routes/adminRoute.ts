import express, {Router} from "express"
import { loginAdmin,fetchAllUsers,createUser,updateUser,deleteUser,getUserById } from "../controllers/adminController.js";


const router : Router = express.Router()

router.post('/login', loginAdmin);
router.get('/fetchUsers', fetchAllUsers)
router.post('/create',createUser)
router.patch('/update',updateUser)
router.delete('/delete',deleteUser)
router.get('/user/:id', getUserById)



export default router