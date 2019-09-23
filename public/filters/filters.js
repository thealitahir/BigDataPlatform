
angular.module('webApp.filters').filter('capitalize',function() {
    return function(input) {
// input will be the string we pass in
        if (input) {
            input = input.toLowerCase();
            return input[0].toUpperCase() +
                input.slice(1);
        }
    }
});
