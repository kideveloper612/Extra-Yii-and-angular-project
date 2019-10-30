var indexController = angular.module('travelPayoutsApp').controller('indexController', function ($scope, $stateParams, tmhDynamicLocale, $state, $transitions, $window, $timeout, $document) {
    $scope.searchData = angular.copy($stateParams);
    $scope.searchUrl = $window.location.search;

    $transitions.onSuccess({}, function () {
        $timeout(function () {
            $scope.searchUrl = $window.location.search;
        }, 100);
    });

    $scope.submit = function () {
        $scope.$broadcast('initNewSearch');
        $timeout(function () {
            $state.go('search', $scope.searchData);
            $scope.searchUrl = $window.location.search;
        }, 200);
    };

    $scope.edit_review = function() {
        // angular.element($document[0].body).addClass('reviewsPopup-show').append('<div class="reviewsPopup-overlay"></div>');
        // angular.element($document[0].body).addClass('reviewsEdit-show').append('<div class="reviewsEdit-overlay"></div>');
    }
    $scope.change_view = function(page) {
        
    }
    //Sticky header
    $scope.stickyTop = false;
    angular.element($window).bind("scroll", function () {
        if ($(window).scrollTop() > 65) {
            $scope.stickyTop = true;
        } else {
            $scope.stickyTop = false;
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

    // Click on body to hide all opened popovers
    $scope.$watch('stickyTop', function (oldVal, newVal) {
        if (oldVal !== newVal) {
            $(document).find('body').click();
        }
    });
});

module.exports = indexController;