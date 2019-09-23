angular.module('webApp.controllers')
    .controller('hdfsSinkCtrl',['$scope','stage','stageService', function ($scope,stage,stageService) {

        console.log(stage);
        $scope.hdfsSink = stage;
        $scope.update = function () {

            stageService.update($scope.hdfsSink).success(function (res) {

                console.log(res);
            });
        }
    }])
    .controller('s3SinkCtrl',['$scope','stage','stageService', function ($scope,stage,stageService) {

        console.log(stage);
        $scope.s3Sink = stage;
        $scope.update = function () {

            stageService.update($scope.s3Sink).success(function (res) {

                console.log(res);
            });
        }


    }])
    .controller('hbaseSinkCtrl',['$scope','stage','stageService', function ($scope,stage,stageService) {

        console.log(stage);
        $scope.hbaseSink = stage;
        $scope.update = function () {

            if($scope.hbaseSink.stage_attributes.isFlat == false){

                $scope.hbaseSink.stage_attributes.granularity = '';
            }
            stageService.update($scope.hbaseSink).success(function (res) {

                console.log(res);
            });
        }

    }]);
