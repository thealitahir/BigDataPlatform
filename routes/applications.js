var express = require('express');
var router = express.Router();

var Utility = require('../lib/utility');

var ApplicationModel = require('../models/applicationModel');
var PipelineModel = require('../models/pipelineModel');
var DashboardModel = require('../models/dashboardModel');
var StageModel = require('../models/stageModel');

///////////////////// applications /////////////////////////////////////

router.get('/', function (req,res) {

   ApplicationModel.find({}, function (err, applications) {

       if(err){
           res.json({status : false, msg :'Something went wrong while finding applications.'});
       }
       else if(applications.length > 0){
           res.json({status : true, msg :'Applications found.', data : applications});
       }
       else{
           res.json({status : false, msg :'No application found.'});
       }
   });

});
router.post('/', function (req, res) {

    ApplicationModel.create({}, function (err, app) {

        if(!err) {
            res.send({status: true, msg: 'application created successfully.', data: app});
        }
        else {
            res.send({status: false, msg: 'application not created.'});
        }

    });

});
router.put('/:applicationId', function (req, res) {

    var application={
        name:req.body.application.name,
        user_id:'123'

    }
    ApplicationModel.update({_id:req.body.application.id},application, function (err, app) {

        if(!err) {
            res.send({status: true, msg: 'application updated successfully.', data: app});
        }
        else {
            res.send({status: false, msg: 'application not created.'});
        }

    });

});
router.get('/getApplicationsWithDetail', function (req, res) {

    ApplicationModel.find(function (err, applications) {
        if (!err) {



            var applicationIds = [];
            for (var i = 0; i < applications.length; i++) {
                applicationIds.push(applications[i]._id.toString());
            }

            console.log(applicationIds);

            PipelineModel.aggregate([
                {$match: {application_id: { $in: applicationIds}}},
                {$group: {_id: "$application_id", result: { $addToSet: {name: "$name", _id: "$_id",application_id:"$application_id"} } }}
            ], function (err, pipelines) {
                console.log(pipelines);
                DashboardModel.aggregate([
                    {$match: {application_id: { $in: applicationIds}}},
                    {$group: {_id: "$application_id", result: { $addToSet: {name: "$name", _id: "$_id",application_id:"$application_id"} } }}
                ], function (err, dashboards) {

                    var applicationsWithDetails = [];
                    for (var i = 0; i < applications.length; i++) {
                        var app = {
                            name : applications[i].name,
                            id : applications[i]._id,
                            type : "application",
                            children : [
                                {
                                    name: 'Pipeline',
                                    id: applications[i]._id,
                                    type: "Pipelines",
                                    children: []
                                },
                                {
                                    name: 'Dashboard',
                                    id: applications[i]._id,
                                    type: "Dashboards",
                                    children: []
                                }
                            ]

                        };
                        //console.log(pipelines);
                        for (var j = 0; j < pipelines.length; j++) {
                            if(pipelines[j]._id == applications[i]._id){
                                for (var k = 0; k < pipelines[j].result.length; k++) {
                                    app.children[0].children.push(
                                        { name : pipelines[j].result[k].name, id: pipelines[j].result[k]._id, type: "Pipeline",application_id:applications[i]._id }
                                    )
                                }
                            }
                        }
                        //console.log(dashboards.length);
                        for (j = 0; j < dashboards.length; j++) {
                            if(dashboards[j]._id == applications[i]._id){

                                for (k = 0; k < dashboards[j].result.length; k++) {
                                    app.children[1].children.push(
                                        { name : dashboards[j].result[k].name, id: dashboards[j].result[k]._id, type: "Dashboard",application_id:applications[i]._id }
                                    )
                                }
                            }
                        }

                        applicationsWithDetails.push(app);

                    }
                    res.send({status : true, msg: "Applications found..",data : applicationsWithDetails});
                })
            })
        }
        else {
            res.send({status: false, msg: 'Error while finding application.'});
        }
    });
});


///////////////////// pipelines /////////////////////////////////////
router.get('/:applicationId/pipelines/:pipelineId', function (req,res) {

    var params = req.params;
    var query = {
        _id : params.pipelineId
    };
    console.log(query);
    PipelineModel.findOne(query, function (err, pipeline) {

        if(err){
            res.json({status : false, msg :'Something went wrong while finding pipelines.'});
        }
        else if(pipeline){
            console.log(pipeline);
            StageModel.find({pipeline_id : pipeline.id}, function (err, stages) {

                if(err){
                    res.json({status : false, msg :'Something went wrong while finding stages of this pipeline.'});
                }
                else{
                    pipeline = pipeline.toObject();
                    pipeline.stages = stages;
                    res.json({status : true, msg :'Stages found for this pipeline.', data : pipeline});
                }
            });
        }
        else{
            res.json({status : false, msg :'No pipeline found.'});
        }
    });

});
router.post('/:applicationId/pipelines', function (req, res) {
    PipelineModel.create(Utility.getDefaultPipeline("123",req.params.applicationId,req.body.pipeline.name), function (err,pipeline) {
        if(!err){
          res.send({status:true,msg:'Pipeline saved successfully.',data:pipeline});
        }
        else{
            res.send({status:false,msg:'Pipeline not saved.'});
        }

    })


});


///////////////////// stages ////////////////////////////////////////

router.get('/:applicationId/pipelines/:pipelineId/stages/:stageId', function (req, res) {

    var params = req.params;
    var query = {
        _id : params.stageId
    };
    console.log(query);
    StageModel.findOne(query, function (err, stage) {

        if(err){
            res.json({status : false, msg :'Something went wrong while finding stages.'});
        }
        else if(stage){
            res.json({status : true, msg :'Stage found.', data : stage});
        }
        else{
            res.json({status : false, msg :'No stage found.'});
        }
    });
    
});
router.put('/:applicationId/pipelines/:pipelineId/stages/:stageId', function (req, res) {

    var params = req.params;
    var body = req.body;
    var query = {
        _id : params.stageId
    };
    console.log(query);
    console.log(body.stage);
    StageModel.update(query,body.stage,function (err, numberAffected) {

        if(err){
            res.json({status : false, msg :'Something went wrong while updating stage.'});
        }
        else{
            console.log(numberAffected + "number of record(s) updated.");
            res.json({status : true, msg :'Stage updated successfully.'});
        }
    });

});
router.post('/:applicationId/pipelines/:pipelineId/stages', function (req, res) {

    var body = req.body;
    StageModel.create(Utility.getDefaultStage(body.stage), function (err,stage) {

        if(!err){
            res.send({status:true,msg:'Stage saved successfully.',data:stage});
        }
        else{
            res.send({status:false,msg:'Stage not saved.'});
        }

    });
});

router.post('/addLink/:srcId/:targetId', function (req, res) {

    var srcId = req.params.srcId;
    var targetId = req.params.targetId;

    StageModel.findOne({'_id':srcId}, function (err,doc) {
        if(!err){
            if(doc){
                doc.out.push(targetId);
                doc.save(function(err){
                    if(!err){
                        //res.send({status:true,msg:'Stages Updated.',data:doc});
                        StageModel.findOne({'_id':targetId}, function (err,doc) {
                            if(!err){
                                if(doc){
                                    doc.in.push(srcId);
                                    doc.save(function(err){
                                        if(!err){
                                            res.send({status:true,msg:'Stages Updated.',data:doc});

                                        }
                                        else{
                                            res.send({status:false,msg:'Error while finding stages.'});
                                        }
                                    });
                                }
                                else{
                                    res.send({status:false,msg:'Error while finding stages.'});
                                }

                            }
                            else{
                                res.send({status:false,msg:'Error while finding stages.'});
                            }
                        });
                    }
                    else{
                        // res.send({status:false,msg:'Error while finding stages.'});
                    }
                });
            }
            else{
                res.send({status:false,msg:'Error while finding stages.'});
            }

        }
        else{
            res.send({status:false,msg:'Error while finding stages.'});
        }
    });
});
router.post('/removeLink/:srcId/:targetId', function (req, res) {

    var srcId = req.params.srcId;
    var targetId = req.params.targetId;
    console.log("here");
    console.log(srcId);
    console.log(targetId);
    StageModel.findOne({'_id':srcId}, function (err,doc) {
        if(!err){
            if(doc){
                var index=-1;
                index=doc.out.indexOf(targetId);
                if(index>-1){doc.out.splice(index,1);}
                console.log("1st");
                console.log(doc);
                doc.save(function(err){
                    if(!err){
                        //res.send({status:true,msg:'Stages Updated.',data:doc});
                        StageModel.findOne({'_id':targetId}, function (err,doc) {
                            if(!err){
                                if(doc){
                                    index=-1;
                                    index=doc.in.indexOf(srcId);
                                    if(index>-1){doc.in.splice(index,1);}
                                    console.log("2nd");
                                    console.log(doc);
                                    doc.save(function(err){
                                        if(!err){
                                            res.send({status:true,msg:'Stages Updated.',data:doc});

                                        }
                                        else{
                                            res.send({status:false,msg:'Error while finding stages.'});
                                        }
                                    });
                                }
                                else{
                                    res.send({status:false,msg:'Error while finding stages.'});
                                }

                            }
                            else{
                                res.send({status:false,msg:'Error while finding stages.'});
                            }
                        });
                    }
                    else{
                        // res.send({status:false,msg:'Error while finding stages.'});
                    }
                });
            }
            else{
                res.send({status:false,msg:'Error while finding stages.'});
            }

        }
        else{
            res.send({status:false,msg:'Error while finding stages.'});
        }
    });
});


///////////////////// dashboards /////////////////////////////////////

router.get('/:applicationId/dashboards/:dashboardId', function (req,res) {

    res.json({name:'dashbaord', _id:req.params.dashboardId});
});
router.post('/:applicationId/dashboards', function (req,res) {
    DashboardModel.create(Utility.getDefaultDashboard('123',req.params.applicationId,req.body.dashboard.name), function (err,dashboard) {

        if(!err){
            res.json({status: true, msg : "Record Saved Successfully Found" , data: dashboard});}
        else{
            res.json({status: false, msg : "Error Occurred While Saving Record"});
        }

    });

});


module.exports = router;