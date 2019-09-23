/**
 * Created by Haniya on 12/18/2014.
 */
angular.module('webApp.services').factory('sourceHelperService',['$http',function ($http) {

    return {
        getFiles : function(accessKey,secretKey,bucket){
            var url = 'sourceHelpers/s3/getFiles';
            var data = {
                accessKey :  accessKey,
                secretKey : secretKey,
                bucket : bucket
            };

            return $http.post(url,data);
        },
        getSample: function(accessKey,secretKey,bucket,FilePath)
        {
            var bucketAndFile=bucket+FilePath;

            var url='sourceHelpers/s3/getSample';
            var data ={
                accessKey:accessKey,
                secretKey:secretKey,
                bucketAndFile:bucketAndFile
            }
            console.log("data in helper service");
            console.log(data);
            return $http.post(url,data);

        }

    }
}]);