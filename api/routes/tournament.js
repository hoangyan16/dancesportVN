const express                            = require ('express');
const router                             = express.Router();
const TournamentController               = require('../controllers/tournamentController');
const { validate }                       = require('../middlewares/validators');
const checkAuthentication                = require('../middlewares/jwt_token');

router.get('/get-all',TournamentController.getAll);
router.get('/get-all-prepared-data',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentController.getAllPreparedData);
router.post('/get-all-paging',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentController.getAllByPaging);
router.get('/get-by-id/:id',TournamentController.getbyId);
router.post('/',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,validate.validateTournaments(),TournamentController.create);
router.put('/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,validate.validateTournaments(),TournamentController.update);
router.delete('/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentController.delete);
router.get('/restore/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentController.restore);
router.get('/lock-content/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentController.lock);
router.get('/unlock-content/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentController.unlock);

module.exports= router;