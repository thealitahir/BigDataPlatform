angular.module('webApp.services').factory('pipelineService',['$http',function ($http) {

    return {

        get : function (applicationId,pipelineId) {
            var url = '/applications/' + applicationId + '/pipelines/' + pipelineId;
            return $http.get(url);
        },
        create:function(pipeline){
            var url = '/applications/' + pipeline.application_id + '/pipelines' ;
            return $http.post(url,{pipeline:pipeline});
        }

    }

}]);
