const express                      = require("express");
const router                       = express.Router();
const settingController            = require("../controllers/settingController");
const { validate }                 = require("../middlewares/validators");
const checkAuthentication          = require('../middlewares/jwt_token');

router.get("/get-all",settingController.getAll);
router.post("/get-all-paging", settingController.getAllByPaging);
router.post("/", settingController.create);
router.post("/upload-image", settingController.uploadImages);
router.get("/get-by-id/:id", settingController.getById);
router.put("/:id", settingController.update);
router.get("/restore/:id", settingController.restore);
router.delete("/:id",settingController.delete);

module.exports = router;
