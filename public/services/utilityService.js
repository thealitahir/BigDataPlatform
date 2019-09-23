angular.module('webApp.services').factory('utilityService',[function () {

    return {

        capitalize: function (input) {
            if (input) {
                input = input.toLowerCase();
                return input[0].toUpperCase() + input.slice(1);
            }
        }
    }

}]);
