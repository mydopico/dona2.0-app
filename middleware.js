const { walkSchema, commentSchema } = require('./schemas.js');
const ExpressError = require("./utils/ExpressError");
const Dog = require("./models/dogs");
const Comment = require("./models/comments");


module.exports.isLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()){
		req.session.returnTo = req.originalUrl
		req.flash("error", "Debes iniciar sesión");
		return res.redirect("/login");
	}
	next();
}


module.exports.validateWalk = (req, res, next) => {	
	const {error} = walkSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}	
}

module.exports.isAuthor = async(req, res, next) => {
	 const { id } = req.params;
	 const walk = await Dog.findById(id);
	if(!walk.author.equals(req.user._id)){
		req.flash("error", "No tienes permiso");
		return res.redirect(`/walks/${id}`)		
	}
	next();
}

module.exports.isCommentAuthor = async(req, res, next) => {	
	 const { id, commentId } = req.params;
	 const comment = await Comment.findById(commentId);
	if(!comment.author.equals(req.user._id)){
		req.flash("error", "No tienes permiso");
		return res.redirect(`/walks/${id}`)		
	}
	next();
}


module.exports.validateComment = (req, res, next) => {
	const {error} = commentSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next()
	}
}