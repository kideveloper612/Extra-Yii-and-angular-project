var flatArray = require('lodash/flattenDeep');
var intersection = require('lodash/intersection');
var minBy = require('lodash/minBy');
var maxBy = require('lodash/maxBy');
var uniqBy = require('lodash/uniqBy');
module.exports = angular.module('travelPayoutsApp').component('searchResults', {
    templateUrl: './templates/components/searchResults.html',
    bindings: {
        searchId: '<',
        results: '<',
        requests: '<'
    },
    controller: function ($scope, currencyFactory, $window, $document) {
        var self = this;
        var resultsLength = undefined;
        var currencyList = currencyFactory.getData();
        self.proposals = [];
        self.airports = {};
        self.airlines = {};
        self.gates = {};
        self.filtersBoundary = [];
        self.flight_info = {};
        self.global_currency = "";
        // Initial sort,filter params
        self.orderByParam = 'price';
        self.filterByParam = {};
        self.limit = 10;
        self.request_data = [];
        self.showMore = function () {
            self.limit += 10;
        };
        self.location_url = $window.location.href;
        this.$onInit = function () {
            resultsLength = self.results.length;
            self.completed = false;
            self.is_multi_route = self.requests.data.open_jaw;
        };
        self.stops_airports = [];
        self.stops_airports[0] = [];
        self.stops_airports[1] = [];
        var segments = [];
        var proposalIndex = [];
        self.baggagePrices = [];
        $scope.$on('searchUpdated', function () {
            var lastElement = self.results[self.results.length - 1];
            resultsLength = self.results.length;
            angular.forEach(self.results, function (gate, gate_id) {
                angular.merge(self.airports, gate.airports);
                angular.merge(self.airlines, gate.airlines);
                angular.merge(self.gates, gate.gates_info);
                angular.merge(self.flight_info, gate.flight_info);
                if(gate.currency)
                    self.global_currency = gate.currency;
                if (gate.filters_boundary !== undefined) {
                    self.filtersBoundary.push(gate.filters_boundary);
                }
                // Save and update existing proposals
                angular.forEach(gate.proposals, function (proposal, proposal_id) {
                    if (proposalIndex.indexOf(proposal.sign) === -1) {
                        self.proposals.push(proposal);
                        proposalIndex.push(proposal.sign);
                    } else {
                        var key = self.proposals.findIndex(function (item) {
                            return item.sign === proposal.sign;
                        });
                        // Merge prices
                        if (key !== -1) {
                            self.proposals[key] = angular.merge(self.proposals[key], {terms: proposal.terms});
                        }
                    }
                    self.stops_airports[0].push(proposal.segments_airports[0][0]);
                    self.stops_airports[1].push(proposal.segments_airports[0][1]);
                    // angular.forEach(proposal.segments_airports, function(airports){
                    //     self.stops_airports[0].push(airports[0]);
                    //     self.stops_airports[1].push(airports[1]);
                    // });
                    var airlines = [];
                    angular.forEach(proposal.segment, function (segment){
                        angular.forEach(segment.flight, function(flight){
                            airlines.push(flight.operated_by);
                        });

                    });
                    self.results[gate_id].proposals[proposal_id].airlines = airlines;
                    var terms = proposal.terms[Object.keys(proposal.terms)[0]];
                    var without_baggage = true;
                    var luggage_baggage = true;
                    angular.forEach(terms.flights_baggage, function (baggage, baggage_id){
                        without_baggage = without_baggage && (baggage == false || baggage=="");
                        luggage_baggage = luggage_baggage && (!without_baggage);
                        if(!terms.flights_handbags[baggage_id]){
                            if(terms.flights_handbags[baggage_id]!=undefined)
                                luggage_baggage = false;
                        }
                    });
                    if(without_baggage){
                        if(!self.baggagePrices['without_baggage'] || self.baggagePrices['without_baggage']>terms.unified_price)
                            self.baggagePrices['without_baggage'] = terms.unified_price;
                    }
                    if(luggage_baggage){
                        if(!self.baggagePrices['luggage_baggage'] || self.baggagePrices['luggage_baggage']>terms.unified_price)
                            self.baggagePrices['luggage_baggage'] = terms.unified_price;
                    }

                });
                angular.forEach(gate.segments, function(item, id){
                    segments[id] = id;
                });
            });
            self.stops_airports[0] = uniqBy(self.stops_airports[0]);
            self.stops_airports[1] = uniqBy(self.stops_airports[1]);
            
            if (Object.keys(lastElement).length === 1) {
                self.completed = true;
            }

            if(segments.length>0){
                angular.forEach(segments, function(segment,id){
                    self["filterByDeparture"+id] = function (item, value){
                        if(value.length == 0) return true;
                        var departure_time = self.timeToMinute(item.segment[id]['flight'][0]['departure_time']);
                        return departure_time >= value.min && departure_time <= value.max;
                    };
                    self["filterByArrival"+id] = function (item, value){
                        if(value.length == 0) return true;
                        var arrival_time = self.timeToMinute(item.segment[id]['flight'][0]['arrival_time']);
                        return arrival_time >= value.min && arrival_time <= value.max;
                    };
                });
            }
        });
        self.current_agency = "";
        self.open_review = function (siteLabel){
            self.current_agency = siteLabel;
            // angular.element($document[0].body).addClass('reviewsPopup-show').append('<div class="reviewsPopup-overlay"></div>');
        }
        self.orderBy = function (item) {
            var result = 0;
            if (self.orderByParam === 'price') {
                var rate = 1;

                var terms = Object.keys(item.terms).map(function (key) {
                    return item.terms[key];
                });
                if (terms !== undefined) {
                    var minPriceItem = minBy(terms, function (term) {
                        return parseFloat(term.price);
                    });
                    var termPrice = parseFloat(minPriceItem.price);

                    if (currencyList[minPriceItem.currency] !== undefined) {
                        rate = currencyList[minPriceItem.currency];
                    }
                    result = termPrice * rate;
                }
            } else if (self.orderByParam === 'dateAsc') {
                result = item.segments_time[0][0];
            } else if (self.orderByParam === 'dateDesc') {
                result = -item.segments_time[0][0];
            } else if (self.orderByParam === 'duration') {
                result = item.total_duration;
            }
            return result;
        };

        self.filterByAirport = function (item, value) {
            if (value.length === 0) return true;
            var airports = flatArray([item.segments_airports, item.stops_airports]);
            return intersection(airports, value).length > 0;
        };

        self.filterByAgencies = function (item, value) {
            if (value.length === 0) return true;
            var agencies = [];
            angular.forEach(item.terms, function(term, id){
                agencies.push(id);
            });
            return intersection(agencies, value) > 0;
        };

        self.filterByAirline = function (item, value) {
            if (value.length === 0) return true;
            var airports = flatArray(item.airlines);
            return intersection(airports, value).length > 0;
        };

        self.filterByStops_airports = function (item, value) {
            if (value.length === 0) return true;
            var airports = flatArray(item.segments_airports);
            return intersection(airports, value).length > 0;
        };

        self.filterByBaggage = function (item, value) {
            if (value.length === 0) return true;
            var obj = item.terms[Object.keys(item.terms)[0]];
            var baggages = flatArray(obj.flights_baggage[0]);
            var luggages = flatArray(obj.flights_handbags[0]);
            var retval = false;
            if(value == "all_baggage"){
                retval = true;
            }
            // if(value == "without_baggage") {
            if(intersection(value, ['without_baggage']).length>0){
                retval = intersection(baggages, "false").length == Object.keys(baggages).length;
                if(retval==false){
                    var spaces = "";
                    angular.forEach(baggages, function(val0){
                        if( val0 != false && val0 != "" ) spaces += val0;
                    });
                    retval = spaces == "";
                }
            }
            // if(value == "luggage_baggage") {
            if(intersection(value, ['luggage_baggage']).length>0){
                retval = true;
                if(!baggages || !luggages)
                    retval = false;
                angular.forEach(baggages, function(val0){
                    // retval = retval && ( val0 != "false" && val0 != "" )
                    if(!val0)
                        retval = false;
                });
                angular.forEach(luggages, function(val0){
                    // retval = retval && ( val0 != "false" && val0 != "" )
                    if(!val0)
                        retval = false;
                });
            }
            return retval;
        }

        self.filterByDuration = function (item, value) {
            if (value.length === 0) return true;
            return (item.total_duration + 10) >= value.min && (item.total_duration - 10) <= value.max;
        };

        self.timeToMinute = function (strTime) {
            return parseInt(strTime) * 60 + parseInt(strTime.substr(3));
        }
        
        self.filterByDuration_segment = function (item, value) {
            if(value.length === 0 || item.is_direct) return true;
            return (item.min_stop_duration + 10) >= value.min && (item.max_stop_duration - 10) <= value.max;
        };

        self.filterByPrice = function (item, value) {
            if (value.length === 0) return true;
            var terms = Object.values(item.terms);
            var priceItems = {
                min: minBy(terms, 'unified_price'),
                max: maxBy(terms, 'unified_price')
            };
            return priceItems.min.unified_price >= value.min && priceItems.max.unified_price <= value.max;
        };
        
        self.filterByStops = function (item, value) {
            if (value.length === 0) return true;
            return value.indexOf(item.max_stops.toString()) !== -1;
        };

        self.filterBy = function (item) {
            var resultObj = {};
            angular.forEach(self.filterByParam, function (data, type) {
                var functionName = 'filterBy' + type.charAt(0).toUpperCase() + type.slice(1);
                // Check if filter function exists
                if (eval("typeof self." + functionName) !== 'undefined') {
                    resultObj[functionName] = self[functionName](item, data)
                }
            });
            var resultValues = Object.values(resultObj);
            return resultValues.every(function (element, index, array) {
                return element;
            });
        };

        self.isEmptyFilter = function () {
            return Object.keys(self.filterByParam).length === 0;
        }
    }
}).filter('inArray', function ($filter) {
    return function (list, arrayFilter, element) {
        if (arrayFilter) {
            return $filter("filter")(list, function (listItem) {
                return arrayFilter.indexOf(listItem[element]) !== -1;
            });
        }
    };
});

