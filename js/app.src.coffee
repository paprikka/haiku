'use strict'

### Controllers ###


#  ## Main Application Controller
angular.module('app.controllers', [])
.controller('AppCtrl', [
  
  '$scope'
  '$location'
  '$rootScope'
  'Modal'


  ($scope, $location, $rootScope, Modal) ->


    $scope.application =
      initialized: yes


    # TODO: add generic error messages
    # $scope.onError = (data)-> 
    #   Modal.alert 'Something went wrong :(', 'An unexpected error has occured. You can still use your Haikµ locally, but some viewers might be out of sync. '
        
    # $rootScope.$on 'haiku:error', $scope.onError






    # TODO: enable watch unit testing on Karma

    # 1. Uses the url to determine if the selected
    # menu item should have the class `active`.
    # 2. Add $location ref to scope, so it could be watched
    $scope.$location = $location

    $scope.activeNavId = '/'
    setActiveNavId = (path) -> $scope.activeNavId = path or '/'

    $scope.$watch '$location.path()', setActiveNavId

    # Improved agular-seed version, runs even if no path was invoked yet.
    $scope.getClass = (id) ->
      if $scope.activeNavId?.substring(0, id.length) is id
        'active'
      else
        ''

]).run()

angular.module('app.common.directives.CopyOnSelect', []).directive('copyOnSelect', [
  ->
    restrict: 'A'
    link: (scope, elm, attr)->
      elm.on 'focus', (e) ->
        _.defer => this.select()
    
    

])
angular.module("app.common.services.Modal", ['ui.bootstrap', 'ui.bootstrap.tpls'])
.service('Modal', [
  '$modal'
  ($modal)->
    window.m = $modal

    methods =
      alert : (title, body, icon)->
        alertCtrl = ($scope, $modalInstance, data) ->
          $scope.data = data
          $scope.close = -> $modalInstance.dismiss 'close'
          $scope.getIconClass = ->
            if data.icon 
              'icon-' + data.icon 
            else 
              ''


        modalInstance = $modal.open
          templateUrl: 'common/partials/modals/alert.html'
          controller: alertCtrl
          resolve:
            data: -> 
              title: title or 'Message'
              body: body
              icon: icon

        modalInstance.result.then ->


    _.extend $modal, methods
])
.service('ModalDefaults', ->
  settings = 
    buttons:
      yesNo: [
        {label: 'No', result: no, cssClass: 'btn--default'}
        {label: 'Yes', result: yes, cssClass: 'btn--positive'}
      ]
)

angular.module('app.common.services.Notify', []).factory 'Notify', -> 
  toastr.options.positionClass = 'toast-bottom-right'
  toastr.options.hideDuration = 2
  window.toastr
angular.module('app.common.services.pageState', []).service( 'PageState', [

  '$window'

  ( $window ) ->
    class PageState
      enable : ->
        if location.hostname is 'localhost' or location.hostname.split('.')[0] is '192' then return # disable in dev environment
        $window.onbeforeunload = ->
          'Do you really want to leave and remove your haiku?'

      disable : ->
        $window.onbeforeunload = null

    new PageState

])

angular.module('app.common.services.CORS', [])
.config(['$httpProvider', ($httpProvider)->
  # ## Cross-Origin Resource Sharing
  # Enables easy support for different request methods, otherwise
  # we would have to use JSONP requests
  console.log 'common.services.CORSService enabled.'
  delete $httpProvider.defaults.headers.common['X-Requested-With']
  delete $httpProvider.defaults.headers.common['Content-Type']
])

angular.module('app.common.services.Resizer', []).service 'Resizer', [
  '$q'
  ( $q )->
    Resizer = ->
    Resizer::resize = (img, options) ->
      deferred = $q.defer()

      defaults = {
        maxSize: 1024
      }

      options = _.extend defaults, options


      canvas  = document.createElement 'canvas'
      context = canvas.getContext '2d'

      width   = img.width
      height  = img.height

      if width > height
        if width > options.maxSize
          height = height * options.maxSize / width
          width  = options.maxSize
      else
        if height > options.maxSize
          width   = width * options.maxSize / height
          height  = options.maxSize
    
      canvas.width    = width
      canvas.height   = height


      context.drawImage img, 0, 0, width, height
      console.log 'Resizer::resize, working...'
    
      resized = img: canvas.toDataURL 'image/jpeg', quality: .1
      # resized.img.replace 'image/jpeg', 'image/octet-stream'

      deferred.resolve resized
      deferred.promise

    new Resizer
]

  
  
angular.module('app.common.webSockets', []).service('WebSockets', [
  '$window'
  ($window)->
    window.io
])
angular.module('pl.paprikka.directives.drop', [ 
])
.directive('ppkDrop', [

  '$window'
  'Modal'

  ($window, Modal)->
    restrict:     'AE'
    templateUrl:  'drop/drop.html'
    replace:      yes
    scope:
      onDrop: '&'
      files:  '='
    link: (scope, elm, attrs)->
      boxEl = elm.find('.ppk-drop__box')[0]

      scope.isFileOver = no

      onDragEnter = (e) ->
        # e.stopPropagation()
        # e.preventDefault()
        scope.$apply ->
          scope.isFileOver = yes
      
      onDragLeave = (e) ->
        # e.stopPropagation()
        # e.preventDefault()
        scope.$apply ->
          scope.isFileOver = no
        
      onDragOver = (e) ->
        e.preventDefault()
      
      
      messages =
        unsupportedType:
          title: 'Unsupported file type'
          body: """
            Use Markdown (*.md, *.txt) or images to create a Haikµ. <br>
            Like to see a different format / feature here? <a target="_blank" href="mailto:gethaiku@gmail.com">Let us know</a>!
          """
          icon: 'upload'
      
      onDrop = (e) ->
        e.stopPropagation()
        e.preventDefault()
        dt = e.dataTransfer
        scope.$apply -> 
          scope.files = dt.files
          scope.isFileOver = no

        scope.handleUpload dt


      # MIME type helper functions
      getFileType = ( fileDesc ) ->
        regex = /(\.[^.]+)$/i
        ext = fileDesc.name.match(regex)?[0]
        if fileDesc.type is ''
          switch ext
            when '.md' then 'text'
            when '.txt' then 'text'
        else if fileDesc.type.split('/')[0] is 'image'
          'images'

          
      
      getTextFiles = (fileRef, cb) ->
        reader = new FileReader
        reader.onload = (e)->
          result = 
            data: e.target.result
            type: 'text'
          cb? file:result

        reader.readAsText fileRef

      
      getImageFiles = (fileRefs, cb) ->
        reader      = new FileReader
        totalCount  = fileRefs.length

        result =
          data : []
          type : 'images'

        loadSingleImage = ->
          reader.readAsDataURL fileRefs[result.data.length]

        reader.onload = (e) ->
          result.data.push e.target.result
          if result.data.length is totalCount
            cb? file: result
          else
            loadSingleImage()
        loadSingleImage()
        

      
      
      Hammer(elm).on 'doubletap', -> elm.find('.ppk-drop__input').click() 
      elm.find('.ppk-drop__input').on 'change', (e) ->
        scope.$apply -> scope.handleUpload e.target
      
      
      scope.handleUpload = (dt)->
        if dt.files?[0]
          type = getFileType dt.files[0]            
          if type is 'text'
            getTextFiles dt.files[0], scope.onDrop
          else if type is 'images'
            getImageFiles dt.files, scope.onDrop
          else
            m = messages.unsupportedType
            Modal.alert m.title, m.body, m.icon

      scope.supportsUploadClickDelegation = !!$window.navigator.userAgent.match(/(iPod|iPhone|iPad)/) && $window.navigator.userAgent.match(/AppleWebKit/)



      boxEl.addEventListener 'dragenter', onDragEnter, off
      boxEl.addEventListener 'dragleave', onDragLeave, off
      boxEl.addEventListener 'dragover', onDragOver, off
      boxEl.addEventListener 'drop', onDrop, off



])
angular.module('pl.paprikka.haiku', [

  'ngSanitize'

  'app.common.services.pageState'
  'app.common.services.CORS'
  'pl.paprikka.directives.haiku'
  'pl.paprikka.directives.drop'
  'pl.paprikka.haiku.directives.nav'
  'pl.paprikka.directives.haiku.hTap'

  'pl.paprikka.services.hammerjs'
  'pl.paprikka.haiku.services.remote'
  'pl.paprikka.haiku.services.slides'

  'pl.paprikka.haiku.controllers.import'
  'pl.paprikka.haiku.controllers.play'
  'pl.paprikka.haiku.controllers.view'
])

angular.module('pl.paprikka.haiku.controllers.import', [
  'pl.paprikka.haiku.services.importer'
  'app.common.services.Notify'
]).controller('HaikuImportCtrl', [

  'Importer'
  '$location'
  '$rootScope'
  '$scope'
  'Remote'
  'Modal'
  'Notify'

  ( Importer, $location, $rootScope, $scope, Remote, Modal, Notify )->
    $rootScope.categories   = []
    $scope.files            = []
    $scope.state = 'idle'

    $scope.mdSupported = if navigator.userAgent.match /(iPad|iPhone|iPod)/g then no else yes

    Remote.connect()
    
    $scope.initConnection = (categories)->
      Remote.request categories

    $scope.onFileDropped = (data)->
      unless $scope.$$phase then $scope.$apply -> $scope.state = 'sending'
      _.defer -> $scope.$apply ->

        $rootScope.$on 'haiku:room:accepted', (e, data) ->
          $rootScope.clientRole = 'host'
          $location.path '/play/' + data.room
          $scope.$apply()

        Importer.getFromFiles(data).then (result) ->
          $rootScope.categories = result
        
        
          window.categories = $rootScope.categories
          if $rootScope.categories.length
            $scope.initConnection $rootScope.categories

          console.log 'Categories loaded: ', $scope.categories


    
  




])
HaikuPlayCtrl = angular.module('pl.paprikka.haiku.controllers.play', [

  # 'pl.paprikka.haiku.directives.nav'
  'app.common.services.Modal'
  'app.common.directives.CopyOnSelect'
]).controller('HaikuPlayCtrl', [

  '$location'
  '$routeParams'
  '$rootScope'
  '$scope'
  '$timeout'
  'Remote'
  'Slides'
  'Modal'
  'Notify'
  'PageState'

  ( $location, $routeParams, $rootScope, $scope, $timeout, Remote, Slides, Modal, Notify, PageState )->

    PageState.enable()

    showUI = ->
      $scope.UIReady = yes

    $timeout showUI, 2000


    $rootScope.$on 'haiku:remote:URLShared', ->
      Notify.info 'Invitations sent.'

    $rootScope.$on 'haiku:room:readyToShare', ->
      Notify.info 'Haiku is ready to share.'

    $rootScope.$on 'haiku:remote:URLSent', ->
      Notify.info 'Remote bookmark sent.'

    $rootScope.$on 'haiku:room:remoteJoined', ->
      console.log 'Haiku::Remote joined, sending current status...'
      $scope.updateStatus Slides.package $scope.categories
      Notify.info 'Remote connected.'

    $rootScope.$on 'haiku:room:guestJoined', ->
      Notify.info 'New guest has joined.'


    $scope.updateStatus = (data)->
      Remote.sendUpdates data, $routeParams.roomID









    # TODO: move to Modal.prompt service
    sendCtrl = ($scope, $modalInstance) ->
      $scope.result = {}
      $scope.currentEncodedURL = encodeURIComponent haiku.config.remoteURL + '/#/' + $routeParams.roomID

      onConnected = $rootScope.$on 'haiku:room:remoteJoined', ->
        $scope.cancel()
        onConnected()
        
      $scope.ok = (isOK)->
        if isOK
          $modalInstance.close $scope.result.email
      $scope.cancel = -> $modalInstance.dismiss 'cancel'



    $scope.sendRemoteURL = ->
      modalInstance = Modal.open
        templateUrl: 'haiku/partials/modals/send-remote-url.html'
        controller: sendCtrl


      modalInstance.result.then (email) ->
        Remote.sendRemoteURL $routeParams.roomID, email









    shareCtrl = ($scope, $modalInstance) ->
      $scope.newEmail = value: ''
      $scope.emails = []



      getCurrentURL = ->
        location.toString().replace(/#\/play\//i, "#/view/")
      $scope.currentURL = getCurrentURL()
      $scope.currentEncodedURL = encodeURIComponent $scope.currentURL

      $scope.add = (email) ->
        if email?.length
          $scope.emails.push email
          $scope.newEmail.value = ''


      $scope.remove = (email) ->
        $scope.emails = _.filter $scope.emails, (em)-> em isnt email


      $scope.ok = ->
        $modalInstance.close $scope.emails

      $scope.cancel = -> $modalInstance.dismiss 'cancel'



    $scope.shareURL = ->
      modalInstance = Modal.open
        templateUrl: 'haiku/partials/modals/share.html'
        controller: shareCtrl

      modalInstance.result.then (emails) ->
        console.log   emails
        Remote.shareURL $routeParams.roomID, emails














    $location.path('/') unless $rootScope.categories?.length
    $scope.navVisible = yes

])
angular.module('pl.paprikka.haiku.controllers.view', [

  # 'pl.paprikka.haiku.directives.nav'

]).controller('HaikuViewCtrl', [

  '$http'
  '$location'
  '$routeParams'
  '$rootScope'
  '$scope'
  '$timeout'
  'Remote'

  ( $http, $location, $routeParams, $rootScope, $scope, $timeout, Remote )->

    $scope.status = 'loading'

    $rootScope.clientRole = 'guest'
    $scope.test = 'bar'

    $location.path('/') unless $routeParams.roomID

    Remote.join $routeParams.roomID

    $rootScope.$on 'haiku:room:joined', (scope, data) ->
      onDataLoaded = (res)->
        Remote.broadcastJoinedGuest data.room
        $rootScope.categories = res.categories
        $scope.status = 'ready'

        showUI = ->
          $scope.UIReady = yes

        $timeout showUI, 2000

      $http.get(data.categories).success onDataLoaded






    $scope.navVisible = yes

])

angular.module('pl.paprikka.directives.haiku.hTap', []).directive('hTap', [
  -> 
    link: (scope, elm, attrs) ->
      if Modernizr.touch
        tapping = false
        elm.on 'touchstart', -> tapping = true
        elm.on 'touchmove', -> tapping = false
        elm.on 'touchend', -> scope.$apply(attrs['hTap']) if tapping
      else
        elm.on 'click',  -> scope.$apply(attrs['hTap']) 
])
angular.module('pl.paprikka.directives.haiku-import', [
  'pl.paprikka.haiku.services.slides' 
  'pl.paprikka.services.hammerjs' 
  'pl.paprikka.haiku.services.remote' 
  'pl.paprikka.directives.haiku.hTap'
  'ngSanitize'
]).directive('haikuImport', [

  '$window'
  'Slides'
  'Hammer'
  'Remote'
  '$rootScope'

  ( $window, Slides, Hammer, Remote, $rootScope )->
    templateUrl:  'haiku/partials/haiku-import.html'
    restrict:     'AE'
    link: ( scope, elm, attrs )->

 
     
])
angular.module('pl.paprikka.directives.haiku', []).directive('haiku', [

  '$window'
  '$sce'
  'Hammer'
  'Slides'
  '$rootScope'

  ( $window, $sce, Hammer, Slides, $rootScope )->
    scope:
      categories: '='
      onUpdate: '&'
    templateUrl: 'haiku/partials/haiku.html'
    restrict: 'AE'
    link: ( scope, elm, attrs )->

      initSettings = (scope)->
        scope.categories.currentCategory   = 0
        scope.categories.currentSlide      = 0

        scope.isLastCategory    = no
        scope.isLastSlide       = no

        scope.isFirstCategory   = no
        scope.isFirstSlide      = no

      initSettings scope

      scope.$watch 'categories.length', (n,o) ->
        return unless n isnt o
        initSettings scope

      scope.updatePosition = ->
        console.log 'haiku::updatePosition'
        _.each scope.categories, (cat, catIndex)->
          if catIndex < scope.categories.currentCategory
            cat.status = 'prev'
          else if catIndex is scope.categories.currentCategory
            cat.status = 'current'
          else if catIndex > scope.categories.currentCategory
            cat.status = 'next'

          _.each cat.slides, (slide)->
            if slide.index < scope.categories.currentSlide
              slide.status = 'prev'
            else if slide.index is scope.categories.currentSlide
              slide.status = 'current'
            else if slide.index > scope.categories.currentSlide
              slide.status = 'next'

        currCat     = scope.categories.currentCategory
        currSlide   = scope.categories.currentSlide

        scope.isLastCategory  = if currCat is scope.categories.length - 1 then yes else no
        scope.isLastSlide     = if currSlide is scope.categories[currCat]?.slides?.length - 1 then yes else no
        scope.isFirstCategory = if currCat is 0 then yes else no
        scope.isFirstSlide    = if currSlide is 0 then yes else no

        scope.onUpdate? status: Slides.package scope.categories



      scope.prevCategory = ->
        unless scope.isFirstCategory
          scope.categories.currentCategory = scope.categories.currentCategory - 1
          scope.categories.currentSlide = 0

      scope.nextCategory = ->
        unless scope.isLastCategory
          scope.categories.currentCategory = scope.categories.currentCategory + 1
          scope.categories.currentSlide = 0

      scope.prevSlide = ->
        unless scope.isFirstSlide
          scope.categories.currentSlide = scope.categories.currentSlide - 1

      scope.nextSlide = ->
        unless scope.isLastSlide
          scope.categories.currentSlide = scope.categories.currentSlide + 1

      scope.$watch 'categories.currentCategory', scope.updatePosition
      scope.$watch 'categories.currentSlide', scope.updatePosition


      Hammer(elm).on 'swipeleft',  (e)->
        e.gesture.srcEvent.preventDefault();
        scope.$apply scope.nextCategory
        off

      Hammer(elm).on 'swiperight', (e)->
        e.gesture.srcEvent.preventDefault();
        scope.$apply scope.prevCategory
        off

      Hammer(elm).on 'swipeup',    (e)->
        e.gesture.srcEvent.preventDefault();
        scope.$apply scope.nextSlide
        off

      Hammer(elm).on 'swipedown',  (e)->
        e.gesture.srcEvent.preventDefault();
        scope.$apply scope.prevSlide
        off


      onKeyDown = (e) ->
        unless scope.$$phase then scope.$apply ->
          switch e.keyCode
            when 37 then scope.prevCategory()
            when 38 then scope.prevSlide()
            when 39 then scope.nextCategory()
            when 40 then scope.nextSlide()
        # e.preventDefault()
        # e.stopImmediatePropagation()
        # no


      onMouseWheel = (e) ->
        delta = e.originalEvent.wheelDelta
        treshold = 100
        scope.$apply ->
          if delta < -treshold
            scope.nextSlide()
          if delta > treshold
            scope.prevSlide()



      $($window).on 'keydown', onKeyDown
      $($window).on 'mousewheel', onMouseWheel

      $rootScope.$on 'haiku:remote:control', (e, data) ->

        scope.$apply ->
          if data.command is 'position'
            scope.goto
              index: data.params.currentSlide, categoryIndex: data.params.currentCategory

          # switch data.params?.direction
          #   when 'up'    then scope.prevSlide()
          #   when 'down'  then scope.nextSlide()
          #   when 'left'  then scope.prevCategory()
          #   when 'right' then scope.nextCategory()



      scope.$on 'haiku:goto', (slide) ->
        scope.goto slide

      scope.$on 'haiku:goto', (slide) ->
        scope.goto slide

      $rootScope.$on 'haiku:remote:goto', (e, slide)-> scope.goto slide

      scope.getCategoryClass = (category) ->
        'haiku__category--' + (category.status or 'prev')

      scope.getSlideClass = (slide) ->
        'haiku__slide--' + (slide.status or 'prev')

      scope.getSlideStyle = (slide)->
        'background' : slide.background or '#333'
        'background-size': 'cover'

      scope.isCurrentSlide = (slide) -> Slides.isCurrentSlide slide, categories

      scope.goto = (slide)->
        scope.categories.currentCategory = slide.categoryIndex
        scope.categories.currentSlide    = slide.index


      # TODO: extend theming support
      scope.getThemeClass = -> 'haiku--default'




     # TODO: move to a subdirective

])

angular.module('pl.paprikka.haiku.directives.nav', [
  'pl.paprikka.haiku.services.slides'
]).directive('haikuNav', [

  '$rootScope'
  '$location'
  'Slides'
  'Modal'

  ( $rootScope, $location, Slides, Modal )->
    scope:
      categories:    '='
      visible:       '='
      control:       '&navControl'
      enableRemote:  '&onEnableRemote'
      share:         '&onShare'
    restrict:     'AE'
    replace:      yes
    templateUrl:  'haiku/partials/directives/nav.html'

    link: (scope, elm, attr) ->

      $rootScope.$on 'haiku:room:readyToShare', -> 
        scope.$apply -> scope.readyToShare = yes

      scope.clientRole = $rootScope.clientRole
      
      scope.goto = (slide) -> 
        $rootScope.$emit 'haiku:remote:goto', slide

      scope.isCurrentCategory = (cat) -> 
        Slides.isCurrentCategory cat, scope.categories
      
      scope.isCurrentSlide = (slide)-> 
        Slides.isCurrentSlide slide, scope.categories


      # TODO: move to Modal.prompt service
      closeCtrl = ($scope, $modalInstance) ->
        $scope.ok = -> 
          $modalInstance.close yes
        $scope.cancel = -> $modalInstance.dismiss 'cancel'
    
      scope.close = -> 
        modalInstance = Modal.open
          templateUrl: 'haiku/partials/modals/close.html'
          controller: closeCtrl

        modalInstance.result.then (result) ->
          if result
            $location.path '/'

])
angular.module('pl.paprikka.services.hammerjs', []).factory('Hammer', [
  '$window'
  ( $window )-> $window.Hammer
])
angular.module('pl.paprikka.haiku.services.importer', [
  'pl.paprikka.services.markdown'
  'app.common.services.Resizer'
  ]).factory('Importer', [

  'Markdown'
  'Resizer'
  '$q'

  ( Markdown, Resizer, $q )->

    defaultColors = [
      '#1abc9c'
      '#2ecc71'
      '#3498db'
      '#9b59b6'
      '#34495e'
      '#16a085'
      '#27ae60'
      '#2980b9'
      '#8e44ad'
      '#2c3e50'
      '#95a5a6'
      '#d35400'
      '#c0392b'
      '#7f8c8d'
    ]

    markdown = ""



    indexSlides = (categories) ->
      indexedCategories = _.cloneDeep categories
      _.each indexedCategories, (cat, catIndex)->
        _.each cat.slides, (slide, slideIndex)->
          slide.categoryIndex = catIndex
          slide.index = slideIndex
          slide
      indexedCategories

        

    markdownToSlides = (md) ->
      return [] unless md.length      

      slideBody       = Markdown.convert md
      categoryBodies  = slideBody.split('<hr>')

      _.each categoryBodies, (categoryBody) -> categoryBody = categoryBody.trim()

      newCategories = []

      _.each categoryBodies, (cat) ->
        slidesContents  = cat.replace(/<h1.*?>/gi, '__PAGE_BREAK__<h1>').split '__PAGE_BREAK__'
        newCategory     = slides: []

        _.each slidesContents, (sc) ->
          sc = sc.trim()
          if sc.length
            newSlide = {}
            regex = /<p><img(.*?)src="(.*?)" alt="background"><\/p>/gi

            parsedMarkdown = sc.replace regex, (whole, a, src, c) ->
              if src.indexOf('#') is 0
                newSlide.background = src 
              else
                newSlide.background = 'url(' + src + ')'
              ''
              
            newSlide.body = parsedMarkdown
            unless newSlide.background
              newSlide.background = defaultColors[Math.floor Math.random() * defaultColors.length]

            newCategory.slides.push newSlide

        newCategories.push newCategory
      newCategories
    
    
    
    Importer = ->
    Importer.get = -> 
      indexSlides markdownToSlides markdown
      
    
    Importer.getFromFiles = (files) ->
      deferred = $q.defer()

      if files.type is 'text'
        result = Importer.getFromMarkdown files.data
        deferred.resolve result
      else if files.type is 'images'
        Importer.getFromImages files.data, deferred
      else
        []
      # TODO: move haikuDrop logic here?
      deferred.promise
      
    Importer.getFromMarkdown = (markdown) ->
      indexSlides markdownToSlides markdown
    
    Importer.getFromImages = (images, deferred) ->
      categories = [ {slides: []} ]
      _.each images, (img) ->

        imgEl = new Image
        imgEl.onload = ->
          Resizer.resize(imgEl).then (resized) ->
            slide =
              background: 'url(' + resized.img + ')'
            categories[0].slides.push slide
            if categories[0].slides.length is images.length
              
              deferred.resolve indexSlides categories

        imgEl.src = img


      
     
    

    Importer  
      
])
angular.module('pl.paprikka.services.markdown', []).service( 'Markdown', [
  '$window'
  ( $window )-> 
    convert : $window.marked 
    
])
angular.module('pl.paprikka.haiku.services.remote', ['app.common.webSockets']).service('Remote', [
  'WebSockets'
  '$rootScope'
  ( WebSockets, $rootScope) ->
    console.log 'Remote::init'
    SOCKET_LOCATION = haiku.config.hubURL
    socket = WebSockets.connect SOCKET_LOCATION

    socket.on 'connect', ->
      console.log 'haiku::Remote::connected'
      $rootScope.$apply()

      socket.on 'room:readyToShare', (data)->
        $rootScope.$emit 'haiku:room:readyToShare', data

      socket.on 'error', (data)->
        console.error 'Socket error', data
        $rootScope.$emit 'haiku:error', data

      socket.on 'remote', (data) ->
        $rootScope.$emit 'haiku:remote:control', data

      socket.on 'room:remoteJoined', (data)->
        $rootScope.$emit 'haiku:room:remoteJoined', data

      socket.on 'room:guestJoined', (data)->
        $rootScope.$emit 'haiku:room:guestJoined', data

      socket.on 'room:accepted', (data)->
        $rootScope.$emit 'haiku:room:accepted', data

      socket.on 'room:joined', (data)->
        $rootScope.$emit 'haiku:room:joined', data

      socket.on 'remote:URLSent', (data)->
        $rootScope.$emit 'haiku:remote:URLSent', data

      socket.on 'remote:URLShared', (data)->
        $rootScope.$emit 'haiku:remote:URLShared', data


    clearListeners = ->
      listeners = $rootScope.$$listeners
      _.forIn listeners, (value, key) ->
        if key.split(':')[0] is 'haiku'
          $rootScope.$$listeners[key] = null
      
      
      
      

    Remote =
      join : (room) ->
        socket.emit 'room:join', { room: room }
      leave : (room, cb) ->
        socket.emit 'room:leave', { room: room }
      request : (categories) ->
        socket.emit 'room:request', { categories: categories }
      sendRemoteURL : (room, to) ->
        socket.emit 'remote:sendURL', { room, to }
      shareURL : (room, to) ->
        socket.emit 'remote:shareURL', { room, to }
      broadcastJoinedGuest: (room) ->
        socket.emit 'remote:guestJoined', { room }

      connect: ->
        clearListeners()



      sendUpdates: (data, room)->
        console.log 'haiku::update', data, room, socket
        socket.emit 'remote:update', {data, room}
])

angular.module('pl.paprikka.haiku.services.slides', []).factory('Slides',[ ->


    Slides = ->
    Slides.getCurrentCategory = (categories) ->
      _.find categories, status: 'current'
    
    Slides.isCurrentCategory = (cat) -> cat.status is 'current'
    
    Slides.isCurrentSlide = (slide, categories) ->
      slide.index is categories.currentSlide and slide.categoryIndex is categories.currentCategory    
    
    Slides.package = (categories) ->
      cleanedCategories = _.map categories, (cat)->
        slides : _.map cat.slides, (slide) ->
            index: slide.index      
            categoryIndex: slide.categoryIndex
      cleanedCategories =  JSON.parse angular.toJson(cleanedCategories)
      _.extend { categories: cleanedCategories }, _.pick categories, 'currentCategory', 'currentSlide' 
            

    Slides  
      
])
'use strict'

# All dependencies should be loaded in the main app module
App = angular.module('app', [

  # ## Vendor modules / components
  'templates'
  'ngCookies'
  'ngResource'
  'ngRoute'
  'ngRoute'


  # ## Application components
  'app.controllers'

  'ui.bootstrap'
  'ui.bootstrap.tpls'

  'pl.paprikka.haiku'

])











App.config([

  '$routeProvider'
  '$locationProvider'
  '$modalProvider'
  '$tooltipProvider'

  ($routeProvider, $locationProvider, $modalProvider, $tooltipProvider) ->

    $routeProvider

      .when('/404', {templateUrl: 'pages/404.html'})

      .when('/', 
        templateUrl: 'haiku/partials/views/import.html', controller: 'HaikuImportCtrl'
      )



      .when('/play/:roomID', 
        templateUrl: 'haiku/partials/views/play.html', controller: 'HaikuPlayCtrl'
      )

      .when('/view/:roomID', 
        templateUrl: 'haiku/partials/views/view.html', controller: 'HaikuViewCtrl'
      )

      # Catch all / 404
      .otherwise({redirectTo: '/404'})

    # Without server side setup html5 pushState support must be disabled.
    $locationProvider.html5Mode off # Boo IE9, booo!



    $modalProvider.options =
      modalOpenClass: 'disabled'
      backdrop: 'static' # we user our custom overlay (and a flex-like effect as well)
      dialogClass: 'modal dialog-modal modal--default'

    $tooltipProvider.options 
      popupDelay: 600

]).run()



