const mongoose = require("mongoose");
const Dog = require("../models/dogs");

mongoose.connect('mongodb://localhost:27017/dogApp',  {        
	useNewUrlParser: true,									
	useUnifiedTopology: true });	
	
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const seedDB = async () => {
	await Dog.deleteMany({});
	const dog1 = new Dog({
		// YOUR USER ID
		author: "6144942f1d2cd04901225f26",
		title: "Lovely Dona",
		text: "the best dog ever",
		location: "Vigo, España",
		geometry: {
                type: "Point",
                coordinates: [-8.718616, 42.237176]
            },
		image: [
    {
      url: 'https://res.cloudinary.com/yolupa/image/upload/v1632241849/dogApp/upalfzsz0qecjbljusgq.jpg',
      filename: 'dogApp/upalfzsz0qecjbljusgq'
    },
    {
      url: 'https://res.cloudinary.com/yolupa/image/upload/v1632241851/dogApp/dmce6ntnyjkk6jf9qrcp.jpg',
      filename: 'dogApp/dmce6ntnyjkk6jf9qrcp'
    }
  ]
	})	
	await dog1.save();
}

seedDB().then(() => {
	//mongoose.connection.close();
	mongoose.disconnect();
})


