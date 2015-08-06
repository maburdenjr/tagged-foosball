
(function () {

    var ifwe =  angular.module('app', []);
    ifwe.controller('ratingsSystem', ['$scope', '$http', ratingsSystem]);

    function ratingsSystem($scope, $http) {

        var addForm = $('#newGame');

        $scope.scores = "Test";

        /* Validates the 'Add New Game' form to make sure the user is entering acceptable values */
        $scope.validateForm = function() {
            var errorMatch = false;
            addForm.find('input').parent().removeClass('has-error');
            addForm.find('input').each(function(index) {
                if ($(this).val() == null || $(this).val().trim() == "") {
                    $(this).parent().addClass('has-error');
                    errorMatch = true;
                }
            });

            addForm.find('input.numeric').each(function(index) {
                var fieldValue = $(this).val();
                if (!isNumeric(fieldValue)) {
                    $(this).parent().addClass('has-error');
                    errorMatch = true;
                }
            });

            return errorMatch;
        }

        /* Submits Form and Saves Scores */
        $scope.submitForm = function() {
            var hasErrors = $scope.validateForm();
            if (!hasErrors) {
                console.log('You made it');
            }
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

})();