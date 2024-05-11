import express from "express";
import { getMyUsers, login, signup, resetPassword ,updateUserProfilePic} from "../Controller/user-controller.js";
import authMiddelware from "../Middelware/authMiddelware.js";

const router = express.Router();

router.get("/", getMyUsers); // my all users in one place
router.post("/signup", signup); //my users should signup here
router.post("/login", login); //my users should login here
router.post("/resetpassword",resetPassword); // users should change password here
router.put('/profilePic',updateUserProfilePic); //update profilepic

export default router;
