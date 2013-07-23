module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true
      },
      files: {
        src: ['Gruntfile.js', 'bpjs.js']
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      production: {
        files: {
          'bpjs.min.js': ['bpjs.js']
        }
      }
    }, 
    watch: {
      js: {
        files: ['<%= jshint.files.src %>'],
        tasks: ['jshint']
      }   
    }    
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //default task
  grunt.registerTask('default', ['jshint', 'uglify:production']);

};
