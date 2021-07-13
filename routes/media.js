const express = require('express');

const {
    mediaType,
    keywords,
    rating,
    topImages,
    topVideos

  } = require('../controllers/media');

const router = express.Router();

router.get('/mediaType/:type', mediaType);
router.post('/keywords', keywords);
router.post('/rating', rating);
router.get('/topImages', topImages);
router.get('/topVideos', topVideos);



module.exports = router;