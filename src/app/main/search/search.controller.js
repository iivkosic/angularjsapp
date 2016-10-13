(function ()
{
    'use strict';


    angular
        .module('app.search')
        .controller('SearchController', SearchController);

        // angular.element(document).ready(function () {
        //   angular.element( '.dataTables_filter' ).addClass('col-md-9');
        // });

    /** @ngInject */
    function SearchController( Countries, DTOptionsBuilder, $location, api, Auth, $filter, msUtils,  $mdDialog, $document)
    {
        var vm = this;
        vm.dtInstance = {};
        vm.advancedSearch = false;
        vm.select = select;
        vm.countries = Countries.data;
        vm.search_profiles = search_profiles;
        vm.advanced_search_profiles = advanced_search_profiles;
        vm.getValueClass = getValueClass;
        vm.getCustomerValue = getCustomerValue;
        vm.openProfileDialog = openProfileDialog;

      //var clientId = Auth.authz.idTokenParsed.clientId;
      //vm.clientId = clientId;
      vm.clientId = 'ALILA';

      vm.search_profiles('*', true);

      //vm.profiles = $filter('filter')(vm.search, { profileId: vm.profileId });
        vm.dtOptions = DTOptionsBuilder.newOptions()
                .withLanguage({
                    "sEmptyTable":     "No data available in table",
                    "sInfo":           "Showing _START_ to _END_ of _TOTAL_ entries",
                    "sInfoEmpty":      "Showing 0 to 0 of 0 entries",
                    "sInfoFiltered":   "(filtered from _MAX_ total entries)",
                    "sInfoPostFix":    "",
                    "sInfoThousands":  ",",
                    "sLengthMenu":     "Show _MENU_ entries",
                    "sLoadingRecords": "Loading...",
                    "sProcessing":     "Processing...",
                    "sSearch":         "",
                    "sZeroRecords":    "No matching records found",
                    "oPaginate": {
                        "sFirst":    "First",
                        "sLast":     "Last",
                        "sNext":     "Next",
                        "sPrevious": "Previous"
                    },
                    "oAria": {
                        "sSortAscending":  ": activate to sort column ascending",
                        "sSortDescending": ": activate to sort column descending"
                    }
                })
                .withOption('bFilter', false);
                // .withOption('initComplete', function() {
                //       angular.element('.dataTables_filter input').attr('placeholder', 'Who are you searching for?');
                //       });

                /**
                       * Open new contact dialog
                       *
                       * @param ev
                       * @param contact
                       */
                      function openProfileDialog(ev)
                      {
                          $mdDialog.show({
                              controller         : 'ProfileDialogController',
                              controllerAs       : 'vm',
                              templateUrl        : 'app/main/search/dialogs/profile/profile-dialog.html',
                              parent             : angular.element($document.find('#content-container')),
                              targetEvent        : ev,
                              clickOutsideToClose: true,
                              locals             : {
                                  Countries : vm.countries
                                  // Contact : contact,
                                  // User    : vm.user,
                                  // Contacts: vm.contacts
                              }
                          });
                      }

                      function getValueClass(percent) {
                          if (percent<50) return 'graph-list-01';
                          else if  (percent<75) return 'graph-list-02';
                          else return 'graph-list-03';
                      }

                      function getCustomerValue(objScore) {
                        var value = (objScore.frequency + objScore.recency + objScore.monetary) / 3;
                          return Math.round(value);
                      }

                      function select(id)
                      {

                        $location.path( '/profile').search({id: id});
                          //console.log('selected'+id)
                      }

                      function advanced_search_profiles() {
                        if (vm.first == "") vm.first = null;
                        if (vm.last == "") vm.last = null;
                        if (vm.city == "") vm.city = null;
                        if (vm.country == "") vm.country = null;
                        if (vm.email == "") vm.email = null;
                        if (vm.cardNumber == "") vm.cardNumber = null;
                        if (vm.level == "") vm.level = null;
                        if (vm.enrollmentCode == "") vm.enrollmentCode = null;
                        if (vm.resortId == "") vm.resortId = null;
                        if (vm.preference == "") vm.preference = null;
                        if (vm.tags == "") vm.tags = null;

                        api.advanced_search.get({
                          'first': vm.first, 'last': vm.last, 'city': vm.city, 'country': vm.country, 'email': vm.email,
                            'cardNumber': vm.cardNumber, 'level': vm.level, 'enrollmentCode': vm.enrollmentCode, 'resortId': vm.resortId,
                            'preference': vm.preference, 'tags': vm.tags, 'clientId': vm.clientId},

                            // Success
                            function (response)
                            {
                              //console.log(response.profiles);
                                vm.profiles = response.profiles;
                                for(var i in vm.profiles) {
                                  var p = $filter('filter')(vm.profiles[i].communications, { role: 'EMAIL' });
                                  if (p && p[0]) {
                                    vm.profiles[i].email = p[0].value;
                                  }
                                  vm.profiles[i].completeness = 0;

                                  var address = $filter('filter')(vm.profiles[i].addresses, { addressType: 'HOME', primary: true });
                                  if (vm.profiles[i].first && vm.profiles[i].first != "" ) vm.profiles[i].completeness += 20;
                                  if (vm.profiles[i].last && vm.profiles[i].last != "" ) vm.profiles[i].completeness += 20;
                                  if (vm.profiles[i].email && vm.profiles[i].email != "" ) vm.profiles[i].completeness += 30;
                                  if (vm.profiles[i].birthDate && vm.profiles[i].birthDate != "" ) vm.profiles[i].completeness += 5;
                                  if (address && address[0]) {
                                    if (address[0].city != "" ) vm.profiles[i].completeness += 10;
                                    if (address[0].country != "" ) vm.profiles[i].completeness += 10;
                                  }
                                  if (vm.profiles[i].locale && vm.profiles[i].locale.languageCode != "" )
                                    vm.profiles[i].completeness += 5;

                                }
                                vm.dtInstance.rerender();
                              },

                              // Error
                              function (response)
                              {
                               console.log('ERR');
                                 console.error(response);
                              }
                              );
                              }


                      function search_profiles(name, init)
                      {
                        init = typeof init !== 'undefined' ? init : false;
                        //var name = vm.searchName;
                        if (vm.searchName == '') name = "*";

                        api.search.get({'q': name, 'clientId': vm.clientId},

                            // Success
                            function (response)
                            {
                              //console.log(response.profiles);
                                vm.profiles = response.profiles;
                                for(var i in vm.profiles) {
                                  var p = $filter('filter')(vm.profiles[i].communications, { role: 'EMAIL' });
                                  if (p && p[0]) {
                                    vm.profiles[i].email = p[0].value;
                                  }
                                  vm.profiles[i].completeness = 0;

                                  var address = $filter('filter')(vm.profiles[i].addresses, { addressType: 'HOME', primary: true });
                                  if (vm.profiles[i].first && vm.profiles[i].first != "" ) vm.profiles[i].completeness += 20;
                                  if (vm.profiles[i].last && vm.profiles[i].last != "" ) vm.profiles[i].completeness += 20;
                                  if (vm.profiles[i].email && vm.profiles[i].email != "" ) vm.profiles[i].completeness += 30;
                                  if (vm.profiles[i].birthDate && vm.profiles[i].birthDate != "" ) vm.profiles[i].completeness += 5;
                                  if (address && address[0]) {
                                    if (address[0].city != "" ) vm.profiles[i].completeness += 10;
                                    if (address[0].country != "" ) vm.profiles[i].completeness += 10;
                                  }
                                  if (vm.profiles[i].locale && vm.profiles[i].locale.languageCode != "" )
                                    vm.profiles[i].completeness += 5;
                                  //console.log(vm.profiles[i]);
                                //   if (vm.profiles[i].rfmScore) {
                                //    vm.profiles[i].customerValue = vm.getCustomerValue(vm.profiles[i].rfmScore);
                                //  }
                                  //console.log(vm.profiles[i]);
                                }
                                if (!init) vm.dtInstance.rerender();
                            },

                           // Error
                            function (response)
                           {
                             console.log('ERR');
                               console.error(response);
                           }
                       );
                      }
    }
})();
