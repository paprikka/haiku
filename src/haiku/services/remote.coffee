angular.module('pl.paprikka.haiku.services.remote', ['app.common.webSockets']).service('Remote', [
  'WebSockets'
  '$rootScope'
  ( WebSockets, $rootScope) ->
    console.log 'Remote::init'
    socket = WebSockets.connect 'http://haiku-hub.herokuapp.com:80'
    socket.on 'remote', (data) ->
      console.log data
      $rootScope.$emit 'remote:control', data
])