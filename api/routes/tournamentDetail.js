const express                        = require ('express');
const router                         = express.Router();
const TournamentDetailsController    = require('../controllers/tournamentDetailController');
const { validate }                   = require('../middlewares/validators');
const checkAuthentication            = require('../middlewares/jwt_token');

router.get('/get-all', TournamentDetailsController.getAll);
router.get('/get-sortColumn',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentDetailsController.sort);
router.get('/get-all-belongsto-namestournament',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, TournamentDetailsController.getAllBelongsTo);
router.get('/get-all-content-data', checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentDetailsController.getAllContentData);
router.get('/get-all-prepared-data', checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentDetailsController.getAllPreparedData);
router.post('/get-all-paging', checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentDetailsController.getAllByPaging);
router.get('/get-by-id', TournamentDetailsController.getbyId);
router.post('/',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentDetailsController.create);
router.post('/with-content',checkAuthentication.checkAccessToken,TournamentDetailsController.createwithcontent);
router.put('/:id', checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentDetailsController.update);
router.put('/register-permission/:id', checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentDetailsController.registerPermission);
router.delete('/:id', checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,TournamentDetailsController.delete);
router.get('/restore/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, TournamentDetailsController.restore);
router.get('/lock-content/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, TournamentDetailsController.lock);;
router.get('/unlock-content/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin, TournamentDetailsController.unlock);

module.exports= router;