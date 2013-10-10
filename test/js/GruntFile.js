module.exports = function(grunt) {
  var imports;
  imports = grunt.file.readJSON('imports.json');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          'public/js/app.js': ['src/**/*.coffee']
        },
        options: {
          sourceMap: true,
          join: true,
          bare: true
        }
      },
      compileForTests: {
        options: {
          bare: true
        },
        expand: true,
        flatten: false,
        cwd: './',
        src: ['**/*.coffee'],
        dest: 'test/js/',
        ext: '.js'
      },
      compileTests: {
        options: {
          bare: true
        },
        expand: true,
        flatten: false,
        cwd: 'test/unit/',
        src: ['**/*.coffee'],
        dest: 'test/js-unit/',
        ext: '.spec.js'
      }
    },
    concat: {
      options: {
        separator: ';\n\n'
      },
      vendorScripts: {
        src: imports.scripts,
        dest: 'public/js/vendor.js'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      assets: {
        files: 'assets/**/*.*',
        tasks: ['copy:assets']
      },
      scripts: {
        files: 'src/**/*.coffee',
        tasks: ['buildScripts']
      },
      vendorScripts: {
        files: imports.scripts,
        tasks: ['concat:vendorScripts']
      },
      templates: {
        files: 'src/**/*.jade',
        tasks: ['buildTemplates']
      },
      css: {
        files: ['public/css/*.css'],
        tasks: 'livereload'
      }
    },
    jade: {
      "default": {
        options: {
          client: false,
          wrap: false,
          basePath: 'src',
          pretty: true
        },
        files: {
          'public/': ['src/**/*.jade']
        }
      }
    },
    html2js: {
      options: {
        module: 'templates',
        base: 'public/'
      },
      main: {
        src: 'public/**/*.html',
        dest: 'public/js/templates.js'
      }
    },
    compass: {
      compile: {
        options: {
          config: 'config.rb'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8081,
          base: 'public',
          keepalive: true
        }
      },
      livereload: {
        options: {
          port: 8081,
          base: 'public'
        }
      }
    },
    copy: {
      assets: {
        files: [
          {
            src: ['**'],
            dest: 'public/',
            cwd: 'assets/',
            expand: true
          }
        ]
      }
    },
    clean: {
      "public": {
        src: ['public/*.*']
      },
      templates: {
        src: ['public/partials/**/*.*', 'public/index.html']
      },
      scripts: {
        src: ['public/js/']
      },
      testScripts: {
        src: ['test/js/', 'test/coverage', 'test/js-unit']
      },
      styles: {
        src: ['public/css/']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.registerTask('buildScripts', ['clean:scripts', 'coffee:compile', 'concat:vendorScripts', 'html2js:main', 'livereload', 'coffee:compileForTests', 'coffee:compileTests']);
  grunt.registerTask('buildTemplates', ['clean:templates', 'jade', 'html2js:main', 'livereload']);
  grunt.registerTask('buildStyles', ['compass:compile']);
  grunt.registerTask('coverage', ['clean:testScripts', 'html2js:main', 'coffee:compileForTests', 'coffee:compileTests']);
  return grunt.registerTask('default', ['connect:livereload', 'watch']);
};
