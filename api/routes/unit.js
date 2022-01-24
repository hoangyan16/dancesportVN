const express                              = require("express");
const router                               = express.Router();
const unitController                       = require("../controllers/unitController");
const checkAuthentication                  = require('../middlewares/jwt_token');

router.get("/get-all",unitController.getAll);
router.get("/get-sortColumn",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,unitController.getSortColumn);
router.get("/get-by-id", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,unitController.getById);
router.post("/",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, unitController.create);
router.put("/:id", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,unitController.update);
router.delete("/:id", checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,unitController.delete);



module.exports = router;
