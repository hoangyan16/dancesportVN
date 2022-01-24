const express                  = require("express");
const router                   = express.Router();
const newsController           = require("../controllers/newsController");
const checkAuthentication      = require('../middlewares/jwt_token');

router.get("/get-all", newsController.getAll);
router.post("/get-all-paging", newsController.getAllByPaging);
router.post("/",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, newsController.create);
router.post("/create-url", newsController.createUrl);
router.get("/get-by-id/:id", newsController.getById);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, newsController.update);
router.delete("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, newsController.delete);
router.get("/restore/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, newsController.restore);

module.exports = router;
