import { creatUser, userList, userId, updateUser, deleteUser, changeUserPassword } from "../controllers/user.js"

import { Router } from "express";
const router = new Router();


router.route('/')
    .get(userList)
    .post(creatUser)

router.route('/:id')
    .get(userId)
    .put(updateUser)
    .delete(deleteUser)

router.put('/changeUserPassword/:id', changeUserPassword)


export default router
