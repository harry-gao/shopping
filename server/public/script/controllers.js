'use strict';

/* Controllers */

var shoppingAppControllers = angular.module('shoppingAppControllers', []);

shoppingAppControllers.controller('MyListCtrl', ['$scope', '$http', '_',
  function MyListCtrl($scope, $http) {

    $scope.list = [];
    $scope.query = '';

    $scope.addItem = function(){
      if($scope.newItem == '' || $scope.newItem == undefined)
        return;

      if(_.some($scope.list, function(item){
        return item.name == $scope.newItem;
      })){
       alert("item already exists in the list");
       return;
     }

     $scope.list.push({name:$scope.newItem, save:false});

     //reset newItem so the html input is cleared
     $scope.query = $scope.newItem;
     $scope.newItem = '';

      //set local storage
      localStorage.setItem($scope.query.itemlize(), undefined);

      $http.post('/promotion/post_query', {query: $scope.query}).success(successCallback);
    };

    $scope.removeItem = function(item){
      var obj = _.find($scope.list, function(element){
        return element.name == item;
      });
      var idx = _.indexOf($scope.list, obj);
      $scope.list.splice(idx, 1);

      //set local storage
      localStorage.removeItem(item.itemlize());
    };

    var	successCallback = function(data){
    	if(data.promotions.length == 0) return;

      var target = _.find($scope.list, function(item){
        return item.name == $scope.query;
      });
      target.save = true;
      localStorage.setItem($scope.query.itemlize(), JSON.stringify(data));

    };


    var init = function () {
      for(var obj in window.localStorage){
        if(obj.isItem())
        {
          var saving = localStorage[obj];
          if(saving == 'undefined'){
            $scope.list.push({name:obj.deItemlize(), save: false});
          }else{
            $scope.list.push({name:obj.deItemlize(), save: true});
          }
        }
      }
    };
      // and fire it after definition
      init(); 

    }]);

shoppingAppControllers.controller('PromotionDetailCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.item = $routeParams.itemId.itemlize();
    $scope.list = [];
    
    var init = function(){
      var obj = JSON.parse(localStorage[$scope.item]);
      $scope.list = obj['promotions'];
    };

    init();
  }]);
