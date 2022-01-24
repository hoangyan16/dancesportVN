const express                               = require("express");
const router                                = express.Router();
const mcController                          = require("../controllers/mcController");
const { validate }                          = require("../middlewares/validators");
const checkAuthentication                   = require('../middlewares/jwt_token');

router.put("/get-all-event-in-tournament/:tournament_id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,mcController.getAll);
router.get("/tv",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,mcController.getTV);
router.put("/get-next-event-in-tournament",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,mcController.getNextEvent);
router.post("/get-all-event-paging",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,mcController.getAllByPaging);
router.post("/",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,mcController.create);
router.get("/get-by-id/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,mcController.getById);
router.put("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, mcController.update);
router.delete("/:id",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,mcController.delete);
module.exports = router;
