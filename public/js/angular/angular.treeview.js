/*
 @license Angular Treeview version 0.1.6
 ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
 License: MIT


 [TREE attribute]
 angular-treeview: the treeview directive
 tree-id : each tree's unique id.
 tree-model : the tree model on $scope.
 node-id : each node's id
 node-label : each node's label
 node-children: each node's children

 <div
 data-angular-treeview="true"
 data-tree-id="tree"
 data-tree-model="roleList"
 data-node-id="roleId"
 data-node-label="roleName"
 data-node-children="children" >
 </div>
 */

(function ( angular ) {
    'use strict';

    angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile','applicationService', function( $compile ,applicationService) {
        return {
            restrict: 'A',
            link: function ( scope, element, attrs ) {


                //tree id
                var treeId = attrs.treeId;


                //tree model
                var treeModel = attrs.treeModel;

                //node id
                var nodeId = attrs.nodeId || 'id';

                //node label
                var nodeLabel = attrs.nodeLabel || 'name';
                //appID
                var nodeAppId   = attrs.nodeAppId || 'app_id'
                //appID
                var nodeType   = attrs.nodeType || 'type'

                //children
                var nodeChildren = attrs.nodeChildren || 'children';

                //tree template
                var template =
                    '<ul  >' +

                    '<li  data-ng-repeat="node in ' + treeModel + ' track by $index"> ' +
                     '<div ng-if="node.type==\'application\'" ng-init="node.collapsed=true"></div>'+
                    '<i class="collapsed glyphicon glyphicon-folder-open" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                    '<i class="expanded glyphicon glyphicon-folder-open " data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +

                    ' <i ng-if="node.name==\'Dashboard\' || node.name==\'Pipeline\'" class="collapsed glyphicon glyphicon-folder " data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                    '<span ng-if="node.type==\'Pipeline\'" class="normal glyphicon glyphicon-folder-open" data-ng-class="node.selected " data-ng-click="' + treeId + '.selectNodeLabel(node)"><a ng-click="openPipeline(node.application_id,node.id)">{{node.' + nodeLabel + '}}</a></span>' +
                    '<span ng-if="node.type==\'Dashboard\'" class="normal glyphicon glyphicon-folder-open" data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)"><a ng-click="showDashBoardView(node.id)">{{node.' + nodeLabel + '}}</a></span>' +
                    '<span ng-if="node.type==\'application\'||node.type==\'Dashboards\'||node.type==\'Pipelines\'" data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)"><a>{{node.' + nodeLabel + '}}</a></span>' +

                    '<a  ng-if="node.name==\'Dashboard\' || node.name==\'Pipeline\'" class=" btn "  ng-click="newSubItem(node,$index)" ><span class="glyphicon glyphicon-plus"></span></a><input ng-if="( node.name==\'Pipeline\')" type="text" ng-show="node.show" ng-model="pipeline.name"><span ng-if="node.name==\'Pipeline\'" ng-show="node.show" class="glyphicon glyphicon-ok" ng-click="savePipeline(node,pipeline.name)"></span><input ng-if="( node.name==\'Dashboard\')" type="text" ng-show="node.show" ng-model="dashboard.name"><span ng-if="node.name==\'Dashboard\'" ng-show="node.show" class="glyphicon glyphicon-ok" ng-click="saveDashboard(node,dashboard.name)"></span>'+
                    '<a ng-if="!(node.name==\'Dashboard\' || node.name==\'Pipeline\')"  class=" btn "  ng-click="node.show=\'true\'"  ><span class="glyphicon glyphicon-edit" ng-click="edit(node)"></span></a><input ng-if="!( node.name==\'Pipeline\'||node.name==\'Dashboard\')" type="text" ng-show="node.show" ng-model="node.name"><span ng-if="!( node.name==\'Pipeline\'||node.name==\'Dashboard\')" ng-show="node.show" class="glyphicon glyphicon-ok" ng-click="updateWorkflow(node)"></span>'+
                    '<a ng-if="!(node.name==\'Dashboard\' || node.name==\'Pipeline\')"  class=" btn "  ng-click="remove(node)"  ><span class="glyphicon glyphicon-remove"></span></a>'+


                    '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-name=' + nodeLabel + ' data-node-children=' + nodeChildren + ' data-node-app_id=' + nodeAppId +  ' data-node-type=' + nodeType + '></div>' +
                    '</li>' +
                    '</ul>';


                //check tree id, tree model
                if( treeId && treeModel ) {

                    //root nodeeditValue
                    if( attrs.angularTreeview ) {

                        //create tree object if not exists
                        scope[treeId] = scope[treeId] || {};

                        //if node head clicks,
                        scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

                       //Collapse or Expand
                            console.log(selectedNode)

                            selectedNode.collapsed = !selectedNode.collapsed;
                        };
                       //if node label clicks,
                        scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

                            //remove highlight from previous node
                            applicationService.app_id= selectedNode.id;
                            if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
                                scope[treeId].currentNode.selected = undefined;
                            }

                            //set highlight to selected node

                            console.log(selectedNode.id);

                            selectedNode.selected = 'selected';

                            //set currentNode
                            scope[treeId].currentNode = selectedNode;
                        };
                    }

                    //Rendering template.
                    element.html('').append( $compile( template )( scope ) );
                }
            }
        };
    }]);
})( angular );
