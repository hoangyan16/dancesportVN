const express                      = require ('express');;
const router                       = express.Router();
const feeDetailController           = require('../controllers/feeDetailController');
const { validate }                 = require('../middlewares/validators');
const checkAuthentication          = require('../middlewares/jwt_token');

// QUẢN LÝ RESOURCES CHUNG
router.get('/get-all',feeDetailController.getAll);
// router.get('/get-all-into-tour',feeDetailController.getAllResourcesIntoTour);
// router.get('/get-by-id/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,feeDetailController.getbyId);
// router.put('/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,feeDetailController.update);
// router.post('/upload-files-in-tournaments',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,feeDetailController.uploadFiles);
router.post('/create',feeDetailController.create);
// router.delete('/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,feeDetailController.delete);

module.exports= router;