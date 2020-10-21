const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
	id: String,
	simulation: Object,
	result: Object,
	created_at: Date,
	id_parent: String,
});

const Simulation = mongoose.model('Simulation', simulationSchema,'simulations');

export default Simulation;