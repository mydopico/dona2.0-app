const mongoose = require("mongoose");
const Comment = require("./comments");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	url: String,
	filename: String	
})

ImageSchema.virtual("thumbnail").get(function(){
	return this.url.replace("/upload", "/upload/w_200")
})

const dogSchema = new Schema({
	title: String,
	text: String,
	createdAt: { type: Date, default: Date.now },
	distance: Number,
	time: Number,
	ascent: Number,
	descent: Number,
	difficulty: String,
	layout: String,
	image:  [ ImageSchema ],
	geometry:
	   {
		type: {
			type: String,
			enum: ["Point"],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
    },
	geometryEnd:
	   {
		type: {
			type: String,
			enum: ["Point"],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
    },
	location: String,	
	end: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
})

dogSchema.post("findOneAndDelete", async function (doc) {
			   if(doc){
				   await Comment.deleteMany({
					   _id: {
						   $in: doc.comments
					   }
				   })
			   }
})

const Dog = mongoose.model("Dog", dogSchema);
module.exports = Dog;