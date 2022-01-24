const express                      = require("express");
const router                       = express.Router();
const agesController               = require("../controllers/ageController");
const { validate }                 = require("../middlewares/validators");
const checkAuthentication          = require('../middlewares/jwt_token');

router.get("/get-all",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,agesController.getAll);
router.get("/get-sortColumn",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,agesController.getSortColumn);
router.post("/get-ordered-ages",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,agesController.getOrder);
router.post("/get-all-paging",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, agesController.getAllByPaging);
router.post("/",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, validate.validateAges(), agesController.create);
router.get("/get-by-id/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, agesController.getById);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, validate.validateAges(), agesController.update);
router.get("/restore/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, agesController.restore);
router.delete("/:id",checkAuthentication.checkAccessToken, checkAuthentication.checkAdmin,agesController.delete);

module.exports = router;
