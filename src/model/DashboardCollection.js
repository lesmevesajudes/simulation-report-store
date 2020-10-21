const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
	id_simulacio: String,
	data: Date,
	persones: Object,
	habitatge: Object,
	estatus: Number
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema,'dashboard');

export default Dashboard;