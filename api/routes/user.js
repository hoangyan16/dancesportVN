const express                      = require("express");
const router                       = express.Router();
const userController               = require("../controllers/userController");
const { validate }                 = require('../middlewares/validators');
const checkAuthentication          = require('../middlewares/jwt_token');


router.get("/get-all",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,userController.getAll);
router.post("/get-all-paging",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,userController.getAllByPaging);
router.get("/get-by-id/:id",checkAuthentication.checkAccessToken,userController.getById);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,userController.update);
router.get("/restore/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, userController.restore);
router.delete("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,userController.delete);
router.post("/reset-password",checkAuthentication.checkAccessToken,userController.resetPassword);
router.post("/forgot-pass",userController.forgetPassword);
router.post("/send-verification-email",userController.sendVerify);
router.post("/verify/for/register",userController.verifyForRegister);
router.post("/send-verification-email/to/register",userController.sendEmailToVerifyAccount);
router.post("/login",userController.login);
router.post("/register",userController.register);
router.post("/create",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,validate.validateRegisterUser(), userController.create);
router.post("/refresh-token", userController.refreshToken);
router.delete("/logout",checkAuthentication.checkAccessToken,userController.logout);



module.exports = router;
