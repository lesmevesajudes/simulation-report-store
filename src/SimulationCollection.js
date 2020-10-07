const mongoose = require('mongoose');
const dbUrl = 'mongodb://jamgo:jamgo@localhost:27017/les-meves-ajudes';
mongoose.connect(dbUrl, {useNewUrlParser: true}, error => {
	if (!error) {
		console.log('Connected');
	} else {
		console.log('Error connecting to db')
		console.log(error);
	}
});

const simulationSchema = new mongoose.Schema({
	id: String,
	simulation: Object,
	result: Object,
	created_at: Date,
	id_parent: String,
});

const Simulation = mongoose.model('Simulation', simulationSchema,'simulation');

export default Simulation;