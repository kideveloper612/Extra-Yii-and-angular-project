var minBy = require('lodash/minBy');
var maxBy = require('lodash/maxBy');
var map = require('lodash/map');
// var uniqBy = require('lodash/uniqBy');
var sortBy = require('lodash/sortBy');
module.exports = angular.module('travelPayoutsApp').component('searchResultsFilter', {
    templateUrl: './templates/components/searchResultsFilter.html',
    bindings: {
        count: '<',
        limit: '<',
        airports: '<',
        filtersBoundary: '<',
        orderBy: '=',
        filterBy: '='
    },
    require: {
        parent: '^^searchResults'
    },
    controller: function ($scope, $timeout, $filter, currencyFactory) {
        var self = this;
        var currency = currencyFactory.get();
        var currencyList = currencyFactory.getData();

        self.sortingParams = [
            {id: 'price', label: 'Price'},
            {id: 'duration', label: 'Travel time'},
            {id: 'dateAsc', label: 'Early flight'},
            {id: 'dateDesc', label: 'Later flight'}
        ];
        self.baggages = [];
        self.stopsCount = [];
        self.segments = [];
        self.$onChanges = function () {
            angular.forEach(self.parent.results[0].segments, function(segment, id){
                angular.forEach(self.parent.airports, function (airport, key){
                    if(key==segment.original_origin || airport.city_code==segment.original_origin){
                        segment.city_origin = airport.city;
                    } else if (key==segment.original_destination || airport.city_code==segment.original_destination) {
                        segment.city_destination = airport.city;
                    }
                });
                segment.id = id;
                self.segments[id] = segment;
            });
        };
        

        // Toggle selection for a given fruit by name
        self.toggleSelection = function toggleSelection(type, value, obj=null) {
            // Create field filter if not exist
            if (self.filterBy[type] === undefined) self.filterBy[type] = [];
            var idx = self.filterBy[type].indexOf(value);
            // Is currently selected
            if (idx > -1) {
                self.filterBy[type].splice(idx, 1);
                // Delete empty field filter
                if (self.filterBy[type].length === 0) delete self.filterBy[type];
            }
            // Is newly selected
            else {
                self.filterBy[type].push(value);
            }
            if(value=="master_check_all"){
                if(obj){
                    if (self.filterBy[type] === undefined) 
                        return;
                    // an
                    // var idx = self.filterBy[type].indexOf(value);
                }
            }

        };

        self.isEmptyFilter = function () {
            // 2  = default filtering by price and duration
            return Object.keys(self.filterBy).length <= 2;
        };

        // self.clearFilter = function () {
        //     self.filterBy = {
        //         price:{
        //             min: self.priceSlider.floor,
        //             max: self.priceSlider.ceil
        //         },
        //         duration:{
        //             min: self.durationSlider.floor,
        //             max: self.durationSlider.ceil
        //         },
        //         duration_segment:{
        //             min: self.duration_segmentSlider.floor,
        //             max: self.duration_segmentSlider.ceil
        //         }
        //     }
        //     self.addFilter();
        // };
        // self.addFilter = function() {
        //     angular.forEach(self.segments, function(segment, id) {
        //         var item = [];
        //         item["departure" + id].min = self["departure"+id+"Slider"].floor;
        //         item["departure" + id].max = self["departure"+id+"Slider"].ceil;
        //         self.filterBy.push(item);
        //         item = [];
        //         item["arrival" + id].min = self["arrival"+id+"Slider"].floor;
        //         item["arrival" + id].max = self["arrival"+id+"Slider"].ceil;
        //         self.filterBy.push(item);
        //     });
        // }

        self.priceSlider = {
            floor: 0,
            ceil: 1,
            translate: function (value) {
                var price = (value / currencyList[currency.id]).toFixed(0);
                return currency.view === 'start' ? currency.sign + ' ' + price : price + ' ' + currency.sign;
            }
        };

        self.durationSlider = {
            floor: 0,
            ceil: 1,
            translate: function (value) {
                return $filter('secondsToTime')(value * 60);
            }
        };

        self.duration_segmentSlider = {
            floor: 0,
            ceil: 1,
            translate: function (value) {
                return $filter('secondsToTime')(value * 60);
            }
        };

        self.$onInit = function () {
            searchUpdated();
        };
        $scope.$on('searchUpdated', function () {
            searchUpdated();
        });

        $scope.$on('changeCurrency', function () {
            currency = currencyFactory.get();
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            }, 200);
        });

        function timeToMinute(strTime) {
            return parseInt(strTime) * 60 + parseInt(strTime.substr(3));
        }
        self.stopsCountPrice = [];
        function searchUpdated() {
            var filterData = map(self.filtersBoundary, function (item) {
                var newItem = {
                    priceMin: item.price.min,
                    priceMax: item.price.max,
                    durationMin: item.flights_duration.min,
                    durationMax: item.flights_duration.max,
                    duration_segmentMin: item.stops_duration.min,
                    duration_segmentMax: item.stops_duration.max,
                };
                angular.forEach(self.segments, function(segment, id) {
                    newItem["departure"+id+"Min"] = timeToMinute(item['departure_time_'+id].min);
                    newItem["departure"+id+"Max"] = timeToMinute(item['departure_time_'+id].max);
                    newItem["arrival"+id+"Min"] = timeToMinute(item['arrival_time_'+id].min);
                    newItem["arrival"+id+"Max"] = timeToMinute(item['arrival_time_'+id].max);
                });
                angular.forEach(item.stops_count, function(price, id) {
                    if(!self.stopsCountPrice[id] || self.stopsCountPrice[id]>price)
                        self.stopsCountPrice[id] = price;
                });
                angular.forEach(Object.keys(item.stops_count), function(key){
                    if(self.stopsCount.indexOf(key)==-1)
                        self.stopsCount.push(key);
                });
                self.stopsCount = sortBy(self.stopsCount);
                // angular.merge(self.stopsCount, Object.keys(item.stops_count));
                return newItem;
            });
            self.baggages = [
                // {id: "all_baggage", baggageData: 'All'},
                {id: "without_baggage", baggageData: 'Without baggage'},
                {id: "luggage_baggage", baggageData: 'Luggage,carry on'}
            ];
            self.filterBy.duration = {
                min: minBy(filterData, 'durationMin').durationMin,
                max: maxBy(filterData, 'durationMax').durationMax * 1.5
            };

            self.filterBy.duration_segment = {
                min: minBy(filterData, 'duration_segmentMin').duration_segmentMin,
                max: maxBy(filterData, 'duration_segmentMax').duration_segmentMax * 1.5
            }

            angular.forEach(self.segments, function(segment, id) {    
                self['departure'+id+'Slider'] = {
                    floor: 0,
                    ceil: 1,
                    translate: function (value) {
                        return $filter('secondsToTime')(value * 60);
                    }
                };            
                self.filterBy['departure'+id] = {
                    min: minBy(filterData, 'departure'+id+'Min')['departure'+id+'Min'],
                    max: maxBy(filterData, 'departure'+id+'Max')['departure'+id+'Max']
                };
                self['departure'+id+'Slider'].floor = minBy(filterData, 'departure'+id+'Min')['departure'+id+'Min'];
                self['departure'+id+'Slider'].ceil = maxBy(filterData, 'departure'+id+'Max')['departure'+id+'Max'];

                self['arrival'+id+'Slider'] = {
                    floor: 0,
                    ceil: 1,
                    translate: function (value) {
                        return $filter('secondsToTime')(value * 60);
                    }
                };            
                self.filterBy['arrival'+id] = {
                    min: minBy(filterData, 'arrival'+id+'Min')['arrival'+id+'Min'],
                    max: maxBy(filterData, 'arrival'+id+'Max')['arrival'+id+'Max']
                };
                self['arrival'+id+'Slider'].floor = minBy(filterData, 'arrival'+id+'Min')['arrival'+id+'Min'];
                self['arrival'+id+'Slider'].ceil = maxBy(filterData, 'arrival'+id+'Max')['arrival'+id+'Max'];
            });

            self.durationSlider.floor = minBy(filterData, 'durationMin').durationMin;
            self.durationSlider.ceil = maxBy(filterData, 'durationMax').durationMax * 1.5;
            
            self.duration_segmentSlider.floor = minBy(filterData, 'duration_segmentMin').duration_segmentMin;
            self.duration_segmentSlider.ceil = maxBy(filterData, 'duration_segmentMax').duration_segmentMax * 1.5;

            self.filterBy.price = {
                min: minBy(filterData, 'priceMin').priceMin,
                max: maxBy(filterData, 'priceMax').priceMax
            };

            self.priceSlider.floor = minBy(filterData, 'priceMin').priceMin;
            self.priceSlider.ceil = maxBy(filterData, 'priceMax').priceMax;
        }

    }
}).component('searchFilterPanel', {
    transclude: true,
    templateUrl: './templates/components/searchFilterPanel.html',
    bindings: {
        title: '<'
    },
    controller: function ($element) {
        $element.addClass('filter__panel');
    }
});