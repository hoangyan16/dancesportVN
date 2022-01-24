const express                              = require("express");
const router                               = express.Router();
const commentController                     = require("../controllers/commentController");
const { validate }                         = require("../middlewares/validators");
const checkAuthentication                  = require('../middlewares/jwt_token');

router.get("/get-all-by-id", commentController.getAll);
router.post("/get-all-paging", commentController.getAllByPaging);
router.get("/get-all-prepared-data", commentController.getAllPreparedData);
router.get("/get-by-id/:id",commentController.getById);
router.post("/",checkAuthentication.checkAccessToken, commentController.create);
router.put("/:id",checkAuthentication.checkAccessToken,commentController.update);
router.delete("/:id",checkAuthentication.checkAccessToken, commentController.delete);
router.get("/restore/:id",checkAuthentication.checkAccessToken, commentController.restore);

module.exports = router;
