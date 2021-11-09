const Dog = require("../models/dogs");
const Comment = require("../models/comments");

module.exports.createComment = async(req, res) => {
	const walk = await Dog.findById(req.params.id);
	const comment = new Comment(req.body.comment);
	comment.author = req.user._id;
	walk.comments.push(comment);
	await comment.save();
	await walk.save();
	req.flash("success", "Successfully added new comment");
	res.redirect(`/walks/${walk._id}`)
}

module.exports.deleteComment = async(req, res) => {
	const {id, commentId} = req.params;
	await Dog.findByIdAndUpdate(id, {$pull: {comments: commentId}});
	await Comment.findByIdAndDelete(commentId);
	req.flash("success", "Successfully deleted comment");
	res.redirect(`/walks/${id}`);
}