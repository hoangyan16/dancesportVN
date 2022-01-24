const express                                         = require ('express');
const router                                          = express.Router();
const contentCompetitionController                    = require('../controllers/contentCompetitionController');
const { validate }                                    = require('../middlewares/validators');
const checkAuthentication                             = require('../middlewares/jwt_token');

router.get('/get-all',checkAuthentication.checkAccessToken,contentCompetitionController.getAll);
router.get('/get-sortColumn',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contentCompetitionController.sort);
router.get('/get-all-by-tournament',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contentCompetitionController.getAllByTournaments);
router.get('/get-all-prepared-data',checkAuthentication.checkAccessToken,contentCompetitionController.getAllPreparedData);
router.post('/get-all-paging',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contentCompetitionController.getAllByPaging);
router.get('/get-by-id/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contentCompetitionController.getbyId);
router.post('/',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,validate.validateContentCompetition(),contentCompetitionController.create);
router.put('/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,validate.validateContentCompetition(),contentCompetitionController.update);
router.put('/update-from-tournament-detail/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,validate.validateContentCompetition(),contentCompetitionController.updateFromTour);
router.delete('/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contentCompetitionController.delete);
router.get('/restore/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contentCompetitionController.restore);
router.get('/lock/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contentCompetitionController.lock);
router.get('/unlock/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,contentCompetitionController.unlock);

module.exports= router;