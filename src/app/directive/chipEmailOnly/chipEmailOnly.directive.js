(function() {
    'use strict';

    angular
        .module('app.directives')
        .directive('chipEmailOnly', ChipEmailOnly);

    /** @ngInject */
    function ChipEmailOnly($mdToast) {
        return function (scope, element, attrs) {
            element.bind("keydown press", function (event) {
                if (event.which === 13) {
                    var chip = $(element).find(".md-chips").children(".md-chip");
                    var chipText = chip.last().find(".md-chip-content span").text();
                    var re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

                    if (re.test(chipText)) {
                        scope.email = chipText;
                        scope.$apply(attrs.chipEmailOnly);
                    } else {
                        chip.last().find(".md-chip-remove").click();
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">Only Email addresses can be accepted as Bcc.</md-toast>',
                            hideDelay: 6000,
                            position: 'top center'
                        });
                    }

                    event.preventDefault();
                }
            });
        }
    }
})();