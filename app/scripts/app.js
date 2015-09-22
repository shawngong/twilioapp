var app = angular.module('angularexpressApp', ['ngFileUpload']);

app.controller('appController', function($scope, $http, $timeout, Upload){
  $scope.user = 'Shawn';
  $scope.phone = '5197227689'
  $scope.song = 'Cant feel my face';
  $scope.mp3link = 'http://k001.kiwi6.com/hotlink/vkv5knigl7/The_Weeknd_-_Cant_Feel_My_Face_Audio_.mp3';
  $scope.show = true;
  $scope.mp3submit = function(){
    $http.post('/call', {user: $scope.user, phone: $scope.phone, song: $scope.song, mp3link: $scope.mp3link})
       .success(function(){
           $scope.show = false;
           $http.get('/call').success(function(){}).error(function(){});
      })
       .error(function(){
           console.log('Error');
       });
     };
  $scope.mp3reset = function(){
    $scope.show = true;
  };
  $scope.uploadFiles = function(file) {
        $scope.f = file;
        if (file && !file.$error) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                file: file
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            });

            file.upload.progress(function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                                       evt.loaded / evt.total));
            });
        }
    };
});
