module.exports = function (grunt) {

	grunt.initConfig({

		// Libsass
		sass: {
			dist: {
				files: {
					'../dist/css/style.css': 'sass/style.scss'
				}
			}
		},

		// CSS vendor prefixes
		autoprefixer: {
			build: {
				src: '../dist/css/style.css',
				dest: '../dist/css/style.css'
			},
			options: {
				// available options:
				// https://github.com/nDmitry/grunt-autoprefixer#options
				browsers: [ '> 1%', 'last 2 versions' ]
			}
		},

		// SVG minify
		svgmin: {
			options: {
				plugins: [
					{ removeViewBox: false },
					{ removeUselessStrokeAndFill: true },
					{ cleanupIDs: false }
				]
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'img',
						src: ['**/*.svg'],
						dest: '../dist/img/',
						ext: '.svg'
					}
				]
			}
		},
		
		watch: {
		    files: ['sass/**/*.scss'],
			tasks: ['sass', 'autoprefixer']
		}

	});

	// Load Grunt tasks automatically
	require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

	// Default task(s).
	// ORDER IS IMPORTANT
	grunt.registerTask('default', [
		'sass',
		'autoprefixer',
		'svgmin'
	]);

};