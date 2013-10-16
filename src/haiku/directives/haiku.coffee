angular.module('pl.paprikka.directives.haiku', [ 
  'pl.paprikka.services.haiku.slides' 
  'pl.paprikka.services.hammerjs' 
  'pl.paprikka.directives.haiku.hTap'
  ]).directive('haiku', [

  '$window'
  'Slides'
  'Hammer'

  ( $window, Slides )->
    templateUrl: 'haiku/partials/haiku.html'
    restrict: 'AE'
    link: ( scope, elm, attrs )->

      scope.categories = Slides.get()

      scope.currentCategory   = 0
      scope.currentSlide      = 0

      scope.isLastCategory    = no
      scope.isLastSlide       = no

      scope.isFirstCategory   = no
      scope.isFirstSlide      = no

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


      Hammer(elm).on 'swipeleft',  -> scope.$apply scope.nextCategory
      Hammer(elm).on 'swiperight', -> scope.$apply scope.prevCategory
      Hammer(elm).on 'swipeup',    -> scope.$apply scope.nextSlide
      Hammer(elm).on 'swipedown',  -> scope.$apply scope.prevSlide

      onKeyDown = (e) ->
        unless scope.$$phase then scope.$apply ->
          switch e.keyCode
            when 37 then scope.prevCategory()
            when 38 then scope.prevSlide()
            when 39 then scope.nextCategory()
            when 40 then scope.nextSlide()
        e.preventDefault()
        e.stopImmediatePropagation()
        no

      
      $($window).on 'keydown', onKeyDown

      scope.getCategoryClass = (category) ->
        'haiku__category--' + (category.status or 'prev')
      
      scope.getSlideClass = (slide) ->
        'haiku__slide--' + (slide.status or 'prev')
      
      

      scope.getSlideStyle = (slide)->
        'background-color' : slide.background or '#333'

      scope.isCurrentSlide = (slide) ->
        slide.index is scope.currentSlide and slide.categoryIndex is scope.currentCategory
      
      scope.goto = (slide)->
        scope.currentCategory = slide.categoryIndex
        scope.currentSlide    = slide.index



      

     # TODO: move to a subdirective     
     
])