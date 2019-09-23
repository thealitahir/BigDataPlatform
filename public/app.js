'use strict';

var webApp = angular.module('webApp',[
    'ui.router',
    'webApp.controllers',
    'webApp.services',
    'webApp.directives',
    'webApp.filters',
    'angularTreeview'
])
    .run(
    [          '$rootScope', '$state', '$stateParams',
        function ($rootScope,   $state,   $stateParams) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider,   $urlRouterProvider) {

            $stateProvider
                .state("home",{

                    url : "/",
                    template : "Home Template"

                })
                .state("applications",{
                    url : "/applications",
                    templateUrl : "/partials/application/applicationDesigner.html",
                    resolve : {
                        applications : ['applicationService', function (applicationService) {
                            return applicationService.getApplicationsWithDetail().then(function (res) {
                                return res.data.data;
                            });
                        }]
                    },
                    controller : 'applicationCtrl'
                })
                .state("applications.add",{
                    url : "/add",
                    templateUrl : "/partials/application/applicationAdd.html",
                    controller : 'applicationCtrl'
                })
                .state('applications.pipelineDetail',{
                    url : '/:applicationId/pipelines/:pipelineId',
                    templateUrl : '/partials/pipeline/pipelineDesigner.html',
                    resolve : {
                        pipeline :['pipelineService','$stateParams',function (pipelineService,$stateParams) {
                            return pipelineService.get($stateParams.applicationId,$stateParams.pipelineId).then(function (res) {
                                console.log(res);
                                return res.data.data;
                            });
                        }]
                    },
                    controller : 'pipelineCtrl'
                })
                .state('applications.pipelineDetail.stageDetail',{
                    url : '/:stageType/:subType/:stageId',
                    views : {
                        "properties" : {
                            resolve :{
                                stage :['$stateParams','stageService',function ($stateParams, stageService) {
                                    return stageService.get($stateParams.applicationId, $stateParams.pipelineId,$stateParams.stageId).then(function (res) {
                                        return res.data.data;
                                    })
                                }]
                            },
                            templateUrl : function ($stateParams) {
                                var templateUrl = "/partials/" + $stateParams.stageType + '/' + $stateParams.subType + '.html';
                                console.log(templateUrl);
                                return templateUrl;
                            },
                            controllerProvider : ['$stateParams','utilityService',function ($stateParams,utilityService) {
                                var controllerName = $stateParams.subType + utilityService.capitalize($stateParams.stageType) + 'Ctrl';
                                console.log(controllerName);
                                return controllerName;
                            }]
                        }
                    }
                })
                .state('applications.dashboardDetail',{
                    url : '/:applicationId/dashboards/:dashboardId',
                    templateUrl : '/partials/dashboard/dashboardDesigner.html',
                    resolve : {
                        dashboard :['dashboardService','$stateParams',function (dashboardService,$stateParams) {
                            return dashboardService.get($stateParams.applicationId,$stateParams.dashboardId).then(function (res) {
                                console.log(res);
                                return res.data.data;
                            });
                        }]
                    },
                    controller : 'dashboardCtrl'
                })
                


        }]);

angular.module('webApp.controllers',['ui.router']);
angular.module('webApp.services',[]);
angular.module('webApp.directives',[]);
angular.module('webApp.filters',[]);
