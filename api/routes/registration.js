const express                       = require ('express');
const router                        = express.Router();
const RegistrationController        = require('../controllers/registrationController');
const { validate }                  = require('../middlewares/validators');
const checkAuthentication           = require('../middlewares/jwt_token');

router.get('/get-all',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,RegistrationController.getAll);
router.post('/get-all-paging',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,RegistrationController.getAllByPaging);
router.get('/get-by-id/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,RegistrationController.getbyId);
router.post('/',checkAuthentication.checkAccessToken,validate.validateRegistration(),RegistrationController.create);
router.post('/free-registration',RegistrationController.freeRegistration);
router.put('/:id',checkAuthentication.checkAccessToken,validate.validateRegistration(),RegistrationController.update);
router.delete('/:id',checkAuthentication.checkAccessToken,RegistrationController.delete);
router.get('/restore/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,RegistrationController.restore);
router.get('/lock-content/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,RegistrationController.lock);
router.get('/unlock-content/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,RegistrationController.unlock);
module.exports= router;