const express                      = require("express");
const router                       = express.Router();
const contactController            = require("../controllers/contactController");
const { validate }                 = require("../middlewares/validators");
const checkAuthentication          = require('../middlewares/jwt_token');

router.get("/get-all",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contactController.getAll);
router.post("/get-all-paging", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contactController.getAllByPaging);
router.post("/", checkAuthentication.checkAccessToken,contactController.create);
router.get("/get-by-id/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, contactController.getById);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contactController.update);
router.get("/restore/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, contactController.restore);
router.post("/delete-contacts",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contactController.delete);
router.delete("/delete-all",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contactController.deleteAll);


module.exports = router;
