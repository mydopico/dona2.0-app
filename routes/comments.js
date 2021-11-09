const express = require('express');
const router = express.Router({ mergeParams: true });
const comments = require("../controllers/comments");
const { isLoggedIn, validateComment, isCommentAuthor } = require("../middleware");

const Dog = require("../models/dogs");
const Comment = require("../models/comments");

const catchAsync = require('../utils/catchAsync');



router.post("/", isLoggedIn, validateComment, catchAsync(comments.createComment));

router.delete("/:commentId", isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));



module.exports = router;

