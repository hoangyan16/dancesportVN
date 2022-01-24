const express                               = require("express");
const router                                = express.Router();
const feesController                        = require("../controllers/feeController");
const { validate }                          = require("../middlewares/validators");
const checkAuthentication                   = require('../middlewares/jwt_token');

router.get("/get-all",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, feesController.getAll);
router.post("/get-all-paging", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,feesController.getAllByPaging);
router.post("/",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, validate.validateFees(), feesController.create);
router.get("/get-by-id/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, feesController.getById);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, validate.validateFees(), feesController.update);
router.delete("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, feesController.delete);
router.get("/restore/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, feesController.restore);

module.exports = router;
