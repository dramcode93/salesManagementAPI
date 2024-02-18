import { Router } from "express";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { userId, getLoggedUserData, updateLoggedUser, updateLoggedUserPassword, createUser, userList, adminUsers, updateUser, changeUserPassword, deleteUser } from "../controllers/user.js"
import { changeUserPasswordValidator, createUserValidator, deleteUserValidator, getUserValidator, updateLoggedUserPasswordValidator, updateLoggedUserValidator, updateUserValidator } from "../utils/validation/userValidator.js";

const router = new Router();
router.use(protectRoutes)
router.use(checkActive)

router.get('/getMe', getLoggedUserData, getUserValidator, userId)
router.put('/updateMyPassword', updateLoggedUserPasswordValidator, updateLoggedUserPassword)

router.use(allowedTo('manager', 'admin'))

router.put('/updateMe', updateLoggedUserValidator, updateLoggedUser)

router.route('/')
    .get(adminUsers, userList)
    .post(createUserValidator, createUser)

router.route('/:id')
    .get(getUserValidator, userId)
    .put(updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser)

router.put('/changeUserPassword/:id', changeUserPasswordValidator, changeUserPassword)


export default router
