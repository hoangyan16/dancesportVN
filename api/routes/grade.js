const express                              = require("express");
const router                               = express.Router();
const gradesController                     = require("../controllers/gradeController");
const { validate }                         = require("../middlewares/validators");
const checkAuthentication                  = require('../middlewares/jwt_token');

router.get("/get-all",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, gradesController.getAll);
router.get("/get-sortColumn",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, gradesController.sort);
router.post("/get-all-paging",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, gradesController.getAllByPaging);
router.get("/get-all-prepared-data",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, gradesController.getAllPreparedData);
router.get("/get-by-id/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, gradesController.getById);
router.post("/", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,validate.validateGrades(), gradesController.create);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, validate.validateGrades(), gradesController.update);
router.delete("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, gradesController.delete);
router.get("/restore/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, gradesController.restore);

module.exports = router;
