
(function () {

    var ifwe =  angular.module('app', []);
    ifwe.controller('ratingsSystem', ['$scope', '$http', ratingsSystem]);
    ifwe.directive('deleteGame', deleteGame);

    function deleteGame() {
        return {
            restrict: 'C',
            link: function(scope, ele, attrs) {
                ele.on('click', function(e) {
                    var thisIndex = $(this).data('index');
                    $(this).parent().parent().addClass('danger');
                    var removeGame = confirm("Are you sure you want to delete this game?");
                    if (removeGame == true) {
                        scope.$apply(function () {
                            scope.scores.splice(thisIndex, 1);
                        });
                    } else {
                        $(this).parent().parent().removeClass('danger');
                    }
                });
            }
        }
    }

    function ratingsSystem($scope, $http) {

        var addForm = $('#newGame');

        $scope.scores;
        $scope.formErrors = false;

        $http.get('assets/data/scores.json')
            .success(function(response) {
                $scope.scores = response;
                $scope.calculateScores();
            })

        $scope.calculateScores = function() {
        }

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
                $scope.formErrors = false;
                var scoreObj = {
                    player1: addForm.find('#player1').val(),
                    score1: addForm.find('#player1-score').val(),
                    player2: addForm.find('#player2').val(),
                    score2: addForm.find('#player2-score').val()
                }
                $scope.scores.push(scoreObj);
                addForm.find('input').val(''); // Reset Form Values
                console.log($scope.scores);
            } else {
                $scope.formErrors = true;
            }
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

})();