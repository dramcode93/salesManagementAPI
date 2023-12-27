import { Router } from "express";
import { login } from "../controllers/auth.js";
import { loginValidator } from "../utils/validation/authValidator.js";

const router = new Router();
router.route('/login').post(loginValidator, login);
// router.route('/forgetPassword').post(forgetPassword);
// router.route('/verifyResetPasswordCode').post(verifyResetPasswordCode);
// router.route('/resetPassword').put(resetPassword);
export default router;