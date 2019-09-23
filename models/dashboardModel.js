var mongoose =  require('mongoose'),
    Schema = mongoose.Schema;

var applicationSchema = mongoose.Schema({
    name: String,
    user_id: String,
    application_id: String
});

module.exports = mongoose.model('Dashboards',applicationSchema);