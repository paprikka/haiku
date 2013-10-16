angular.module('pl.paprikka.services.haiku.slides', []).factory('Slides', [
  function() {
    var Slides, indexSlides, mockData;
    mockData = [
      {
        slides: [
          {
            background: '#0064cd'
          }, {
            background: '#67AF68'
          }
        ]
      }, {
        background: '#EB6453',
        slides: [
          {
            background: '#f1c40f'
          }, {
            background: '#f89406'
          }, {
            background: '#c3325f'
          }
        ]
      }, {
        slides: [
          {
            background: '#7a43b6'
          }
        ]
      }, {
        slides: [
          {
            background: '#67AF68'
          }
        ]
      }, {
        slides: [
          {
            background: '#0064cd'
          }, {
            background: '#0064cd'
          }, {
            background: '#0064cd'
          }, {
            background: '#67AF68'
          }
        ]
      }, {
        background: '#EB6453',
        slides: [
          {
            background: '#f1c40f'
          }, {
            background: '#f1c40f'
          }, {
            background: '#f1c40f'
          }, {
            background: '#f89406'
          }, {
            background: '#c3325f'
          }
        ]
      }, {
        slides: [
          {
            background: '#7a43b6'
          }
        ]
      }
    ];
    indexSlides = function(categories) {
      var indexedCategories;
      indexedCategories = _.cloneDeep(categories);
      _.each(indexedCategories, function(cat, catIndex) {
        return _.each(cat.slides, function(slide, slideIndex) {
          slide.categoryIndex = catIndex;
          slide.index = slideIndex;
          return slide;
        });
      });
      return indexedCategories;
    };
    Slides = function() {};
    Slides.get = function() {
      return indexSlides(mockData);
    };
    return Slides;
  }
]);
