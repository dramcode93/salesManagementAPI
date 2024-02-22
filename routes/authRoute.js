import { Router } from "express";
import { forgetPassword, login, protectRoutes, refreshToken, resetPassword, verifyResetPasswordCode } from "../controllers/auth.js";
import { loginValidator, resetPasswordValidator } from "../utils/validation/authValidator.js";

const router = new Router();
router.route('/login').post(loginValidator, login);
router.route('/forgetPassword').post(forgetPassword);
router.route('/verifyResetPasswordCode').post(verifyResetPasswordCode);
router.route('/resetPassword').put(resetPasswordValidator, resetPassword);
router.route('/refreshToken').get(protectRoutes, refreshToken);
export default router;