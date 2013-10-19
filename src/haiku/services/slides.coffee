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
        slidesContents  = cat.split '<h1>'
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
      
    
    
    Slides.getFromMarkdown = (markdown) ->
      indexSlides markdownToSlides markdown
    
    

    Slides  
      
])