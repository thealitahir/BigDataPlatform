angular.module('webApp.services').factory('dashboardService',['$http',function ($http) {

    return {

        get: function (applicationId,dashboardId) {
            var url = '/applications/' + applicationId + '/dashboards/' + dashboardId;
            return $http.get(url);
        },
        create :function(dashboard){

            var url = '/applications/'+dashboard.application_id+'/dashboards';
            return $http.post(url,{dashboard :dashboard});

        }
       

    }

}]);
