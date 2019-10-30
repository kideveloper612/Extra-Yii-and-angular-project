module.exports = angular.module('travelPayoutsApp').component('reviewsEdit', {
    templateUrl: './templates/components/reviewsEdit.html',

    bindings: {
        agencyLabel: '<'
    },
    controller: function ($scope, $element, $document, $timeout, $state, $http) {
        var self = this;
        // self.getData = function() {

        // };


        
        // $scope.getData = function () {
        //     return $http({
        //         method: 'POST',
        //         url: './api/search/redirect/' + $stateParams.searchId + '/' + $stateParams.urlId
        //     }).then(function (response) {
        //         $scope.resolved = true;
        //         $scope.data = response.data;
        //         if(response.data.error ===undefined){
        //             $timeout(function () {
        //                 if ($scope.data.method === "GET") {
        //                     window.location.replace($scope.data.url);
        //                 } else {
        //                     angular.element('#redirect_params_form').submit();
        //                 }
        //             }, 3000);
        //         }
        //     });
        // };

        
        // $scope.getData = function() {
        //     return $http({
        //         method: 'GET',
        //         url: './api/review',
        //     }).then(function (response) {
        //         console.log(response);
        //     });
        // };
        // $scope.getData();
        
        // console.log('edit');
















        self.star_class = ["zero", "one", "two", "three", "four", "five"];
        self.mark_star = 0;
        self.current_star = self.mark_star;
        self.showWindow = false;
        self.$onInit = function () {
            // Display modal window after 15 minutes of making request
            return;
            self.showWindowPromise = $timeout(function () {
                // add modal overlay
                angular.element($document[0].body).addClass('reviewsEdit-show').append('<div class="reviewsEdit-overlay" ng-click="$ctrl.closeEdit()"></div>');
                self.showWindow = true;
            }, 1000 * 30)
        };

        self.$onDestroy = function () {
            $timeout.cancel(self.showWindowPromise);
            // remove modal overlay
            angular.element($document[0].body).removeClass('reviewsEdit-show').find('.reviewsEdit-overlay').remove();
        };
        
        self.closeEdit = function () {
            angular.element($document[0].body).removeClass('reviewsEdit-show').find('.reviewsEdit-overlay').remove();
        }

        self.submit = function () {
            alert(1);
        }
        $(".star-selector__buttons__button").mouseover(function() {
            var id = event.srcElement.id.slice(1);
            $(".star-selector__buttons").removeClass("star-selector__buttons-"+self.star_class[self.current_star]);
            $(".star-selector__buttons").addClass("star-selector__buttons-"+self.star_class[id]);
            $(".star-selector__descriptions>.a"+self.current_star).addClass("hide");
            $(".star-selector__descriptions>.a"+id).removeClass("hide");
            self.current_star = id;
        });
        $(".star-selector__buttons__button").click(function(){
            self.mark_star = self.current_star;
        });
        $(".star-selector__buttons__button").mouseout(function(){
            $(".star-selector__buttons").removeClass("star-selector__buttons-"+self.star_class[self.current_star]);
            $(".star-selector__buttons").addClass("star-selector__buttons-"+self.star_class[self.mark_star]);
            $(".star-selector__descriptions>.a"+self.current_star).addClass("hide");
            $(".star-selector__descriptions>.a"+self.mark_star).removeClass("hide");
            self.current_star = self.mark_star;
        });
    }


});