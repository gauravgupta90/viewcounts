'use strict';

angular.module('app', [
        'ui.bootstrap'
    ])
    .controller('MainCtrl', function($scope, $http, $filter) {
        $scope.scheduleDate = new Date();

        $scope.getScheduleInfo = function() {
            var date = $filter('date')($scope.scheduleDate, 'yyyy-MM-dd');

            $http.post('/getViews', {
                    "date": date
                })
                .then(function(data) {
                    $scope.views = data.data;
                    console.log(data);
                })
                .catch(function(err) {
                    alert(err)
                })
        }

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
    });