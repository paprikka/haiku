angular.module('pl.paprikka.haiku.services.remote', ['app.common.webSockets']).service('Remote', [
  'WebSockets', '$rootScope', function(WebSockets, $rootScope) {
    var socket;
    console.log('Remote::init');
    socket = WebSockets.connect('http://haiku-hub.herokuapp.com:80');
    return socket.on('remote', function(data) {
      console.log(data);
      return $rootScope.$emit('remote:control', data);
    });
  }
]);
