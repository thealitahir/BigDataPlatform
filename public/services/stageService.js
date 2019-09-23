angular.module('webApp.services').factory('stageService',['$http', function ($http) {

    return {

        get : function (applicationId,pipelineId,stageId) {
            var url = "applications/" + applicationId + "/pipelines/" + pipelineId + "/stages/" + stageId;
            return $http.get(url);
        },
        create : function (stage) {
            var url = "applications/" + stage.applicationId + "/pipelines/" + stage.pipelineId + "/stages";
            return $http.post(url,{stage:stage});
        },
        update : function (stage) {
            var url = "applications/" + stage.application_id + "/pipelines/" + stage.pipeline_id + "/stages/"+stage._id;
            return $http.put(url,{stage:stage});
        },
        addLink: function (srcId,targetId) {
            var url = '/applications/addLink/'+srcId+'/'+targetId;
            return $http.post(url);
        },
        removeLink: function (srcId,targetId) {
            var url = '/applications/removeLink/'+srcId+'/'+targetId;
            return $http.post(url);
        }
    }

}]);
