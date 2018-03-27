/***************************************************************************
   Copyright 2017 OSIsoft, LLC.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 ***************************************************************************/

(function (PV) {    
   'use strict';    
  
   var def = {  
      typeName: 'playback',  
      displayName: 'Playback',  
      iconUrl: 'Images/chrome.custom_addin_crossed_tools.svg',  
      inject: [ 'timeProvider', '$interval' ],  
      init: init  
   };    
  
   function init(scope, elem, timeProvider, $interval) {  
  
      scope.options = {  
         numberOfIncrements: 3,  
         increaseIncrementTime: '1',  
         incrementTimer: 2000,
         fixedStart: false
      };  
  
      scope.isRunning = false;  
      var timeFormat = "YYYY/MM/DDTHH:mm:ss.SSSZ";
      // create a variable to hold the return value from $interval for canceling  
      var intervalTimer;  
      scope.start = function() {  
         scope.isRunning = true;  
  
         // call the $interval function with a function that will be executed each time the timer is called  
         // the next 2 parameters are how often it should run the function and how many times it should run the function  
         intervalTimer = $interval(function(count) {  
            var newStartTime = moment(timeProvider.getServerStartTime(), timeFormat);
            var newEndTime = moment(timeProvider.getServerEndTime(), timeFormat);
            if (!scope.options.fixedStart) {
                newStartTime = newStartTime.add(scope.options.increaseIncrementTime, "seconds");
            }
            newEndTime = newEndTime.add(scope.options.increaseIncrementTime, "seconds");         
            timeProvider.requestNewTime(  
               newStartTime.format("YYYY/MM/DDTHH:mm:ss.SSS"),   
               newEndTime.format("YYYY/MM/DDTHH:mm:ss.SSS"),  
               true);  
            // if we are on the last increment, flip the isRunning flags  
            if(count === scope.options.numberOfIncrements - 1) {  
                 scope.isRunning = false;  
            }  
         }, scope.options.incrementTimer, scope.options.numberOfIncrements);  
      };  
  
      scope.stop = function() {  
         // when stop is pressed cancel the interval timer  
         $interval.cancel(intervalTimer);  
         scope.isRunning = false;  
      };    
   }  
  
   PV.toolCatalog.register(def);    
    
})(window.PIVisualization);   