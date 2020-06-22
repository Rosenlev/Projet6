const express = require('express');

const router = express.Router();


const auth = require('../middleware/auth');

const multer = require('../images/multer-config');

const saucesCtrl = require('../controllers/sauces');


router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.updateSauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeOrDislike);

module.exports = router;