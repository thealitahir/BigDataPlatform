angular.module('webApp.controllers')
    .controller('joinTransformationCtrl',['$scope','stage', function ($scope,stage) {

        console.log(stage);
        $scope.fileSource = stage;

    }])
    .controller('transformationTransformationCtrl',['$scope','stage', function ($scope,stage) {

        console.log("Stage");
            console.log(stage);
        $scope.transformationSource = stage;
        $scope.transformationSelected = function(){
            alert("Transformation "+$scope.transformationSource.stage_attributes.type+" selected");
        }

    }]);