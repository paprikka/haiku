angular.module('pl.paprikka.services.haiku.slides', ['pl.paprikka.services.markdown']).factory('Slides', [
  'Markdown', function(Markdown) {
    var Slides, defaultColors, indexSlides, markdown, markdownToSlides;
    defaultColors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#95a5a6', '#d35400', '#c0392b', '#7f8c8d'];
    markdown = "";
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
    markdownToSlides = function(md) {
      var categoryBodies, newCategories, slideBody;
      if (!md.length) {
        return [];
      }
      slideBody = Markdown.convert(md);
      categoryBodies = slideBody.split('<hr>');
      _.each(categoryBodies, function(categoryBody) {
        return categoryBody = categoryBody.trim();
      });
      newCategories = [];
      _.each(categoryBodies, function(cat) {
        var newCategory, slidesContents;
        slidesContents = cat.split('<h1>');
        newCategory = {
          slides: []
        };
        _.each(slidesContents, function(sc) {
          var newSlide, parsedMarkdown, regex;
          sc = sc.trim();
          if (sc.length) {
            newSlide = {};
            regex = /<p><img(.*?)src="(.*?)" alt="background"><\/p>/gi;
            parsedMarkdown = sc.replace(regex, function(whole, a, src, c) {
              if (src.indexOf('#') === 0) {
                newSlide.background = src;
              } else {
                newSlide.background = 'url(' + src + ')';
              }
              return '';
            });
            newSlide.body = parsedMarkdown;
            if (!newSlide.background) {
              newSlide.background = defaultColors[Math.floor(Math.random() * defaultColors.length)];
            }
            return newCategory.slides.push(newSlide);
          }
        });
        return newCategories.push(newCategory);
      });
      return newCategories;
    };
    Slides = function() {};
    Slides.get = function() {
      return indexSlides(markdownToSlides(markdown));
    };
    Slides.getFromMarkdown = function(markdown) {
      return indexSlides(markdownToSlides(markdown));
    };
    return Slides;
  }
]);
