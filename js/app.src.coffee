'use strict'

### Controllers ###


#  ## Main Application Controller
angular.module('app.controllers', [])
.controller('AppCtrl', [
  
  '$scope'
  '$location'
  '$rootScope'


  ($scope, $location, $rootScope) ->


    $scope.application =
      initialized: yes


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

angular.module('app.common.webSockets', []).service('WebSockets', [
  '$window'
  ($window)->
    window.io
])
angular.module('pl.paprikka.directives.drop', [])
.directive('ppkDrop', [
  '$window'
  ($window)->
    restrict:     'AE'
    templateUrl:  'drop/drop.html'
    replace:      yes
    scope:
      onDrop: '&'
      files: '='
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
      
      
      

      
      onDrop = (e) ->
        e.stopPropagation()
        e.preventDefault()
        dt = e.dataTransfer
        scope.$apply -> 
          scope.files = dt.files
          scope.isFileOver = no

        if dt.files?[0]
          type = getFileType dt.files[0]            

          if type is 'text'
            getTextFiles dt.files[0], scope.onDrop
          if type is 'images'
            getImageFiles dt.files, scope.onDrop


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
          if type is 'images'
            getImageFiles dt.files, scope.onDrop
      
      scope.supportsUploadClickDelegation = !!$window.navigator.userAgent.match(/(iPod|iPhone|iPad)/) && $window.navigator.userAgent.match(/AppleWebKit/)



      boxEl.addEventListener 'dragenter', onDragEnter, off
      boxEl.addEventListener 'dragleave', onDragLeave, off
      boxEl.addEventListener 'dragover', onDragOver, off
      boxEl.addEventListener 'drop', onDrop, off



])
angular.module('pl.paprikka.haiku', [
  'pl.paprikka.directives.haiku'
  'pl.paprikka.directives.drop'
  'pl.paprikka.haiku.services.remote'
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
angular.module('pl.paprikka.directives.haiku', [ 
  'pl.paprikka.services.haiku.slides' 
  'pl.paprikka.services.hammerjs' 
  'pl.paprikka.haiku.services.remote' 
  'pl.paprikka.directives.haiku.hTap'
  'ngSanitize'

  ]).directive('haiku', [

  '$window'
  'Slides'
  'Hammer'
  'Remote'
  '$rootScope'

  ( $window, Slides, Hammer, Remote, $rootScope )->
    templateUrl: 'haiku/partials/haiku.html'
    restrict: 'AE'
    link: ( scope, elm, attrs )->

      scope.categories = Slides.get()

      initSettings = (scope)->
        scope.currentCategory   = 0
        scope.currentSlide      = 0

        scope.isLastCategory    = no
        scope.isLastSlide       = no

        scope.isFirstCategory   = no
        scope.isFirstSlide      = no
        
      initSettings scope

      scope.$watch 'categories.length', (n,o) ->
        return unless n isnt o
        initSettings scope

      scope.updatePosition = ->
        console.log "#{scope.currentCategory} #{scope.currentSlide}"
        _.each scope.categories, (cat, catIndex)->
          if catIndex < scope.currentCategory
            cat.status = 'prev'
          else if catIndex is scope.currentCategory
            cat.status = 'current'
          else if catIndex > scope.currentCategory
            cat.status = 'next'
          console.log cat.status

          _.each cat.slides, (slide, slideIndex)->
            if slideIndex < scope.currentSlide
              slide.status = 'prev'
            else if slideIndex is scope.currentSlide
              slide.status = 'current'
            else if slideIndex > scope.currentSlide
              slide.status = 'next'

        currCat     = scope.currentCategory
        currSlide   = scope.currentSlide

        scope.isLastCategory  = if currCat is scope.categories.length - 1 then yes else no
        scope.isLastSlide     = if currSlide is scope.categories[currCat]?.slides?.length - 1 then yes else no
        scope.isFirstCategory = if currCat is 0 then yes else no
        scope.isFirstSlide    = if currSlide is 0 then yes else no

        console.log scope.currentCategory + ' : ' + scope.currentSlide



      scope.prevCategory = ->
        unless scope.isFirstCategory
          scope.currentCategory = scope.currentCategory - 1
          scope.currentSlide = 0

      scope.nextCategory = ->
        unless scope.isLastCategory
          scope.currentCategory = scope.currentCategory + 1
          scope.currentSlide = 0

      scope.prevSlide = ->
        unless scope.isFirstSlide
          scope.currentSlide = scope.currentSlide - 1

      scope.nextSlide = ->
        unless scope.isLastSlide
          scope.currentSlide = scope.currentSlide + 1

      scope.$watch 'currentCategory', scope.updatePosition      
      scope.$watch 'currentSlide', scope.updatePosition 


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

      $rootScope.$on 'remote:control', (e, data) ->
        scope.$apply ->
          switch data.params.direction
            when 'up'    then scope.prevSlide()
            when 'down'  then scope.nextSlide()
            when 'left'  then scope.prevCategory()
            when 'right' then scope.nextCategory()
      


      scope.getCategoryClass = (category) ->
        'haiku__category--' + (category.status or 'prev')
      
      scope.getSlideClass = (slide) ->
        'haiku__slide--' + (slide.status or 'prev')
      
      

      scope.getSlideStyle = (slide)->
        'background' : slide.background or '#333'
        'background-size': 'cover'

      scope.isCurrentSlide = (slide) ->
        slide.index is scope.currentSlide and slide.categoryIndex is scope.currentCategory
      
      scope.goto = (slide)->
        scope.currentCategory = slide.categoryIndex
        scope.currentSlide    = slide.index


      # TODO: extend theming support
      scope.getThemeClass = -> 'haiku--default'

      scope.files = []
      scope.onFileDropped = (data)->
        _.defer -> scope.$apply ->
          scope.categories = Slides.getFromFiles data
          scope.updatePosition()


      Hammer(elm.find '.haiku__close-btn').on 'tap', (e) ->
        scope.$apply -> scope.close()
      
      
      scope.close = ->
        scope.categories = []
      
      scope.navVisible = yes
      

     # TODO: move to a subdirective     
     
])
angular.module('pl.paprikka.services.hammerjs', []).factory('Hammer', [
  '$window'
  ( $window )-> $window.Hammer
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
    socket = WebSockets.connect 'http://haiku-hub.herokuapp.com:80'
    socket.on 'remote', (data) ->
      console.log data
      $rootScope.$emit 'remote:control', data
])
angular.module('pl.paprikka.services.haiku.slides', [
  'pl.paprikka.services.markdown'
  ]).factory('Slides', [

  'Markdown'

  (Markdown)->

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
        slidesContents  = cat.replace(/<h1>/gi, '__PAGE_BREAK__<h1>').split '__PAGE_BREAK__'

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
    
    
    
    Slides = ->
    Slides.get = -> 
      indexSlides markdownToSlides markdown
      
    
    Slides.getFromFiles = (files) ->
      if files.type is 'text'
        Slides.getFromMarkdown files.data
      else if files.type is 'images'
        Slides.getFromImages files.data
      else []
    
    Slides.getFromMarkdown = (markdown) ->
      indexSlides markdownToSlides markdown
    
    Slides.getFromImages = (images) ->
      categories = [ {slides: []} ]    
      _.each images, (img) ->
        slide =
          background: 'url(' + img + ')'
        categories[0].slides.push slide

      indexSlides categories
      
      
        

    Slides  
      
])
'use strict'

# All dependencies should be loaded in the main app module
App = angular.module('app', [

  # ## Vendor modules / components
  'templates'
  'ngCookies'
  'ngResource'


  # ## Application components
  'app.controllers'


  'pl.paprikka.haiku'

])











App.config([
  '$routeProvider'
  '$locationProvider'
  ($routeProvider, $locationProvider) ->

    $routeProvider

      .when('/404', {templateUrl: 'pages/404.html'})

      .when('/', 
        templateUrl: 'pages/partials/intro.html'
      )

      # Catch all / 404
      .otherwise({redirectTo: '/404'})

    # Without server side setup html5 pushState support must be disabled.
    $locationProvider.html5Mode off

]).run()



