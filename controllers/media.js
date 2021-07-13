const Media = require('../models/Media');
const Rating = require('../models/Rating');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get media type
// @route     GET /api/media/mediaType
// @access    Public
exports.mediaType = asyncHandler(async (req, res, next) => {

    console.log(req.params.type);
    let type = req.params.type;

    const typeResponse = await Media.find({
        mediaType: type
    });

    if (!typeResponse) {
        return next(
            new ErrorResponse(`Media not found with type: ${type}`, 404)
        );
    }

    //console.log(typeResponse);

    res.status(200).json({
        success: true,
        data: typeResponse
    });



});

// @desc      Get top images
// @route     GET /api/media/topImages
// @access    Public
exports.topImages = asyncHandler(async (req, res, next) => {



    const images = await Media.find({mediaType: "image", rating:{$exists: true}}).sort({ rating: -1 }).limit(10);

    if (!images) {
        return next(
            new ErrorResponse(`Media not found`, 404)
        );
    }

    console.log(images);

    res.status(200).json({
        success: true,
        data: images
    });



});


// @desc      Get top videos
// @route     GET /api/media/topVideos
// @access    Public
exports.topVideos = asyncHandler(async (req, res, next) => {

    const videos = await Media.find({mediaType: "video", rating:{$exists: true}}).sort({ rating: -1 }).limit(10);

    if (!videos) {
        return next(
            new ErrorResponse(`Media not found`, 404)
        );
    }

    console.log(videos);

    res.status(200).json({
        success: true,
        data: videos
    });



});



// @desc      Search for keywords
// @route     POST /api/media/keywords
// @access    Public
exports.keywords = asyncHandler(async (req, res, next) => {


    console.log(req.body.keyword);

    let keyword = req.body.keyword;
    const regex = new RegExp(keyword, 'i') // i for case insensitive

    //find all entries in DB with specific keyword and sort the result with the highest rating first

    const keywordResponse = await Media.find({
        $or: [{
            source: {
                $regex: regex
            }
        }, {
            title: {
                $regex: regex
            }
        }]
    }).sort({rating: -1});

    console.log(keywordResponse);

    if (!keywordResponse) {
        return next(
            new ErrorResponse(`DB error with keyword: ${keyword}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: keywordResponse
    });


});

// @desc      Submit rating for image or video
// @route     POST /api/media/rating
// @access    Public
exports.rating = asyncHandler(async (req, res, next) => {

    console.log(req.body);

    let ratingNew = parseInt(req.body.rating, 10);
    console.log(ratingNew);
    let id = req.body.media_id;

    //put new rating in database

    let result = await Rating.create({
        userId: id,
        rating: ratingNew
    });

    //console.log(result);

    const ratingResponse = await Rating.find({
        userId: id
    });

    console.log(ratingResponse);


    let ratingsArr = ratingResponse.map(function (item) {
        return item.rating;
    });
    console.log(ratingsArr);
    let ratingsAmount = ratingsArr.length;
    // sum up all ratings
    const reducer = (accumulator, curr) => accumulator + curr;
    console.log(ratingsArr.reduce(reducer));
    let ratingsSum = ratingsArr.reduce(reducer);

    let rating = ratingsSum / ratingsAmount;

    await Media.findOneAndUpdate({
        _id: id
    }, {
        rating: rating,
        ratingAmount: ratingsAmount
    }, {
        new: true,
        runValidators: true
    });


    res.status(201).json({
        success: true
    });


});