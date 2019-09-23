var mongoose =  require('mongoose'),
    Schema = mongoose.Schema;

var applicationSchema = mongoose.Schema({
    name: String,
    status: String,
    user_id: String,
    application_id: String
});

module.exports = mongoose.model('Pipelines',applicationSchema);