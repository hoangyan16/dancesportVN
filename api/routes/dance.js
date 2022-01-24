const express                                = require("express");
const router                                 = express.Router();
const dancesController                       = require("../controllers/danceController");
const { validate }                           = require("../middlewares/validators");
const checkAuthentication                    = require('../middlewares/jwt_token');

router.get("/get-all",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, dancesController.getAll);
router.get("/get-sortColumn",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, dancesController.sort);
router.post("/get-all-paging",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, dancesController.getAllByPaging);
router.get("/get-all-prepared-data", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,dancesController.getAllPreparedData);
router.get("/get-by-id/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, dancesController.getById);
router.post("/", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,validate.validateDances(), dancesController.create);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, validate.validateDances(),dancesController.update);
router.delete("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, dancesController.delete);
router.get("/restore/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, dancesController.restore);

module.exports = router;
