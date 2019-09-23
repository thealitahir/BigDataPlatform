var mongoose =  require('mongoose'),
    Schema = mongoose.Schema;

var stagesSchema = mongoose.Schema({

    name : String,

    application_id : String,
    pipeline_id : String,

    stage_type : String,
    sub_type : String,
    stage_attributes: Schema.Types.Mixed,
    original_schema: Schema.Types.Mixed,
    selected_schema: Schema.Types.Mixed,
    in: [String],
    out: [String],
    icon:String,
    status:String,
    position:Schema.Types.Mixed
});

module.exports = mongoose.model('stages',stagesSchema);