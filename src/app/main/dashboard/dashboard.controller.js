(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController(api)
    {
        var vm = this;

        // Data
        //vm.dashboardData = DashboardData;
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];


        // Widget 6
                vm.widgetTags = {
                    title       : 'Tags distribution',
                    mainChart   : {
                        config : {
                            refreshDataOnly: true,
                            deepWatchData  : true
                        },
                        options: {
                            chart: {
                                type        : 'pieChart',
                                //color       : ['#f44336', '#9c27b0', '#03a9f4', '#e91e63'],
                                height      : 400,
                                margin      : {
                                    top   : 0,
                                    right : 0,
                                    bottom: 0,
                                    left  : 0
                                },
                                donut       : true,
                                clipEdge    : true,
                                cornerRadius: 0,
                                labelType   : 'key',
                                padAngle    : 0.01,
                                x           : function (d)
                                {
                                    return d.key;
                                },
                                y           : function (d)
                                {
                                    return d.doc_count;
                                },
                                tooltip     : {
                                    gravity: 's',
                                    classes: 'gravity-s'
                                }
                            }
                        },
                        data   : []
                    }
                  };

        vm.widget4 =
        {
                "title": "Guests",
                "groups": [
                    {
                        "title": "Gender",
                        "data": [
                            {
                                "title": "Female",
                                "value": 45,
                                "progressColor": "md-primary"
                            },
                            {
                                "title": "Male",
                                "value": 41,
                                "progressColor": "md-primary"
                            },
                            {
                                "title": "Not Specified",
                                "value": 12,
                                "progressColor": "md-primary"
                            }
                        ]
                    },
                    {
                        "title": "Age",
                        "data": [
                            {
                                "title": "<30",
                                "value": 0,
                                "progressColor": "md-warn"
                            },
                            {
                                "title": "30 - 50",
                                "value": 0,
                                "progressColor": "md-warn"
                            },
                            {
                                "title": "50+",
                                "value": 0,
                                "progressColor": "md-warn"
                            }
                        ]
                    },
                    {
                        "title": "Stays",
                        "total": 89720,
                        "data": [
                            {
                                "title": "< 20",
                                "count": 41345,
                                "value": 46,
                                "progressColor": "md-accent"
                            },
                            {
                                "title": "20 - 50",
                                "count": 30254,
                                "value": 34,
                                "progressColor": "md-accent"
                            },
                            {
                                "title": "50+",
                                "count": 18121,
                                "value": 20,
                                "progressColor": "md-accent"
                            }
                        ]
                    }
                ]
            }

        // Methods
        vm.getTags = getTags;
        vm.getTags();

        vm.getAge = getAge;
        vm.getAge();

        vm.getGender = getGender;
        vm.getGender();

        vm.getMap = getMap;
        vm.getMap();
        //////////

        // Widget 2
        // uiGmapGoogleMapApi.then(function ()
        // {
        //     vm.widget2.map = vm.dashboardData.widget2.map;
        // });

      function getTags() {

        var data = '{"query": { \
          "match": { \
            "clientId": "ALILA" \
          }}, \
        "size": 0, \
        "aggs": { \
          "tags": { \
            "terms": { \
              "field": "tags" \
            } \
          } \
        } \
      }';

          api.proxy.post({}, data,

              // Success
              function (response)
              {
                  //vm.tags= response.aggregations.tags.buckets;
                  vm.widgetTags.mainChart.data = response.aggregations.tags.buckets;

              },

             // Error
              function (response)
             {
               console.log('ERR');
               console.error(response);
             }
          );
        }

        function getAge() {

          var data = '{"query": { \
            "match": { \
              "clientId": "ALILA" \
            }}, \
          "size": 0, \
          "aggs" : {  \
                 "articles_over_time" : { \
                  "date_histogram" : { \
                  "field" : "birthDate", \
                 "interval" : "year" \
              } \
            } \
          } \
        }';

            api.proxy.post({}, data,

                // Success
                function (response)
                {
                    //vm.tags= response.aggregations.tags.buckets;
                    //vm.widgetTags.mainChart.data = response.aggregations.tags.buckets;
                     //console.log(response);
                     var age1 =0;
                     var age2 = 0;
                     var age3 = 0;
                     var total = response.hits.total;
                     for (var i in response.aggregations.articles_over_time.buckets) {
                       var b = response.aggregations.articles_over_time.buckets[i];
                       var diff =  moment().diff(moment(b.key_as_string),"years");
                       if (diff<30) age1=age1+b.doc_count;
                       else if (diff>=30 && diff<50) age2=age2+b.doc_count;
                       else age3=age3+b.doc_count;
                     }
                     if (total > 0) {
                       vm.widget4.groups[1].total = total;
                       vm.widget4.groups[1].data[0].value = Math.round(100 * age1 / (total));
                       vm.widget4.groups[1].data[1].value = Math.round(100 * age2 / (total));
                       vm.widget4.groups[1].data[2].value = Math.round(100 * age2 / (total));
                       vm.widget4.groups[1].data[0].count =  age1;
                       vm.widget4.groups[1].data[1].count =  age2;
                       vm.widget4.groups[1].data[2].count =  age3;
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

          function getGender() {

            var data = '{"query": { \
              "match": { \
                "clientId": "ALILA" \
              }}, \
            "size": 0, \
            "aggs": { \
              "tags": { \
                "terms": { \
                  "field": "gender" \
                } \
              } \
            } \
          }';

              api.proxy.post({}, data,

                  // Success
                  function (response)
                  {
                      //vm.tags= response.aggregations.tags.buckets;
                      //vm.widgetTags.mainChart.data = response.aggregations.tags.buckets;
                       //console.log(response);
                       var g1 =0;
                       var g2 = 0;
                       var g3 = 0;
                       var total = response.hits.total;
                       for (var i in response.aggregations.tags.buckets) {
                         var b = response.aggregations.tags.buckets[i];
                         if (b.key=="f") g1=g1+b.doc_count;
                         else if (b.key=="m") g2=g2+b.doc_count;
                         else g3=g3+b.doc_count;
                       }
                       if (total > 0) {
                         vm.widget4.groups[0].total = total;
                         vm.widget4.groups[0].data[0].value = Math.round(100 * g1 / (total));
                         vm.widget4.groups[0].data[1].value = Math.round(100 * g2 / (total));
                         vm.widget4.groups[0].data[2].value = Math.round(100 * g3 / (total));
                         vm.widget4.groups[0].data[0].count =  g1;
                         vm.widget4.groups[0].data[1].count =  g2;
                         vm.widget4.groups[0].data[2].count =  g3;
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

        function getMap() {

          var data = '{ \
              \
             "query": { \
              "match": { \
                "clientId": "ALILA"  \
              } \
            }, \
            "size":0, \
            "aggregations": { \
              "countries": { \
                "nested": { \
                  "path": "addresses" \
                }, \
                "aggs": { \
                  "cars": { \
                    "terms": { \
                      "field": "addresses.country" \
                    } \
                  } \
                } \
              } \
            } \
          }';

            api.proxy.post({}, data,

                // Success
                function (response)
                {

                  var chart1 = {};
                   chart1.type = "GeoChart";
                   chart1.data = [
                     ['Country', 'Budget'],
                     ["ID", 48420],
                     ["JP", 2988],
                     ["SG", 2767],
                     ["US", 2683],
                     ["NL", 2222],
                     ["CN", 1866],
                     ["MY", 1838],
                     ["ZZ", 1417],
                     ["DE", 1074],
                     ["KR", 708],
                   ];

                   chart1.options = {
                     chartArea: {left:10,top:10,bottom:0,height:"100%"},
                     colorAxis: {colors: ['#aec7e8', '#1f77b4']},
                     displayMode: 'regions'
                   };

                  //  chart1.formatters = {
                  //    number : [{
                  //      columnNum: 1,
                  //      pattern: "$ #,##0.00"
                  //    }]
                  //  };

                   vm.chart = chart1;

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
