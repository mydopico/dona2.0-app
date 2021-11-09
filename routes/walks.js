const express = require('express');
const router = express.Router();
const walks = require("../controllers/walks");
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor, validateWalk } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
//const upload = multer({dest: "uploads/"});locally
const upload = multer({ storage });
const Dog = require("../models/dogs");
const Comment = require("../models/comments");

router.route("/")
   .get(catchAsync(walks.index))
   .post(isLoggedIn, upload.array("image"), validateWalk, catchAsync(walks.createWalk));

	// .post(upload.array("image"), (req, res) => {
	// console.log(req.body, req.files);
	// res.send("it worked") })
	



router.get("/new", isLoggedIn, walks.renderNewForm);

router.route("/:id")
   .get(catchAsync(walks.showWalk))
   .put(isLoggedIn, isAuthor, upload.array("image"), validateWalk, catchAsync(walks.editWalk))
   .delete( isLoggedIn, isAuthor, catchAsync(walks.deleteWalk))


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(walks.renderEditForm));




module.exports = router;