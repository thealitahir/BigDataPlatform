/**
 * Created by Haniya on 12/18/2014.
 */
var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var request = require('request');
var _=require('underscore');
router.post('/s3/getFiles', function (req, res) {

    var body = req.body;
    var connection = {
        accessKeyId: body.accessKey,
        secretAccessKey: body.secretKey
    };
    var s3 = new AWS.S3(connection);
    s3.listObjects({Bucket:body.bucket},function (err, list) {
        console.log(err);
        console.log(list);
        if(!err)
        {
            res.send(list);
        }
        else {
            res.send("Sorry incorrect credentials!");
        }
    });
});
router.post('/s3/getSample', function (req, res) {

    var body = req.body;
    var originalSchema = [];
    var selectedSchema = [];
    var dataArray = [];
    var url="http://192.168.23.103:8080/services/api/s3?accessKey="+req.body.accessKey+"&accessSecret="+req.body.secretKey+"&bucket="+req.body.bucketAndFile;
    console.log(url)

    request(url , function(error, response,body) {
        var data = JSON.parse(body);
        var docsData = JSON.parse(data);
        var size=_.size(docsData.docs);



        var i=0;
        Object.keys(docsData.docs[0]).forEach(function (key) {
            originalSchema.push({type:'String', field:key,index:i});
            i++;
        });

        var dataToSend = {
            data : docsData.docs,
            originalSchema : originalSchema,
            selectedSchema : selectedSchema
        };

        if(size==0){
            res.send("error");

        }
        res.send({status : data.status, data : dataToSend});



    });

});



module.exports = router;