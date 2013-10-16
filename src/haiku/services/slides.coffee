angular.module('pl.paprikka.services.haiku.slides', []).factory('Slides', [
  ->
    mockData = [
      {
        slides: [
          { background : '#0064cd' }
          { background : '#67AF68' }
        ]
      }
      {
        background : '#EB6453'
        slides: [
          { background : '#f1c40f' }
          { background : '#f89406' }
          { background : '#c3325f' }
        ]
      }
      { slides: [{background : '#7a43b6'}] }
      { slides: [{background : '#67AF68'}] }
      {
        slides: [
          { background : '#0064cd' }
          { background : '#0064cd' }
          { background : '#0064cd' }
          { background : '#67AF68' }
        ]
      }
      {
        background : '#EB6453'
        slides: [
          { background : '#f1c40f' }
          { background : '#f1c40f' }
          { background : '#f1c40f' }
          { background : '#f89406' }
          { background : '#c3325f' }
        ]
      }
      { slides: [{background : '#7a43b6'}] }
    ]

    indexSlides = (categories) ->
      indexedCategories = _.cloneDeep categories
      _.each indexedCategories, (cat, catIndex)->
        _.each cat.slides, (slide, slideIndex)->
          slide.categoryIndex = catIndex
          slide.index = slideIndex
          slide
      indexedCategories

        

    
    Slides = ->
    Slides.get = -> 
      indexSlides mockData

    Slides  
      
])