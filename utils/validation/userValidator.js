import { check, body } from "express-validator";
import bcrypt from "bcryptjs";
import { validatroMiddleware } from "../../middlewares/validatorMiddleware.js";
import userModel from '../../models/userModel.js';

export const getUserValidator = [
  check("id").isMongoId().withMessage("invalid user id"),
  validatroMiddleware,
];
export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage(" User Name is Required")
    .isLength({ min: 3 })
    .withMessage("Too Short Name..!!"),
  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("InValid Email Address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((userModel) => {
        if (userModel) {
          return Promise.reject(new Error("Email already in user"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password Required")
    .isLength({ min: 6, max: 14 })
    .withMessage("Password must be at least 6 character")
    .custom((password, { req }) => {
      if (password != req.body.passwordConfirmation) {
        throw new Error("InCorrect Password");
      }
      return true;
    }),

  check("passwordConfirmation")
    .notEmpty()
    .withMessage("Password Confimation required"),
  validatroMiddleware,
];
export const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  check("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("InValid Email Address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((userModel) => {
        if (userModel) {
          return Promise.reject(new Error("Email already in user"));
        }
      })
    ),
  validatroMiddleware,
];

export const changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid Id"),
  body("currentPassword")
    .notEmpty()
    .withMessage(" You Must Enter Your current Password"),
  body("passwordConfirmation")
    .notEmpty()
    .withMessage("You Must Enter Password Confirm"),
  body("password")
    .notEmpty()
    .withMessage("You Must Enter New Password")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Erorr("there is No User For This Id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Erorr("InCorrect Current Password");
      }
      if (val != req.body.passwordConfirmation) {
        throw new Error("InCorrect Password Confirmation");
      }
      return true;
    }),
  validatroMiddleware,
];
export const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatroMiddleware,
];
