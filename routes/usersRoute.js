import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { userId, getLoggedUserData, updateLoggedUser, updateLoggedUserPassword, createUser, userList, adminUsers, updateUser } from "../controllers/user.js"
import { createUserValidator, getUserValidator, updateLoggedUserPasswordValidator, updateLoggedUserValidator, updateUserValidator } from "../utils/validation/userValidator.js";

const router = new Router();
router.use(protectRoutes)
router.use(checkActive)

router.get('/getMe', getLoggedUserData, getUserValidator, userId)
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUser)
router.put('/updateMyPassword', updateLoggedUserPasswordValidator, updateLoggedUserPassword)

router.use(allowedTo('manager', 'admin'))

router.route('/')
    .get(adminUsers, userList)
    .post(createUserValidator, createUser)

router.route('/:id')
    .get(getUserValidator, userId)
    .put(updateUserValidator, updateUser)
//     .delete(deleteUserValidator, deleteUser)

// router.put('/changeUserPassword/:id', changeUserPassword)


export default router
