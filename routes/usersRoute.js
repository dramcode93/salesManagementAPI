import { Router } from "express";
import { protectRoutes } from "../controllers/auth.js";
import { createUser, userList, userId, updateUser, deleteUser, changeUserPassword } from "../controllers/user.js"

const router = new Router();
router.use(protectRoutes)

router.route('/')
    .get(userList)
    .post(createUser)

router.route('/:id')
    .get(userId)
    .put(updateUser)
    .delete(deleteUser)

router.put('/changeUserPassword/:id', changeUserPassword)


export default router
