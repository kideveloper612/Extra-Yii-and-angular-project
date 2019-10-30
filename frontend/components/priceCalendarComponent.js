module.exports = angular.module('travelPayoutsApp').component('priceCalendar', {
    templateUrl: './templates/components/priceCalendar.html',
    bindings: {
        value: '<',
    },
    require: {
        parent: '^^searchResults'
    },
    controller: function ($element, $state, $http, $scope) {
        var self = this;
        $scope.data = [];
        self.pricesArray = [];
        self.sprintf = require('sprintf-js').sprintf;
        self.get_data = function() {
            return $http({
                method: 'GET',
                url: 'https://min-prices.aviasales.ru/calendar_preload',
                params: {
                    origin: self.parent.requests.data.segments[0].origin,
                    destination: self.parent.requests.data.segments[0].destination,
                    depart_date: self.dateToStr(self.depart_day),
                    return_date: self.dateToStr(self.return_day),
                    one_way: self.one_way}
            }).then(function (response) {
                $scope.data = response.data;
                if(self.one_way){
                    $scope.display_data_one(response.data);
                }
                else{
                    $scope.display_data(response.data);
                }
            });
        }
        this.$onInit = function () {
            // alert(1);
            var request_data = self.parent.requests.data;
            self.one_way = request_data.segments.length==1;
            self.changeDate();
        };
        $scope.$on('searchUpdated', function () {
            // alert(2);
        });
        self.fullMonthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        self.months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        self.days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        self.dateToStr = function(date){
            return self.sprintf("%04d-%02d-%02d", date.getFullYear(), date.getMonth()+1, date.getDate());
        };
        self.changeDate = function(destination=null, offset=0){
            if(offset==0){
                var request_data = self.parent.requests.data;
                self.depart_day = new Date(request_data.segments[0].date);
                if(self.one_way)
                    self.return_day = new Date(request_data.segments[0].date);
                else
                    self.return_day = new Date(request_data.segments[1].date);
            }else if(destination=="depart"){
                self.depart_day = self.change_date(self.depart_day, offset);
                self.depart_dates = self.getDateArray(self.depart_day);
            } else if(destination=="return"){
                self.return_day = self.change_date(self.return_day, offset);
                self.return_dates = self.getDateArray(self.return_day);
            } else if(destination=="month"){
                self.depart_day = self.change_month(self.depart_day, offset);
            }
            if(self.one_way){
                self.date_of_one = [];
                self.date_of_one['year'] = self.depart_day.getFullYear();
                self.date_of_one['month'] = self.depart_day.getMonth();
                self.date_of_one['date'] = self.depart_day.getDate();
                self.date_of_one['month_str'] = self.fullMonthNames[self.depart_day.getMonth()];
                self.date_of_one['first_day'] = (new Date(self.date_of_one['year'], self.date_of_one['month'], 1)).getDay();
                self.date_of_one['weeks'] = parseInt(((new Date(self.date_of_one['year'], self.date_of_one['month']+1, -1)).getDate()+self.date_of_one['first_day'])/7)+1;
                self.date_of_one['cur_week'] = parseInt((self.date_of_one['date']+self.date_of_one['first_day'])/7);
            }
            self.data = self.get_data();
        }
        self.change_date = function(day0, offset) {
            var date = day0.getDate();
            var year = day0.getFullYear();
            var month = day0.getMonth();
            return new Date(year, month, date + offset);
        }
        self.change_month = function(day0, offset) {
            var date = day0.getDate();
            var year = day0.getFullYear();
            var month = day0.getMonth();
            return new Date(year, month+offset, date);
        }
        self.changeLocationDate = function (destination, date, locationUrl){
            //http://localhost:8089/search?origin=CAI&destination=AMS&adults=1&children=0&infants=0&depart_date=2019-09-03&return_date=2019-09-12&trip_class=0
            var urlParts = locationUrl.split(destination+"=");
            var url_tails = "&trip_class=0";
            if(urlParts[1])
                url_tails = urlParts[1].substr(10);
            return urlParts[0] + destination + "=" + date + url_tails;
        };
        self.getDateArray = function(day0) {
            var date = day0.getDate();
            var year = day0.getFullYear();
            var month = day0.getMonth();
            var dateArray = [];
            for(var i=0; i<7; i++){
                dateArray[i] = [];
                dateArray[i][0] = new Date(year, month, date-3+i);
                dateArray[i][1] = self.dateToStr(dateArray[i][0]);
                dateArray[i][2] = dateArray[i][0].getDate()+' '+self.months[dateArray[i][0].getMonth()]+','+self.days[dateArray[i][0].getDay()];
                dateArray[i][3] = dateArray[i][0].getDate() + " " + self.months[dateArray[i][0].getMonth()];
            }
            return dateArray;
        }
        self.setPrices = function(price, depart_date=null, return_date=null){
            if(depart_date)
                price['depart_date'] = depart_date;
            if(return_date)
                price['return_date'] = return_date;
            if(!self.pricesArray[price.depart_date])
                self.pricesArray[price.depart_date] = [];
            if(!self.pricesArray[price.depart_date][price.return_date]){
                self.pricesArray[price.depart_date][price.return_date] = [];
                self.pricesArray[price.depart_date][price.return_date]['price'] = 0;
            }
            if(self.pricesArray[price.depart_date][price.return_date]['price'] == 0 || self.pricesArray[price.depart_date][price.return_date]['price'] > price.value){
                self.pricesArray[price.depart_date][price.return_date]['price'] = price.value;
                self.pricesArray[price.depart_date][price.return_date]['class'] = 'cheap';
            }
        }
        $scope.display_data_one = function(priceData){
            angular.forEach(priceData.best_prices, function(price){
                self.pick_price_one(price.depart_date, price.value, 'cheap');
            });
            angular.forEach(self.parent.proposals, function(proposal) {
                var departure_date = proposal.segment[0].flight[0].departure_date;
                angular.forEach(proposal.terms, function(term, term_id){
                    self.pick_price_one(departure_date, term.unified_price, 'normal');
                });
            });

            self.pricesArrayOne = [];
            for(var i=0; i<self.date_of_one['weeks']; i++){
                self.pricesArrayOne[i] = [];
                for(var j=0; j<7; j++){
                    // self.date_of_one['year']
                        //year, month, date, month_str, first_day, weeks
                    var cur_day = i*7+j-self.date_of_one['first_day']+1;
                    var cur_date = new Date(self.date_of_one['year'], self.date_of_one['month'], cur_day);
                    var cur_date_str = sprintf("%04d-%02d-%02d", cur_date.getFullYear(), cur_date.getMonth()+1, cur_date.getDate());
                    self.pricesArrayOne[i][j] = [];
                    if(cur_date.getMonth()==self.date_of_one['month']){
                        if(self.pricesArray[cur_date_str])
                            self.pricesArrayOne[i][j] = self.pricesArray[cur_date_str];
                        self.pricesArrayOne[i][j]['date'] = cur_date.getDate();
                    }
                    self.pricesArrayOne[i][j]['url'] = self.changeLocationDate("depart_date", cur_date_str, self.parent.location_url);
                }
            }
            self.depart_dates = self.getDateArray(self.depart_day);
            angular.forEach(self.depart_dates, function(depart_date){
                depart_date['url'] = self.changeLocationDate("depart_date", depart_date[1], self.parent.location_url);
                if(self.pricesArray[depart_date[1]])
                    depart_date['price'] = self.pricesArray[depart_date[1]].price;
            });
        };

        self.pick_price_one = function(departDate, value, class_str){
            if(!self.pricesArray[departDate] || self.pricesArray[departDate]>value){
                self.pricesArray[departDate] = [];
                self.pricesArray[departDate]['price'] = value;
                self.pricesArray[departDate]['class'] = class_str;
            }
        };
        
        $scope.display_data = function(priceData){
            angular.forEach(priceData.current_depart_date_prices, function(price){
                self.setPrices(price);
            });
            angular.forEach(priceData.best_prices, function(price){
                self.setPrices(price);
            });
            angular.forEach(self.parent.proposals, function(proposal) {
                var departure_date = proposal.segment[0].flight[0].departure_date;
                var flights = proposal.segment[Object.keys(proposal.segment).length-1].flight;
                var arrival_date = flights[Object.keys(flights).length-1].arrival_date;
                if(!self.pricesArray[departure_date])
                    self.pricesArray[departure_date] = [];
                angular.forEach(proposal.terms, function(term, term_id){
                    if(!self.pricesArray[departure_date][arrival_date]){
                        self.pricesArray[departure_date][arrival_date] = [];
                        self.pricesArray[departure_date][arrival_date]['price'] = 0;
                    }
                    if(self.pricesArray[departure_date][arrival_date]['price'] == 0 || self.pricesArray[departure_date][arrival_date]['price'] > term.unified_price){
                        self.pricesArray[departure_date][arrival_date]['price'] = term.unified_price;
                        self.pricesArray[departure_date][arrival_date]['class'] = 'normal';
                    }
                });
            });
            var now = new Date();
            self.depart_dates = self.getDateArray(self.depart_day);
            self.return_dates = self.getDateArray(self.return_day);

            angular.forEach(self.depart_dates, function(depart_date){
                if(self.pricesArray[depart_date[1]]==undefined)
                    self.pricesArray[depart_date[1]] = [];
                self.pricesArray[depart_date[1]]['min'] = [];
                self.pricesArray[depart_date[1]]['min']['url'] = self.changeLocationDate("depart_date", depart_date[1], self.parent.location_url);
                // if(self.pricesArray[depart_date[1]])
                angular.forEach(self.return_dates, function(return_date){
                    if(self.pricesArray[depart_date[1]][return_date[1]]==undefined){
                        self.pricesArray[depart_date[1]][return_date[1]] = [];
                        if(depart_date[0]<now || return_date[0]<now)
                            self.pricesArray[depart_date[1]][return_date[1]]['price'] = '-';
                        else
                            self.pricesArray[depart_date[1]][return_date[1]]['price'] = '?';
                        self.pricesArray[depart_date[1]][return_date[1]]['class'] = "unknown";
                        if(!self.pricesArray[depart_date[1]]['min']['price'])
                            self.pricesArray[depart_date[1]]['min']['url'] = self.changeLocationDate("return_date", return_date[1], self.pricesArray[depart_date[1]]['min']['url']);
                    }else{
                        if(!self.pricesArray[depart_date[1]]['min']['price'] || self.pricesArray[depart_date[1]]['min']['price']>self.pricesArray[depart_date[1]][return_date[1]]['price']){
                            self.pricesArray[depart_date[1]]['min']['price'] = self.pricesArray[depart_date[1]][return_date[1]]['price'];
                            self.pricesArray[depart_date[1]]['min']['date'] = depart_date[3] + '-' + return_date[3];
                            self.pricesArray[depart_date[1]]['min']['url'] = self.changeLocationDate("return_date", return_date[1], self.pricesArray[depart_date[1]]['min']['url']);
                        }
                    }
                    self.pricesArray[depart_date[1]][return_date[1]]['url'] = self.changeLocationDate("depart_date", depart_date[1], self.parent.location_url);
                    self.pricesArray[depart_date[1]][return_date[1]]['url'] = self.changeLocationDate("return_date", return_date[1], self.pricesArray[depart_date[1]][return_date[1]]['url']);
                });
            });
        };
        self.calendar = "mini_calendar";
        self.toggleBtnText = "SHOW CALENDAR";
        self.toggleCalendar = function(){
            self.calendar = self.calendar=="mini_calendar" ? "full_calendar" : "mini_calendar";
            self.toggleBtnText = self.calendar=="mini_calendar" ? "SHOW CALENDAR" : "CLOSE";
            self.calendar_description = self.calendar=="mini_calendar" ? "LOW FARE CALENDAR" : "Approximate prices per one adult passenger found for the last 48 hours";
        }
    }
 });
