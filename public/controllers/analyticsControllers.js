/**
 * Created by asma on 18-Dec-14.
 */
angular.module('webApp.controllers')
    .controller('testingAnalyticsCtrl',['$scope','stage', function ($scope,stage) {

        console.log(stage);
        $scope.testingSource = stage;
        $scope.algorithm_categories_list = ['General','Recommendation','Clustering','Math','Classification','Collaborative Filtering','Frequent Pattern Mining'];
        $scope.fields = ['UserID','MovieID','Ratings','Timestamp'];

    }]);