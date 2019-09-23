angular.module('webApp.controllers')
    .controller('dashboardCtrl',['$scope','dashboard',function ($scope,dashboard) {
        $scope.dashboard = dashboard;

    }]);