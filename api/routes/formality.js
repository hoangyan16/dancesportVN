const express                              = require("express");
const router                               = express.Router();
const formalityController                     = require("../controllers/formalityController");
const { validate }                         = require("../middlewares/validators");
const checkAuthentication                  = require('../middlewares/jwt_token');

router.get("/get-all",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, formalityController.getAll);
router.post("/get-all-paging",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, formalityController.getAllByPaging);
router.get("/get-all-prepared-data",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, formalityController.getAllPreparedData);
router.get("/get-by-id/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, formalityController.getById);
router.post("/",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, formalityController.create);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, formalityController.update);
router.delete("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, formalityController.delete);
router.get("/restore/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, formalityController.restore);

module.exports = router;
