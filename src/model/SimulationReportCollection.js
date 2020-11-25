const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
	id: String,
	application_state: Object, 
	simulation_id: String, 
	expected_result: String, 
	accepted_result: Boolean, 
	comments: String, 
	reporter_email: String, 
	test_group: String,
	created_at: Date,
});

const SimulationReport = mongoose.model('SimulationReport', simulationSchema,'simulation-reports');

export default SimulationReport;