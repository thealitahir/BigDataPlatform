angular.module('webApp.controllers')
    .controller('pipelineCtrl',['$scope','$state','$stateParams','pipeline','stageService', function ($scope,$state,$stateParams,pipeline,stageService) {
        $scope.pipeline = pipeline;
        $scope.linkProps = {
            isOn : false,
            source : ''
        };
        var graph = new joint.dia.Graph;
        graph.on('remove', function (cell) {

            //if user removes links
            //every time user click on on cross button of link or if user drops link's source or target on blank paper this code will execute
            //graph remove function will be invoked every time an element from paper will be removed so have to check whether its link is removing or some thing else
            if (cell.attributes.type == 'link' || cell.attributes.type == 'custom.ModelLink') {

                //first check whether user clicked on cross button of link or link was dropped on empty paper if dropped on empty paper this if condition will execute
                var srcView = null;
                var trgView = null;
                if (cell.attributes.source.id && cell.attributes.target.id) {

                    //cross button of link is clicked
                    //link will have its source id and target id directly in source and target key saved
                    srcView = graph.getCell(cell.get('source').id);
                    trgView = graph.getCell(cell.get('target').id);
                    var sourceStage=srcView.get("stage");
                    var targetStage=trgView.get("stage");
                    var sourceMongoDbId=sourceStage._id;
                    var targetMongoDbId=targetStage._id;


                }
                else {

                    //link is dropped on emty paper so update inbouds and outbounds of previous target and source
                    //we can get previous target and source from srcId and trgId I have been maintaining in cell.attributes.attrs
                    srcView = paper.findViewByModel(graph.getCell(cell.attributes.attrs.srcId));
                    trgView = paper.findViewByModel(graph.getCell(cell.attributes.attrs.trgId));
                }

                //now update soruce view and target view inbounds and out bounds


                if (srcView && trgView) {

                    //////////////////////////////////////////////////////////
                    stageService.removeLink(sourceMongoDbId,targetMongoDbId).success(function(res){

                    });
                }
            }
            else {
                //if user removes cell
                //for now don't have to do any thing on removal of cell
            }

        });


        var paper = new joint.dia.Paper({
            el: $('#pipeline'),
            width: '100%',
            height: '98%',
            model: graph,
            gridSize: 1
        });
        paper.on('cell:pointerclick',function (cellView, evt, x, y) {
            var self = this;
            if($scope.linkProps.isOn){
                if($scope.linkProps.source == "" ){
                    $scope.linkProps.source =  cellView.model
                }
                else{

                    $scope.drawLink($scope.linkProps.source.get("id"),cellView.model.get("id"));
                    var sourceStage=$scope.linkProps.source.get("stage");
                    var targetStage=cellView.model.get("stage");
                    var sourceMongoDbId=sourceStage._id;
                    var targetMongoDbId=targetStage._id;


                    stageService.addLink(sourceMongoDbId,targetMongoDbId).success(function (res) {

                    });

                }
            }

            console.log(cellView.model);

            var stage = cellView.model.get('stage');
            $state.go('applications.pipelineDetail.stageDetail',{stageType : stage.stage_type, subType :  stage.sub_type, stageId : stage._id});

        });

        jointElement();

        $scope.add = function (stageType, subType) {

            var stage = {
                stageType : stageType,
                subType : subType,
                applicationId : $stateParams.applicationId,
                pipelineId : $stateParams.pipelineId
            };
            stageService.create(stage).success(function (res) {
                var stage = res.data;
                $scope.drawStage(stage);
                $state.go('applications.pipelineDetail.stageDetail',{stageType : stageType, subType :  subType, stageId : res.data._id});

            });
        };

        $scope.toggleLink = function () {
            $scope.linkProps.isOn = !$scope.linkProps.isOn;
            $scope.linkProps.source = "";
        };
        $scope.drawStage = function (stage) {

            var stageElement = new joint.shapes.html.Element({ position: { x: 80, y: 80 }, size: { width: 40, height: 40 }, stage: stage });
            graph.addCells([stageElement]);
        };
        $scope.drawLink = function (sourceId, targetId) {

            var link =
                new joint.dia.Link({
                    source: {
                        id: sourceId
                    },
                    target: {
                        id: targetId
                    }
                });
            link.attr({'.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }});
            graph.addCells([link]);
        };
        $scope.restorePipeline = function () {

            // restore stages
            if($scope.pipeline.stages.length > 0 ){
                for(var i = 0; i < $scope.pipeline.stages.length; i++){
                    $scope.drawStage($scope.pipeline.stages[i]);
                }
            }

        };

        $scope.restorePipeline();

        function jointElement(){
            // Create a custom element.

            joint.shapes.html = {};
            joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
                defaults: joint.util.deepSupplement({
                    type: 'html.Element',
                    attrs: {
                        rect: { stroke: 'none', 'fill-opacity': 0}
                    }
                }, joint.shapes.basic.Rect.prototype.defaults)
            });

            // Create a custom view for that element that displays an HTML div above it.

            joint.shapes.html.ElementView = joint.dia.ElementView.extend({

                template: '<span class="stage-icons"><span class="glyphicons icon"></span><span class="glyphicons glyphicons-remove stage-icon-remove"></span></span>',
                initialize: function() {
                    var self =  this;
                    _.bindAll(this, 'updateBox');
                    joint.dia.ElementView.prototype.initialize.apply(this, arguments);

                    this.$box = $(_.template(this.template)());
                   /* this.$box.find('.icon').on('click', function () {


                    });*/
                    this.$box.find('.delete').on('click', function () {
                        alert('delete clicked')
                    });
                    // Update the box position whenever the underlying model changes.
                    this.model.on('change', this.updateBox, this);
                    this.updateBox();
                },
                render: function() {
                    joint.dia.ElementView.prototype.render.apply(this, arguments);
                    this.paper.$el.prepend(this.$box);
                    this.updateBox();
                    return this;
                },
                updateBox: function() {
                    // Set the position and dimension of the box so that it covers the JointJS element.
                    var bbox = this.model.getBBox();
                    var stage = this.model.get("stage");
                    this.$box.find('.icon').addClass(stage.icon);
                    this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
                }
            });
        }
    }])
;