angular.module('webApp.controllers')
    .controller('applicationCtrl',['$scope','applications','applicationService','$state','$stateParams','pipelineService','dashboardService', function ($scope,applications,applicationService,$state,$stateParams,pipelineService,dashboardService) {
        $scope.applicationsWithDetails = applications;
        $scope.addApplication=function(){
            $state.go('applications.add');
            $scope.treedataObject=
            { "name" : '', "id" : '',type:'application', "children" : [

                { "label" : "Pipeline", "id" : '',show:false,application_id:'',type:'Pipelines', "children" : [] },
                { "label" : "Dashboard", "id" : '',show:false,application_id:'',type:'Dashboards', "children" : []}

            ]
            };
            applicationService.create($scope.treedataObject).success(function(res){
                $scope.treedataObject.id=res.data._id;
                $scope.treedataObject.children[0].application_id=res.data._id;
                $scope.treedataObject.children[1].application_id=res.data._id;

            });

        };
        $scope.saveApplication=function(){
            $scope.applicationsWithDetails.push($scope.treedataObject);
            applicationService.update($scope.treedataObject).success(function (req, res) {});

        };


        $scope.newSubItem=function(data,index) {


            if (data.name == 'Dashboard') {

                data.show=true;

                $scope.dashboard = {

                    name: 'New Dashboard',
                    id: '',
                    type:'Dashboard',
                    application_id:data.id,
                    show:false
                }


                data.children.push($scope.dashboard);

            }
            if (data.name == 'Pipeline') {

                data.show=true;
                $scope.pipeline = {

                    name: 'New Pipeline',
                    id: '',
                    type:'Pipeline',
                    application_id:data.id,
                    show:false


                }

                data.children.push($scope.pipeline);

            }

        };
        $scope.savePipeline= function(data,name) {

            if (name !== null) {
                data.show = false;
                $scope.pipeline.name = name;
                pipelineService.create($scope.pipeline).success(function (res) {
                    $scope.pipeline.id = res.data._id;
                    $state.go('applications.pipelineDetail', {applicationId: res.data.application_id, pipelineId: res.data._id})

                });
            }
        };

        $scope.saveDashboard= function(data,name){
            if(name!==null) {
                data.show=false;
                $scope.dashboard.name = name;
                    dashboardService.create($scope.dashboard).success(function (res) {

                    $scope.dashboard.id=res.data._id;
                    $state.go('applications.dashboardDetail',{applicationId:res.data.application_id,dashboardId:res.data._id})

                });
            }
        };
        $scope.openPipeline= function(applicationId, pipelineId){
            $state.go('applications.pipelineDetail',{applicationId:applicationId,pipelineId:pipelineId})
        }



    }]);
