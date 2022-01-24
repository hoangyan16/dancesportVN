const express                      = require ('express');;
const router                       = express.Router();
const ResourceController           = require('../controllers/resourceController');
const { validate }                 = require('../middlewares/validators');
const checkAuthentication          = require('../middlewares/jwt_token');

// QUẢN LÝ RESOURCES CHUNG
router.get('/get-all',ResourceController.getAll);
router.get('/get-all-into-tour',ResourceController.getAllResourcesIntoTour);
router.get('/get-by-id/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.getbyId);
router.put('/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.update);
router.post('/upload-files-in-tournaments',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.uploadFiles);
router.post('/',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.create);
router.delete('/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.delete);


// API QUẢN LÍ ẢNH DÙNG CHO BANNER,LOGO,ADs
router.get('/get-all-images',ResourceController.getAllImages);
router.post('/create-images',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.createImage);
router.post('/upload-images',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.uploadImage);
router.delete('/images/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.deleteImage);
router.get('/images/get-by-id/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.getbyIdImage);
router.put('/images/:id',checkAuthentication.checkAccessToken,checkAuthentication.checkAdmin,ResourceController.updateImage);

module.exports= router;