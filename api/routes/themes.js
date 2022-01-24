const express                      = require("express");
const router                       = express.Router();
const themeController              = require("../controllers/themeController");
const { validate }                 = require("../middlewares/validators");
const checkAuthentication          = require('../middlewares/jwt_token');

router.get("/get-all", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,themeController.getAll);
router.post("/get-all-paging",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, themeController.getAllByPaging);
router.get("/get-all-prepared-data",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, themeController.getAllPreparedData);
router.get("/get-by-id/:id", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,themeController.getById);
router.post("/",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, themeController.create);
router.put("/:id", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,themeController.update);
router.delete("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, themeController.delete);
router.get("/restore/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, themeController.restore);

module.exports = router;
