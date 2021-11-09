const Dog = require("../models/dogs");
const Comment = require("../models/comments");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {	
	    const walks = await Dog.find({});
	   // console.log(walks);
	    res.render("dogs/index", {walks})
}

module.exports.renderNewForm = (req, res) => {		
	res.render("dogs/new")
}

module.exports.createWalk = async (req, res, next) => {	
	const geoData = await geocoder.forwardGeocode({
		query: req.body.walk.location,				
		limit: 1
	}).send()	
	//res.send("OK!");
	const geoData1 = await geocoder.forwardGeocode({		
		query: req.body.walk.end,		
		limit: 1
	}).send()
		
		const walk = new Dog(req.body.walk);
	    //console.log(req.body.walk)
	    walk.geometry = geoData.body.features[0].geometry;
	    walk.geometryEnd = geoData1.body.features[0].geometry;
	    // console.log(walk.geometry.coordinates);
	    // console.log(walk.geometryEnd.coordinates);
	    walk.image =  req.files.map(f => ({ url: f.path, filename: f.filename }));	 
	    // console.log(walk.image);
		walk.author = req.user._id;
		await walk.save();
		//console.log(walk);
		req.flash("success", "Succesfully added a new walk");
		res.redirect(`/walks/${walk._id}`)		
}

module.exports.showWalk = async (req, res) => {	
	const walks = await Dog.find({});
	const walk = await Dog.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate("author");	
	if(!walk){
		req.flash("error", "Cannot find that walk");
		return res.redirect("/walks");
	}
	res.render("dogs/show", {walk, walks})
}

module.exports.renderEditForm = async (req, res, next) => {
	    const walk = await Dog.findById(req.params.id);
		res.render("dogs/edit", {walk})
}

module.exports.editWalk = async (req, res) => {
    const { id } = req.params;
	const geoData = await geocoder.forwardGeocode({
		query: req.body.walk.location,				
		limit: 1
	}).send()	
	
	const geoData1 = await geocoder.forwardGeocode({		
		query: req.body.walk.end,		
		limit: 1
	}).send()
		
    // console.log(req.body);
    const editWalk = await Dog.findByIdAndUpdate(id, { ...req.body.walk });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));	
    editWalk.image.push(...imgs);
	editWalk.geometry = geoData.body.features[0].geometry;
	editWalk.geometryEnd = geoData1.body.features[0].geometry;
    await editWalk.save();	
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await editWalk.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Editada la ruta');
    res.redirect(`/walks/${editWalk._id}`)
}


module.exports.deleteWalk = async(req, res) =>{
	await Dog.findByIdAndDelete(req.params.id);
	req.flash("success", "Successfully deleted");
	res.redirect("/walks")
}



