var app = angular.module('angularexpressApp', []);

app.controller('appController', function($scope){
  $scope.user = 'Shawn';
  $scope.phone = '5197227689'
  $scope.song = 'Cant feel my face';
  $scope.mp3link = '.mp3';
  $scope.mp3submit = function(){
    $http.post('/call', {user: $scope.user, phone: $scope.phone, song: $scope.song, mp3link: $scope.mp3link})
       .success(function(data){
           //what to do here
       })
       .error(function(data){
           console.log('Error: ' + data);
       });
});
