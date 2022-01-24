const express                                   = require("express");
const router                                    = express.Router();
const danceController                           = require("../controllers/danceTypeController");
const { validate }                              = require("../middlewares/validators");
const checkAuthentication                       = require('../middlewares/jwt_token');

router.get("/get-all",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, danceController.getAll);
router.post("/get-all-paging", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,danceController.getAllByPaging);
router.post("/",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, validate.validateDanceTypes(), danceController.create);
router.get("/get-by-id/:id", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,danceController.getById);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, validate.validateDanceTypes(), danceController.update);
router.delete("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, danceController.delete);
router.get("/restore/:id", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,danceController.restore);

module.exports = router;
