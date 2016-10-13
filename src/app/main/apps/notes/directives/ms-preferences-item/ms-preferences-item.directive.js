(function ()
{
    'use strict';

    angular
        .module('app.notes')
        .controller('msPreferencesItemController', msPreferencesItemController)
        .directive('msPreferencesItem', msPreferencesItemDirective);

    /** @ngInject */
    function msPreferencesItemController($document, api)
    {
        var vm = this;
        var fontSizes = {
            '1': {
                fontSize  : 14,
                lineHeight: 19
            },
            '2': {
                fontSize  : 18,
                lineHeight: 28
            },
            '3': {
                fontSize  : 24,
                lineHeight: 36
            },
            '4': {
                fontSize  : 36,
                lineHeight: 48
            },
            '5': {
                fontSize  : 48,
                lineHeight: 60
            }
        };

        vm.element = [];
        vm.noFontResize = false;
        vm.isSaving=false;
        // Methods
        vm.updateDescriptionFontSize = updateDescriptionFontSize;
        vm.checkedChange = checkedChange;
        vm.addPreference = addPreference;
        vm.removePreference = removePreference;
        vm.saveProfile = saveProfile;
        vm.createGuid = createGuid;

        //////

        function checkedChange(checkItem)
        {
          vm.isSaving=true;
          if (checkItem.checked) {
            vm.addPreference(checkItem.PREFERENCE_TYPE, checkItem.PREFERENCE);
          }
          else {
            vm.removePreference(checkItem.PREFERENCE_TYPE, checkItem.PREFERENCE);
          }
        }

            function createGuid()
            {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            }


            function addPreference(type, preference) {
              api.profile.get({'profileId': vm.note.profileId, 'clientId': vm.note.clientId},

                  // Success
                  function (response)
                  {
                    var uuid = vm.createGuid();
                    response.preferences.push({"id": uuid, "preferenceType": type, "preference": preference });
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

            function removePreference(type, preference) {
              api.profile.get({'profileId': vm.note.profileId, 'clientId': vm.note.clientId},

                  // Success
                  function (response)
                  {

                    for(var i = 0; i < response.preferences.length; i++) {
                        if(response.preferences[i].preferenceType == type && response.preferences[i].preference == preference) {
                            response.preferences.splice(i, 1);
                        }
                    }
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
                      vm.isSaving=false;
                  },

                 // Error
                  function (response)
                 {
                   console.log('ERR');
                   console.error(response);
                 }
              );


            }

        function updateDescriptionFontSize()
        {
            if ( vm.noFontResize || !vm.note.description || vm.note.description === '' )
            {
                return;
            }

            var fontSize = '';
            var descWidth = Math.floor(vm.columnWidth - 52); // 48px paddings, + 4px tolerance
            var tmp = angular.element('<div style="visibility:hidden; font-size:10px;line-height: 10px;position:absolute;z-index:-1;white-space:pre-wrap;word-wrap: break-word;"></div>');
            tmp.appendTo($document.find('body'));

            fontSize = checkLineCount(sizeFromMaxWordCount());

            angular.element(vm.element).find('md-description').attr('font-size', fontSize);

            tmp.remove();

            function sizeFromMaxWordCount()
            {
                var words = vm.note.description.split(' ');

                var wordLengths = words.map(function (word)
                {
                    return tmp.text(word)[0].clientWidth;
                });

                var maxWordLength = Math.max.apply(Math, wordLengths);

                var maxPx = Math.floor((descWidth * 10) / maxWordLength);

                if ( maxPx < 18 )
                {
                    fontSize = 1;
                }
                else if ( 18 <= maxPx && maxPx < 24 )
                {
                    fontSize = 2;
                }
                else if ( 24 <= maxPx && maxPx < 36 )
                {
                    fontSize = 3;
                }
                else if ( 36 <= maxPx && maxPx < 48 )
                {
                    fontSize = 4;

                }
                else if ( maxPx >= 48 )
                {
                    fontSize = 5;
                }

                return fontSize;
            }

            function checkLineCount(sizeFromMaxWord)
            {
                var size = fontSizes[sizeFromMaxWord];
                var result;

                tmp.text(vm.note.description);
                tmp.width(descWidth);
                tmp.css({
                    'line-height': size.lineHeight + 'px',
                    'font-size'  : size.fontSize + 'px'
                });

                var lineCount = tmp[0].clientHeight / size.lineHeight;

                if ( 4 < lineCount && lineCount < 6 )
                {
                    result = 4;
                }
                else if ( 6 <= lineCount && lineCount < 9 )
                {
                    result = 3;
                }
                else if ( 9 <= lineCount && lineCount < 11 )
                {
                    result = 2;
                }
                else if ( 11 <= lineCount )
                {
                    result = 1;
                }
                else
                {
                    result = sizeFromMaxWord;
                }
                return result;
            }
        }
    }

    /** @ngInject */
    function msPreferencesItemDirective()
    {
        return {
            restrict        : 'A',
            controller      : 'msPreferencesItemController as MsPreferencesItem',
            templateUrl     : 'app/main/apps/notes/directives/ms-preferences-item/ms-preferences-item.html',
            require         : ['msPreferencesItem', '^msMasonry'],
            bindToController: {
                msPreferencesItem: '='
            },
            link            : function (scope, element, attributes, controllers)
            {

                var MsPreferencesItem = controllers[0];
                var msMasonry = controllers[1];

                MsPreferencesItem.element = element;
                MsPreferencesItem.note = MsPreferencesItem.msPreferencesItem;


                if ( angular.isDefined(attributes.noFontResize) )
                {
                    MsPreferencesItem.noFontResize = true;
                }

                scope.$watch('MsPreferencesItem.msPreferencesItem', function (newVal, oldVal)
                {
                    if ( newVal !== oldVal )
                    {
                        MsPreferencesItem.note = newVal;
                    }
                });

                scope.$on('msMasonryItem:startReLayout', function ()
                {
                    if ( MsPreferencesItem.noFontResize || MsPreferencesItem.columnWidth === msMasonry.columnWidth )
                    {
                        return;
                    }

                    MsPreferencesItem.columnWidth = msMasonry.columnWidth;

                    MsPreferencesItem.updateDescriptionFontSize();
                });
            }
        };
    }
})();
