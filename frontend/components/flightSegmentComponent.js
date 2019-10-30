var findIndex = require('lodash/findIndex');

module.exports = angular.module('travelPayoutsApp').component('flightSegment', {
    templateUrl: './templates/components/flightSegment.html',
    bindings: {
        flights: '<',
        first: '<',
        last: '<'
    },
    require: {
        parent: '^^searchResultsItem'
    },
    controller: function ($scope, $element) {
        var self = this;
        self.airports = [];
        self.cities = [];
        var directions = ['departure', 'arrival'];
        var originDep = {};
        self.travelDirection = {
            departure: 'Departure from',
            arrival: 'Arrival to',
            change: 'Change airport to'
        };
        self.openinfo = "close";
        self.timesdata = [];
        self.$onChanges = function () {
            self.airportsData = self.parent.airports;
            originDep[self.first] = 'first';
            originDep[self.last] = 'last';
            setAirportsData();
        };
        function setAirportsData() {
            var i = 0;
            angular.forEach(self.flights, function (flight) {
                angular.forEach(directions, function (direction) {
                    var airportValues = pickBykey(flight, direction);
                    var airport = airportValues.airport;
                    var city = self.airportsData[airport].city_code;
                    airportValues.direction = direction;

                    var airportsIndex = findIndex(self.airports, {city: city});
                    if (airportsIndex === -1) {
                        var data = {
                            city: city,
                            status: originDep[airport] !== undefined ? originDep[airport] : '',
                            data: [airportValues],
                            airports: [airport]
                        };
                        self.airports.push(data);
                    } else {
                        self.airports[airportsIndex].data.push(airportValues);
                        if (self.airports[airportsIndex].airports.indexOf(airport) === -1) {
                            self.airports[airportsIndex].airports.push(airport);
                        }
                    }

                    if(i>0){
                        airportValues['timevalue'] = airportValues.timestamp - self.timesdata[i-1].timestamp;
                        airportValues['dep_data'] = self.timesdata[i-1];
                        airportValues['showdetails'] = "close";
                    }
                    self.timesdata.push(airportValues);
                    i++;
                });
            });
            self.timesdata.shift();
        }

        function pickBykey(array, searchKey) {
            var result = {};
            angular.forEach(array, function (value, key) {
                var searchKeyRegexp = new RegExp(searchKey + '_?', 'g');
                if (key.match(searchKeyRegexp)) {
                    var newKey = key.replace(searchKeyRegexp, '');
                    if (newKey.length === 0) {
                        newKey = 'airport';
                    }
                    result[newKey] = value;
                }
            });
            result['operated_by'] = array['operated_by'];
            result['aircraft_info'] = array['operated_by'] + '-' + array['number'] + ' - ' + array['aircraft'];
            result['aircraft'] = array['aircraft'];
            result['flight_name'] = array['trip_class'] + array['operated_by'] + array['number'];
            result['hasinfo'] = self.parent.parent.flight_info[result['flight_name']] == undefined ? false : true;
            return result;
        }

        $scope.toggleOpen = function(event, city_key) {
            //self.openinfo = self.openinfo=="open" ? "close" : "open";
            self.timesdata[city_key].showdetails = self.timesdata[city_key].showdetails=="open" ? "close" : "open";
            event.stopPropagation();
        }
    }
});