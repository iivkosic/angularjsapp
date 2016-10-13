(function ()
{
    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($location, $q, SearchData, Timeline, About, Labels, LabelsNotes, PreferencesList, $stateParams, api, Auth, $filter, $mdSidenav)
    {
        var vm = this;

        vm.posts = Timeline.data;
        vm.activities = Timeline.activities;
        vm.about = About.data;

        //vm.timeline = Timeline.data;
        vm.getById = getById;
        vm.getByExternal = getByExternal;
        vm.getTimeline = getTimeline;
        vm.getKPI  = getKPI;
        vm.getScoreClass = getScoreClass;
        vm.getValueClass = getValueClass;
        vm.getCardClass = getCardClass;
        vm.getCardImage = getCardImage;
        vm.getIconClass = getIconClass;
        vm.getCustomerValue = getCustomerValue;
        vm.createAddressesWidget = createAddressesWidget;
        vm.createCommunicationsWidget = createCommunicationsWidget;
        vm.timelineLoadNextPage = timelineLoadNextPage;
        vm.filterChange = filterChange;
        vm.filterChangeNotes = filterChangeNotes;
        vm.toggleSidenav = toggleSidenav;
        //vm.toggleSidenavNotes = toggleSidenavNotes;
        vm.getPreferences = getPreferences;
        vm.onlyExistingTimelineDates = onlyExistingTimelineDates;
        vm.openLink = openLink;
        vm.scrollTo = scrollTo;
        vm.addTag = addTag;
        vm.deleteTag = deleteTag;
        vm.addPreference = addPreference;
        vm.saveProfile = saveProfile;
        vm.createGuid = createGuid;
        vm.transformChip = transformChip;
        vm.querySearch = querySearch;
        vm.createFilterFor = createFilterFor;
        vm.loadDefaultTags = loadDefaultTags;
        vm.getCompleteness = getCompleteness;
        vm.getCompletenessClass = getCompletenessClass;
        vm.labelFilterIds = "";
        vm.labelFilterIds_notes = "";
        vm.currentPage = 1;
        vm.totalPages = 1;
        vm.labels = Labels.data;
        vm.notes_labels = LabelsNotes.data;
        vm.preferencesList = PreferencesList.preferences;
        vm.preferenceNotes = [];
        vm.noteListType = "all";
        vm.noteListType_notes = "all";
        vm.clientId = 'ALILA';
        vm.isSaving=true;

        vm.myDate = new Date();
        vm.timelineDates = [];
        vm.defaultTags = vm.loadDefaultTags();



          /**
           * Return the proper object when the append is called.
           */
          function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
              vm.addTag(chip.name);
              return chip.name;
            }
            // Otherwise, create a new one
            vm.addTag(chip);
            return chip;
          }

          /**
           * Search for
           */
          function querySearch (query) {
            var results = query ? vm.defaultTags.filter(createFilterFor(query)) : [];
            return results;
          }
          /**
           * Create filter function for a query string
           */
          function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(x) {
              return (x._lowername.indexOf(lowercaseQuery) === 0);
            };
          }
          function loadDefaultTags() {

                var tags = [
                  {
                    'name': 'Alila Live'
                  },
                  {
                    'name': 'Team Alila'
                  },
                  {
                    'name': 'Corporate'
                  },
                  {
                    'name': 'Owners'
                  },
                  {
                    'name': 'KOL'
                  },
                  {
                    'name': 'Marketing Network'
                  },
                  {
                    'name': 'Media'
                  },
                  {
                    'name': 'Travel Partners'
                  },
                  {
                    'name': 'OTA'
                  },
                  {
                    'name': 'MICE'
                  },
                  {
                    'name': 'Wedding'
                  },
                  {
                    'name': 'Commune'
                  },
                  {
                    'name': 'Industry'
                  }
                ];
                return tags.map(function (t) {
                  t._lowername = t.name.toLowerCase();
                  return t;
                });
              }

        if ($stateParams.id ) {
          //vm.profileId = $stateParams.id;
          vm.getById($stateParams.id);
        }
        else if ($stateParams.resortId && $stateParams.externalProfileId ) {
          vm.resortId = $stateParams.resortId;
          vm.externalProfileId = $stateParams.externalProfileId;
          getByExternal(vm.resortId, vm.externalProfileId);
        }




        // Data

        // Methods

       function onlyExistingTimelineDates(date) {
          var items = vm.timelineDates.filter(function(i) {return i.date == date });
          return items.length>0;
        };

        function getPreferences(checked) {
          vm.preferenceNotes=[];

                  for (var i in vm.labels) {
                    var chk = $filter('filter')(vm.preferencesList, { PREFERENCE_TYPE: vm.labels[i].name});
                    for (var j in chk) {
                      for (var k in vm.profile.preferences) {
                        if (chk[j].PREFERENCE_TYPE == vm.profile.preferences[k].preferenceType
                          && chk[j].PREFERENCE == vm.profile.preferences[k].preference ) {
                                              chk[j].checked=true;

                          }

                      }
                    }
                    if (checked)
                      chk = $filter('filter')(chk, { checked: true});
                    vm.preferenceNotes.push({
                      "title": vm.labels[i].name,
                      "description": "",
                      "color": "white",
                      "checklist": chk,
                      "label": vm.labels[i].name,
                      "profileId": vm.profile.id,
                      "clientId": vm.clientId}
                    );
                  }

                  //console.log(vm.preferenceNotes);
        }


        function getIconClass(icon) {
            return 'icon ' + icon;;
        }

        function getScoreClass(percent) {
            if (percent<50) return 'graph-f';
            else if  (percent<75) return 'graph-r';
            else return 'graph-m';
        }

        function getValueClass(value) {
            if (value<50) return 'value-red';
            else if  (value<75) return 'value-yellow';
            else  return 'value-green';
        }

        function getCardClass(level) {
            if (level=="GOLD") return 'card-gold';
            else if  (level=="BLACK") return 'card-black';
            else if  (level=="RED") return 'card-red';
            else  return 'card-platinum';
        }

        function getCompletenessClass() {
          return 'avatar-container green p-av-' + vm.completeness;
        }

        function getCardImage(level) {
            return 'assets/images/logos/DISCOVERY-LOGO-' + level + '.png';
        }

        function getCustomerValue(objScore) {
          if (objScore) {
            var value = (objScore.frequency + objScore.recency + objScore.monetary) / 3;
            return Math.round(value);
          }
          else return 0;
        }

        function createAddressesWidget(addresses) {
          vm.addressWidget = {
              title: 'Addresses',
              tabs: []
            }
          for(var i in addresses) {
            vm.addressWidget.tabs.push(addresses[i]);
          }
        }

        function createCommunicationsWidget(communications) {
          vm.communicationsWidget = {
              title: 'Communications',
              tabs: []
            }
          for(var i in communications) {
            vm.communicationsWidget.tabs.push(communications[i]);
          }
        }

        function getById(id) {
          api.profile.get({'profileId': id, 'clientId': vm.clientId},

              // Success
              function (response)
              {
                  //console.log(response);
                  vm.profile = response;
                  var email = $filter('filter')(vm.profile.communications, { role: 'EMAIL', primary: true });
                  if (email && email[0]) {
                    vm.profile.email = email[0];
                  }
                  var phone = $filter('filter')(vm.profile.communications, { role: 'PHONE', primary: true });
                  if (phone && phone[0]) {
                    vm.profile.phone = phone[0];
                  }
                  vm.customerValue = vm.getCustomerValue(vm.profile.rfmScore);
                  vm.createAddressesWidget(vm.profile.addresses);
                  vm.createCommunicationsWidget(vm.profile.communications);

                  vm.getTimeline(id);
                  vm.getKPI(id);
                  vm.getPreferences(true);
                  vm.getCompleteness();
              },

             // Error
              function (response)
             {
               console.log('ERR');
               console.error(response);
             }
          );
        }





        function getByExternal(resortId, externalProfileId) {
          api.profile_ext.get({'resortId': resortId,'externalProfileId': externalProfileId, 'clientId': vm.clientId},

              // Success
              function (response)
              {
                  vm.profile = response;
                  var email = $filter('filter')(vm.profile.communications, { role: 'EMAIL', primary: true });
                  if (email[0]) {
                    vm.profile.email = email[0];
                  }
                  var phone = $filter('filter')(vm.profile.communications, { role: 'PHONE', primary: true });
                  if (phone[0]) {
                    vm.profile.phone = phone[0];
                  }
                  vm.customerValue = vm.getCustomerValue(vm.profile.rfmScore);
                  vm.createAddressesWidget(vm.profile.addresses);
                  vm.createCommunicationsWidget(vm.profile.communications);

                  vm.getTimeline(vm.profile.id);
                  vm.getKPI(vm.profile.id);
                  vm.getPreferences(false);
                  vm.getCompleteness();
              },

             // Error
              function (response)
             {
               console.log('ERR');
                 console.error(response);
             }
          );
        }


        function getCompleteness() {
          vm.completeness = 0;

          var address = $filter('filter')(vm.profile.addresses, { addressType: 'HOME', primary: true });
          if (vm.profile.first && vm.profile.first != "" ) vm.completeness += 20;
          if (vm.profile.last && vm.profile.last != "" ) vm.completeness += 20;
          if (vm.profile.email && vm.profile.email != "" ) vm.completeness += 30;
          if (vm.profile.birthDate && vm.profile.birthDate != "" ) vm.completeness += 5;
          if (address && address[0]) {
            if (address[0].city != "" ) vm.completeness += 10;
            if (address[0].country != "" ) vm.completeness += 10;
          }
          if (vm.profile.locale && vm.profile.locale.languageCode != "" )
            vm.completeness += 5;
        }


        function addTag(tag) {

          api.profile.get({'profileId': vm.profile.id, 'clientId': vm.clientId},

              // Success
              function (response)
              {
                if (!response.tags) {
                  response.tags=[];
                }
                response.tags.push(tag);
                vm.saveProfile(response);

                //vm.profile.tags.push(tag);
                //vm.newTag = '';
              },

             // Error
              function (response)
             {
               console.log('ERR');
                 console.error(response);
             }
            );
        }

        function deleteTag(tag) {
          api.profile.get({'profileId': vm.profile.id, 'clientId': vm.clientId},

              // Success
              function (response)
              {
                for(var i = 0; i < response.tags.length; i++) {
                    if(response.tags[i] == tag) {
                        response.tags.splice(i, 1);
                    }
                }
                vm.saveProfile(response);

                //vm.profile.tags.push(tag);
                //vm.newTag = '';
              },

             // Error
              function (response)
             {
               console.log('ERR');
                 console.error(response);
             }
            );
        }

        function createGuid()
        {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }


        function addPreference() {
          api.profile.get({'profileId': vm.profile.id, 'clientId': vm.clientId},

              // Success
              function (response)
              {
                var uuid = vm.createGuid();
                response.preferences.push({"id": uuid, "preferenceType": "INTERESTS", "preference": "NNA", });
                vm.saveProfile(response);

                // vm.profile.tags.push(vm.newTag);
                // vm.newTag = '';
              },

             // Error
              function (response)
             {
               console.log('ERR');
                 console.error(response);
             }
            );
        }

        function saveProfile(profile)
        {

          api.save_profile.post(profile,

              // Success
              function (response)
              {

              },

             // Error
              function (response)
             {
               console.log('ERR');
               console.error(response);
             }
          );


        }

        function scrollTo(date) {
            var old = $location.hash();
            var strDate = moment(date).format('YYYY-MM-DD');
            //var gotoDate= '';
            for (var i in vm.timelineDates) {
              if (strDate>=vm.timelineDates[i].str) {
                $location.hash(vm.timelineDates[i].str);
                $anchorScroll();
                //reset to old to keep any additional routing logic from kicking in
                $location.hash(old);
                return;
              }
            }

        };

        function getTimeline(profileId) {
          api.timeline.query({'profileId': profileId},

              // Success
              function (response)
              {
                vm.timelineDates = [];
                //vm.timeline = vm.posts;

                vm.timeline  = _.sortBy(response, 'time').reverse();

                //console.log(vm.timeline);
                for(var i in vm.timeline) {
                    var date = $filter('filter')(vm.timelineDates, { str: vm.timeline[i].time});
                    if (date.length==0) {
                      vm.timelineDates.push({str: vm.timeline[i].time, date: new Date(vm.timeline[i].time)});
                    }

                    if (vm.timeline[i].event == "Stay") {
                      vm.timeline[i].card.list = [];
                      if (vm.timeline[i].reservation) {
                        if (vm.timeline[i].reservation.arrival)
                          vm.timeline[i].card.list.push("Arrival: " + vm.timeline[i].reservation.arrival);
                        if (vm.timeline[i].reservation.departure)
                        vm.timeline[i].card.list.push("Departure: " + vm.timeline[i].reservation.departure);
                        if (vm.timeline[i].reservation.dailyElements && vm.timeline[i].reservation.dailyElements[0]) {
                          if (vm.timeline[i].reservation.dailyElements[0].adults != undefined)
                            vm.timeline[i].card.list.push("Adults: " + vm.timeline[i].reservation.dailyElements[0].adults);
                          if (vm.timeline[i].reservation.dailyElements[0].children != undefined)
                            vm.timeline[i].card.list.push("Children: " + vm.timeline[i].reservation.dailyElements[0].children);
                          if (vm.timeline[i].reservation.dailyElements[0].room && vm.timeline[i].reservation.dailyElements[0].room.description) {
                            vm.timeline[i].card.list.push("Room type: " + vm.timeline[i].reservation.dailyElements[0].room.description);
                          }
                          if (vm.timeline[i].reservation.dailyElements[0].sourceCode)
                            vm.timeline[i].card.list.push("Booking source: " + vm.timeline[i].reservation.dailyElements[0].sourceCode);
                          if (vm.timeline[i].reservation.dailyElements[0].rate && vm.timeline[i].reservation.dailyElements[0].rate.code) {
                            vm.timeline[i].card.list.push("Rate code: " + vm.timeline[i].reservation.dailyElements[0].rate.code);
                          }

                        }
                      }


                    }
                    else if (vm.timeline[i].event == "Email") {
                      vm.timeline[i].card.emailLink = "http://api02.hotmark-crm.com/api/v1/campaigns/preview/EOJ8c1YW3ng%3D/" +
                        vm.timeline[i].messageInfoResponse._id;
                    }

                }

              if (vm.timelineDates.length>0 == "Stay") {
                  vm.maxTimelineDate =
                      vm.timelineDates[0].date;

                  vm.minTimelineDate =
                    vm.timelineDates[vm.timelineDates.length-1].date;
                }

              },

             // Error
              function (response)
             {
               console.log('ERR');
               console.error(response);
             }
          );
        }

        function openLink(link) {
           $window.open(link, '_blank');

        }

        function getKPI(profileId) {

var data = '{ \
    "size": 0, \
    "query": { \
        "match": { \
          "profileId": "' + profileId + '" \
        } \
      }, \
    "aggs": { \
      "Reservations": { \
        "nested": { \
          "path": "dailyElements" \
        }, \
        "aggs": { \
          "sumRoomRevene": { \
            "sum": { \
              "field": "dailyElements.roomRevenue" \
            } \
          }, \
          "avgRate": { \
            "avg": { \
              "field": "dailyElements.roomRevenue" \
            } \
          }, \
          "sumTotalRevenue": { \
            "sum": { \
              "field": "dailyElements.totalRevenue" \
            } \
          }, \
          "sumFoodRevenue": { \
            "sum": { \
              "field": "dailyElements.foodRevenue" \
            } \
          }, \
          "sumOtherRevenue": { \
            "sum": { \
              "field": "dailyElements.otherRevenue" \
            } \
          } \
        } \
      }, \
       "group_by_status": { \
        "terms": { \
          "field": "resvStatus" \
        } \
       }, \
       "distinct_hotels" : { \
                "cardinality" : { \
                  "field" : "externalId.resortId" \
                } \
            } \
    } \
  } ';

          api.kpi2.post({}, data,

              // Success
              function (response)
              {
                  vm.kpi= response;

                  vm.stays = ($filter('filter')(vm.kpi.aggregations.group_by_status.buckets, { key: "CHECKED OUT" }));
                  vm.cancel =  ($filter('filter')(vm.kpi.aggregations.group_by_status.buckets, { key: "CANCELLED" }));
                  vm.stays_upc = ($filter('filter')(vm.kpi.aggregations.group_by_status.buckets, { key: "RESERVED" }));
                  vm.no_show = ($filter('filter')(vm.kpi.aggregations.group_by_status.buckets, { key: "NO SHOW" }));

                  vm.room_revenue = (vm.kpi.aggregations.Reservations.sumRoomRevene.value ?
                    vm.kpi.aggregations.Reservations.sumRoomRevene.value * 0.015014 : 0).toFixed(2);
                  vm.food_revenue = (vm.kpi.aggregations.Reservations.sumFoodRevenue.value ?
                    vm.kpi.aggregations.Reservations.sumFoodRevenue.value * 0.015014 : 0).toFixed(2);
                  vm.other_revenue = (vm.kpi.aggregations.Reservations.sumOtherRevenue.value ?
                    vm.kpi.aggregations.Reservations.sumOtherRevenue.value * 0.015014 : 0).toFixed(2);
                  vm.total_revenue = (vm.kpi.aggregations.Reservations.sumTotalRevenue.value ?
                    vm.kpi.aggregations.Reservations.sumTotalRevenue.value * 0.015014 : 0).toFixed(2);
                  vm.avgRate = (vm.kpi.aggregations.Reservations.avgRate.value ?
                    vm.kpi.aggregations.Reservations.avgRate.value * 0.015014 : 0).toFixed(2);
              },

             // Error
              function (response)
             {
               console.log('ERR');
               console.error(response);
             }
          );
        }

        function timelineLoadNextPage(){
                    // Create a new deferred object
                    var deferred = $q.defer();

                    // Reject the promise
                    deferred.reject('No more pages');

                    return deferred.promise;
                }


                        /**
                         * Change Notes Filter
                         * @param type
                         */
                        function filterChange(type)
                        {

                          vm.noteListType = "all";

                        if ( type === 'labels-all' ){
                              vm.labelFilterIds = "";
                          }
                          else if ( type === 'checked-all' )
                          {
                              vm.getPreferences(false);
                          }
                          else if ( type === 'checked-yes' )
                          {
                              vm.getPreferences(true);
                          }
                          else if ( angular.isObject(type) )
                            {
                                //vm.labelFilterIds = [];
                                vm.labelFilterIds = type.name;
                                vm.noteListType = type;
                            }


                            $mdSidenav('main-sidenav').close();

                        }
                        /**
                         * Change Notes Filter
                         * @param type
                         */
                        function filterChangeNotes(type)
                        {

                          vm.noteListType_notes = "all";

                        if ( type === 'labels-all' ){
                              vm.labelFilterIds_notes = "";
                          }
                          else if ( angular.isObject(type) )
                            {
                                //vm.labelFilterIds = [];
                                vm.labelFilterIds_notes = type.key;
                                vm.noteListType_notes = type;
                            }


                            $mdSidenav('main-sidenav-notes').close();

                        }
      /**
       * Toggle sidenav
       *
       * @param sidenavId
       */
      function toggleSidenav(sidenavId)
      {
          $mdSidenav(sidenavId).toggle();
      }

        //////////
    }

})();
