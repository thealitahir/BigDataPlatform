
module.exports = {

    getDefaultStage : function(stageDetail){

        var stage = {
            name : '',

            application_id : stageDetail.applicationId,
            pipeline_id : stageDetail.pipelineId,

            stage_type : stageDetail.stageType,
            sub_type:stageDetail.subType,
            stage_attributes : {},
            in : [],
            out :[],
            selectedSchema : [],
            originalSchema : [],
            position:stageDetail.position,
            icon:'',
            status:'waiting'
        };
        if(stageDetail.stageType=='source'){

            if(stageDetail.subType == 'file') {
                stage.icon='glyphicons-file';
                stage.stage_attributes = {splitter: [], skipHeader: 'false', file: {name: '', path: '', extension: ''}, uploadSchema: 'false', schemaFile: {name: '', path: '', extension: ''}};
            }
            else if(stageDetail.subType == "hdfs"){
                stage.icon='glyphicons-folder-open';
                stage.stage_attributes = {host:'', port:'', path:''};
            }
            else if(stageDetail.subType == "s3"){
                stage.icon='glyphicon-folder-open';
                stage.stage_attributes = {accessKey: '', secretKey: '', bucket: '',files:[]};
            }
        }
        if(stageDetail.stageType=='sink'){

            if(stageDetail.subType == "hdfs"){
                stage.icon='glyphicon-folder-open';
                stage.stage_attributes = {host:'', port:'', path:''};
            }
            else if(stageDetail.subType == "s3"){
                stage.icon='social amazon';
                stage.stage_attributes = {accessKey: '', secretKey: '', bucket: '',files:[]};
            }
            else if (stageDetail.subType == 'hbase') {
                stage.icon='glyphicon-header';
                stage.stage_attributes = {zooKeeperQourum: '', zooKeeperPort: '', tableName: '', columnFamily: '',rowKey : [],isFlat : 'false',granularity : '',dateTimeFormat : ''};
            }
        }
        if(stageDetail.stageType=='transformation'){
            stage.icon = 'vector_path_polygon';
            stage.stage_attributes = {attributes:[],stage_id:''};
        }
        if(stageDetail.stageType=='analytics'){
            stage.icon = 'glyphicons roundabout';
            stage.stage_attributes = {
                showSelectedModel: '',
                showModel: false,
                showOptions:'false',
                datasourceAttributes: [],
                algorithm: [],
                selectedCategory: '',
                selectedAlgorithm: '' ,
                attributes: [],
                options: []
            };
        }
        return stage;
    },
     getDefaultPipeline: function(user_id,applicationId, pipelineName){

    var workflow = {
        name :pipelineName,
        status:'',
        user_id : user_id,
        application_id:applicationId

    };

    return workflow;
},
     getDefaultDashboard: function(user_id,application_id,dashboardName){

    return {
        user_id : user_id,
        application_id : application_id,
        name : dashboardName
    };
}

};
