
(function () {

    var ifwe =  angular.module('app', []);
    ifwe.controller('ratingsSystem', ['$scope', '$http', ratingsSystem]);
    ifwe.directive('deleteGame', deleteGame);
    ifwe.directive('numbersOnly', numbersOnly);

    function ratingsSystem($scope, $http) {

        var addForm = $('#newGame');

        $scope.scores;
        $scope.leaderboard;
        $scope.formErrors = false;
        $scope.hasData = false;

        $http.get('assets/data/scores.json')
            .success(function(response) {
                $scope.scores = response;
                $scope.hasData = true;
            });

        $scope.calculateScores = function() {
            var playerList = uniquePlayers($scope.scores);
            var leaderBoard = [];
            for(var i = 0; i < $scope.scores.length; i++) {
                if($scope.scores[i].score1 > $scope.scores[i].score2) {
                    playerList[$scope.scores[i].player1]++;
                } else {
                    playerList[$scope.scores[i].player2]++;
                }
            }

            for (var key in playerList) {
                leaderBoard.push({player: key, score: playerList[key]});
            }

            $scope.leaderboard = leaderBoard;
        };

        $scope.$watch('scores', function(newVal, oldVal) {
            if($scope.hasData) {
                $scope.calculateScores();
            }
        }, true);

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
        };

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
            } else {
                $scope.formErrors = true;
            }
        }
    }

    function uniquePlayers(scoreboard) {
        var players = [];
        var duplicates = [];
        var scorecards = [];
        for(var i = 0; i < scoreboard.length; i++) {
            duplicates.push(scoreboard[i].player1);
            duplicates.push(scoreboard[i].player2);
        }
        $.each(duplicates, function(i, name){
            if($.inArray(name, players) === -1) {
                players.push(name);
                scorecards[name] = 0;
            };
        });
        return scorecards;
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function numbersOnly() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue == undefined) return ''
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    }

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

})();