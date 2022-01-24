const express                      = require ('express');
const router                       = express.Router();
const { validate }                 = require('../middlewares/validators');
const AthleteController            = require("../controllers/athleteController");
const checkAuthentication          = require('../middlewares/jwt_token');


router.post("/export-excel-files",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, AthleteController.exportAthletesExcelFiles);
router.post("/send-email-for-athletes",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, AthleteController.sendMail);
router.get('/get-all',checkAuthentication.checkAccessToken,AthleteController.getAll)
router.get('/get-all-not-active',checkAuthentication.checkAccessToken,AthleteController.getAllNotActive);
router.get('/get-all-paging',checkAuthentication.checkAccessToken,AthleteController.getAllByPaging);
router.get('/get-by-id/:id',checkAuthentication.checkAccessToken,AthleteController.getbyId);
router.get('/get-athletes-by-tournament-id',checkAuthentication.checkAccessToken,AthleteController.getbyTournamnetId);
router.get('/get-athletes-not-active-by-tournament-id',checkAuthentication.checkAccessToken,AthleteController.getbyTournamnetIdNoActive);
// router.post('/',checkAuthentication.checkAccessToken,AthleteController.create);
router.put('/active/all',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,AthleteController.activeAllAthletes);
router.put('/delete/all-not-active',checkAuthentication.checkAccessToken,AthleteController.deleteNotActiveAthletes);
router.put('/delete/all',checkAuthentication.checkAccessToken,AthleteController.deleteAllAthletes);
router.put('/active/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,AthleteController.activeAthletes);
router.put("/decide/athletes-numbers",checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,AthleteController.decideAthletesNumbers);
router.delete('/:id',checkAuthentication.checkAccessToken,AthleteController.delete);
router.put('/check-is_pay/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,AthleteController.CheckIsPay);
router.put('/:id',checkAuthentication.checkAccessToken,AthleteController.update);


module.exports= router;