import { Router } from "express";
import { protectRoutes } from "../controllers/auth.js";
import { userId, getLoggedUserData, updateLoggedUser, updateLoggedUserPassword } from "../controllers/user.js"
import { getUserValidator, updateLoggedUserPasswordValidator, updateLoggedUserValidator } from "../utils/validation/userValidator.js";

const router = new Router();
router.use(protectRoutes)

router.get('/getMe', getLoggedUserData, getUserValidator, userId)
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUser)
router.put('/updateMyPassword', updateLoggedUserPasswordValidator, updateLoggedUserPassword)

// router.route('/')
//     .get(userList)
//     .post(createUser)

// router.route('/:id')
//     .get(userId)
//     .put(updateUser)
//     .delete(deleteUser)

// router.put('/changeUserPassword/:id', changeUserPassword)


export default router
