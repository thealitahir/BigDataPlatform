angular.module('webApp.services').factory('applicationService',['$http',function ($http) {

    return {

        get: function (applicationId) {
            var url = '/applications';
            if(typeof applicationId != 'undefined')
                url += '/' + applicationId;
            return $http.get(url);
        },
        getApplicationsWithDetail : function () {
            var url = '/applications/getApplicationsWithDetail';
            return $http.get(url);
        },
        create: function(application){
            var url = '/applications/';

            return $http.post(url,{application:application});
        },
        update: function(application){
            var url = '/applications/:applicationId';
           return $http.put(url,{application:application});
        }
    }
}]);
