angular.module('webApp.controllers')
    .controller('fileSourceCtrl',['$scope','stage', function ($scope,stage) {

        console.log(stage);
        $scope.fileSource = stage;

    }])
    .controller('hdfsSourceCtrl',['$scope','stage','stageService', function ($scope,stage,stageService) {

        console.log(stage);
        $scope.hdfsSource = stage;

        $scope.update = function () {

            stageService.update($scope.hdfsSource).success(function (res) {

                console.log(res);
            });
        }

    }]).controller('s3SourceCtrl',['$scope','stage','stageService','sourceHelperService', function ($scope,stage,stageService,sourceHelperService) {

        console.log(stage);
        $scope.s3DataSource = stage;

        $scope.update = function () {

            stageService.update($scope.s3DataSource).success(function (res) {

                console.log(res);
            });
        }

        $scope.s3={
            parent:[],
            exploreDirectory:[],
            breadcrums:''

        };
       $scope.s3.parent.push("*");
       $scope.temp = [];
        $scope.openAgain=false;
        $scope.splitterFields = [];
        $scope.splitter = [];

        $scope.indexOf= function(array,name){
            if (typeof array !== "undefined") {
                for(var i=0; i <array.length;i++) {
                    if (array[i].path == name) {
                        return i;
                    }
                }}};

        $scope.CheckUncheckIndex=function(name) {
            var selectIndex=$scope.indexOf($scope.s3DataSource.stage_attributes.files,name);
            return (selectIndex >-1) ? true:false;
        };
        $scope.getFiles = function () {
          


            if($scope.s3Form.buck.$pristine==false ){
                $scope.s3DataSource.stage_attributes.files=[];
            }
            if($scope.openAgain==false ) {
                // s3 helping variables

                $scope.s3.parent=[];
                $scope.s3.parent.push("*");
                $scope.s3.exploreDirectory=[];
                $scope.s3.breadcrums="";
                $scope.active=false;
                $scope.activeExplorer=false;
                $scope.openAgain=false;
                $scope.allFiles = [];
                $scope.files=[];
                $scope.count=0;

                sourceHelperService.getFiles($scope.s3DataSource.stage_attributes.accessKey, $scope.s3DataSource.stage_attributes.secretKey, $scope.s3DataSource.stage_attributes.bucket).success(function (response) {
                    if (response == "Sorry incorrect credentials!") {
                        //notifyService.notify("Sorry incorrect credentials!");
                        $scope.alert = {type: 'error', msg: 'Sorry incorrect credentials!'};

                        $scope.s3.breadcrums = "";

                    }
                    else {


                        $scope.alert={type: 'error', msg: ''};
                          $scope.allFiles = response.Contents;
                        for (var i = 0; i < $scope.allFiles.length; i++) {
                            if ($scope.allFiles[i].Key.indexOf("/") == -1) {
                                $scope.files[i] = $scope.allFiles[i].Key;
                            } else {
                                $scope.files[i] = $scope.allFiles[i].Key.substr($scope.allFiles[i].Key.lastIndexOf("/") + 1)
                            }
                        }
                        for (var i = 0; i < $scope.allFiles.length; i++) {
                            var split = $scope.allFiles[i].Key.split("/");
                            for (var x = 1; x < split.length; x++) {
                                $scope.temp[i] = $scope.temp[i] + "/" + split[x];
                            }
                            var inn = $scope.s3.parent.indexOf(split[0]);
                            if (inn == -1) {
                                $scope.s3.parent.push(split[0]);
                                $scope.s3.exploreDirectory.push(split[0]);
                            }
                        }
                        $scope.s3.parent.push("*");
                    }
                });
            }
            else{

            }
        }

        $scope.explore=function(item) {
            if ($scope.files.indexOf(item)==-1) {
                $scope.activeExplorer=true;
                $scope.s3.breadcrums = $scope.s3.breadcrums + "/" + item;
                $scope.s3.exploreDirectory = [];
                for (var i = 0; i < $scope.allFiles.length; i++) {
                    var split = $scope.allFiles[i].Key.split("/");
                    if (split[$scope.count] == item ) {

                        for (var x = $scope.count; x < split.length; x++) {
                            $scope.temp[i] = $scope.temp[i] + "/" + split[x];
                        }

                        var inn = $scope.s3.parent.indexOf(split[$scope.count+1]);
                        if (inn == -1) {
                            $scope.s3.parent.push(split[$scope.count+1]);
                            $scope.s3.exploreDirectory.push(split[$scope.count+1])
                        }
                    }
                }
                $scope.s3.parent.push("*");
                $scope.count++;
            }
            else{
                var path=$scope.s3.breadcrums+"/"+item;
                var index = $scope.indexOf($scope.s3DataSource.stage_attributes.files,path);
                var ext= path.split(".");

                if(typeof (ext[1])=="undefined"){
                    ext[1]="";
                }
                if(!((ext[1] == 'csv') || (ext[1] == 'xml')))
                {

                }
                if(index>-1){
                    $scope.s3DataSource.stage_attributes.files.splice(index,1);

                }
                else {
                    //   $scope.s3DataSource.stage_attributes.files.push({ 'name':item,'path':path,'extension':ext[1],splitter : $scope.splitter});
                    $scope.s3DataSource.stage_attributes.files.push({ 'name':item,'path':path,'extension':ext[1]});
                }
            }
        };

        //-------------------------SPLITTER WORK------------------------------//
       /* sourceHelperService.getSplitter().success(function(response) {

            $scope.splitters = response.data;
        });*/

        $scope.saveSchema = function(){

            for (var i = 0; i < $scope.splitterFields.length; i++)
            {
                $scope.splitter.push($scope.splitterFields[i].newSplitter);
            }

            //notifyService.notify("Splitter Added");
        }

        $scope.addSplitter = function (){

            $scope.splitterFields.push({
                newSplitter: ''
            });
        };

        //---------------------------END------------------------------//

        $scope.goBack=function() {

                if( $scope.activeExplorer){
                    var help = [];

                    var arr = $scope.s3.breadcrums.substr(0, $scope.s3.breadcrums.lastIndexOf("/"));
                    $scope.s3.breadcrums = arr;
                    if (arr.length >= 0) {
                        $scope.s3.parent.pop();
                        var pop = $scope.s3.parent.pop();
                        while (pop != "*") {
                            pop = $scope.s3.parent.pop();
                        }
                        $scope.s3.exploreDirectory = [];
                        var pop2 = $scope.s3.parent.pop();
                        help.push(pop2);

                        while (pop2 != "*") {
                            $scope.s3.exploreDirectory.push(pop2);
                            pop2 = $scope.s3.parent.pop();
                            help.push(pop2);
                        }

                        while (help.length) {
                            $scope.s3.parent.push(help.pop());
                        }
                        $scope.s3.parent.push("*");
                        $scope.count--;

                        if($scope.count==0)
                        {
                            $scope.activeExplorer=false;
                        }
                    }
                }

        };
        $scope.crossMarkedFile=function(item){

            var index =$scope.indexOf($scope.s3DataSource.stage_attributes.files,item);
            if(index>-1) {
                $scope.s3DataSource.stage_attributes.files.splice(index, 1);

            }
        };
        $scope.cancelAll= function(){
            $scope.s3DataSource.stage_attributes.files=[];
            $scope.openAgain=false;
            //notifyService.notify("Files Selection Cancelled");
            alert("files selection Cancelled")

        };
        $scope.populateConnection=function(){


            //notifyService.notify("Files Marked");
            alert("files marked")
            $scope.openAgain=true;


        };
        $scope.save = function () {

            //console.log($scope.s3DataSource);

          /*  stageService.save($scope.s3DataSource).success(function(response){
                if(response.msg=="Stage saved successfully."){


                    $scope.openAgain=false;
                    //notifyService.notify(response.msg);
                }
                var flag="S3";
                sourceHelperService.getSample($scope.s3DataSource.stage_attributes.accessKey, $scope.s3DataSource.stage_attributes.secretKey, $scope.s3DataSource.stage_attributes.bucket,$scope.s3DataSource.stage_attributes.files[0].path).success(function (resp) {

                    //stageService.setSchema(resp.data.originalSchema);
                    //stageService.setData(resp.data.data);

                    //stageService.save($scope.s3DataSource);

                });
            });*/
        };

    }]);
