(function ()
{
    'use strict';

    angular
        .module('app.search')
        .controller('ProfileDialogController', ProfileDialogController);

    /** @ngInject */
    function ProfileDialogController($mdDialog, Countries, msUtils, api, $location)
    {
        var vm = this;
        vm.countries = Countries;

        console.log(vm.countries);
        vm.horizontalStepper = {
            step1: {},
            step2: {},
            step3: {}

        };

        // Data
        vm.title = 'Edit Profile';
        // vm.contact = angular.copy(Contact);
         vm.contacts = [];
        // vm.user = User;
        vm.newContact = false;
        vm.allFields = false;
        vm.contact = false;

        if ( !vm.contact )
        {
            vm.contact = {
                'first'    : '',
                'last': '',
            };

            vm.title = 'New Contact';
            vm.newContact = true;
            //vm.contact.tags = [];
        }

        // Methods
        vm.addNewContact = addNewContact;
        vm.saveContact = saveContact;
        vm.deleteContactConfirm = deleteContactConfirm;
        vm.closeDialog = closeDialog;
        vm.submitHorizontalStepper = submitHorizontalStepper;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;
        vm.createGuid = createGuid;

        //////////


        /**
         * Submit horizontal stepper data
         * @param event
         */
        function submitHorizontalStepper(event)
        {
            // Show the model data in a dialog
            //vm.showDataDialog(event, vm.horizontalStepper);

            vm.new_profile = {'first': vm.horizontalStepper.step1.first,'last': vm.horizontalStepper.step1.last, 'clientId': 'ALILA' };
            if (vm.horizontalStepper.step2.address1 || vm.horizontalStepper.step2.address2 || vm.horizontalStepper.step2.city
              || vm.horizontalStepper.step2.country) {
                var uuid = vm.createGuid();
                vm.new_profile.addresses = [];
                var address = {'id': uuid , 'addressType': 'HOME','address1': vm.horizontalStepper.step2.address1,'address2': vm.horizontalStepper.step2.address2,
                 'city': vm.horizontalStepper.step2.city,'country': vm.horizontalStepper.step2.country, 'primary': true};
                vm.new_profile.addresses.push(address);
              }
              vm.new_profile.communications = [];
              if (vm.horizontalStepper.step3.phone) {
                var uuid = vm.createGuid();
                var phone = {'id': uuid , 'role': 'PHONE', 'type': 'HOME','value': vm.horizontalStepper.step3.phone, 'primary': true};
                vm.new_profile.communications.push(phone);
              }
              if (vm.horizontalStepper.step3.email) {
                var uuid = vm.createGuid();
                var email = {'id': uuid , 'role': 'EMAIL', 'type': 'EMAIL','value': vm.horizontalStepper.step3.email, 'primary': true};
                vm.new_profile.communications.push(email);
              }
              if (vm.horizontalStepper.step3.mobile) {
                var uuid = vm.createGuid();
                var mobile = {'id': uuid , 'role': 'MOBILE', 'type': 'MOBILE','value': vm.horizontalStepper.step3.mobile, 'primary': true};
                vm.new_profile.communications.push(mobile);
              }

              vm.horizontalStepper = {
                  step1: {},
                  step2: {},
                  step3: {}
              };
              api.save_profile.post(vm.new_profile,

                  // Success
                  function (response)
                  {
                      $location.path( '/profile').search({id: response.profileId});
                  },

                 // Error
                  function (response)
                 {
                   console.log('ERR');
                   console.error(response);
                 }
              );

              vm.horizontalStepper = {
                  step1: {},
                  step2: {},
                  step3: {}
              };
              closeDialog();
            // Reset the form model

        }


        function createGuid()
        {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        /**
         * Add new contact
         */
        function addNewContact()
        {

          api.save_profile.post({'first': vm.contact.first,'last': vm.contact.last, 'clientId': 'ALILA' },

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


            closeDialog();
        }

        /**
         * Save contact
         */
        function saveContact()
        {
            // Dummy save action
            for ( var i = 0; i < vm.contacts.length; i++ )
            {
                if ( vm.contacts[i].id === vm.contact.id )
                {
                    vm.contacts[i] = angular.copy(vm.contact);
                    break;
                }
            }

            closeDialog();
        }

        /**
         * Delete Contact Confirm Dialog
         */
        function deleteContactConfirm(ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the contact?')
                .htmlContent('<b>' + vm.contact.name + ' ' + vm.contact.lastName + '</b>' + ' will be deleted.')
                .ariaLabel('delete contact')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                vm.contacts.splice(vm.contacts.indexOf(Contact), 1);

            });
        }

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }

    }
})();
