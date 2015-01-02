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
				browsers: ['> 1%', 'last 2 versions']
			}
		},

		// Responsive images
		responsive_images: {
			dev: {
				options: {
					sizes: [{
						name: 'small',
						width: 420,
						quality: 90
					}, {
						name: 'small-retina',
						width: 840,
						quality: 50
					}, , {
						name: 'small-retina-webp',
						width: 840,
						quality: 100
					}, {
						name: 'medium',
						width: 800,
						quality: 90
					}, {
						name: 'medium-retina',
						width: 1600,
						quality: 50
					}, {
						name: 'medium-retina-webp',
						width: 1600,
						quality: 100
					}, {
						name: 'large',
						width: 1280,
						quality: 90
					}, {
						name: 'large-retina',
						width: 2560,
						quality: 45
					}, {
						name: 'large-retina-webp',
						width: 2560,
						quality: 100
					}],

					engine: 'im',
					newFilesOnly: false
				},
				files: [{
					expand: true,
					cwd: 'img',
					src: ['**/*.jpg'],
					dest: 'img-temp'
				}]
			}
		},


		// WebP compression
		cwebp: {
			normal: {
				options: {
					arguments: ['-q', 85],
					concurrency: 20
				},
				files: [
					{src: ['img-temp/**/*.jpg']}
				]
			},
			retina: {
				options: {
					arguments: ['-q', 65],
					concurrency: 20
				},
				files: [
					{src: ['img-temp/**/*-retina-webp.jpg']}
				]
			}
		},

		// Lossless image optimization
		imageoptim: {
			dev: {
				src: ['img-temp']
			}
		},

		// SVG minify
		svgmin: {
			options: {
				plugins: [
					{removeViewBox: false},
					{removeUselessStrokeAndFill: true},
					{cleanupIDs: false}
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

		// Clean tasks
		clean: {
			images: {
				src: ['img-temp']
			},
			webp: {
				src: ['img-temp/**/*-webp.jpg', 'img-temp/**/*-retina.jpg.webp']
			}
		},

		// Copy tasks
		copy: {
			images: {
				files: [{
					expand: true,
					cwd: 'img-temp',
					src: ['**'],
					dest: '../dist/img/',

					rename: function (dest, src) {
						return dest + src.replace('-webp.jpg.webp', '.webp').replace('.jpg.webp', '.webp');
					}
				}]
			}
		},

		// Run shell commands
		shell: {
			options: {
				stderr: false
			},

			// Deploys distribution folder to Github Pages branch
			// https://gist.github.com/cobyism/4730490
			deploy: {
				command: 'git subtree push --prefix ../dist origin gh-pages'
			}
		},

		// Watch tasks
		watch: {
			sass: {
				files: ['sass/**/*.scss'],
				tasks: ['dev-sass']
			},
			images: {
				files: ['img/**/*.jpg'],
				tasks: ['image']
			},
			svg: {
				files: ['img/**/*.svg'],
				tasks: ['svg']
			}
		}

	});

	// Load Grunt tasks automatically
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

	grunt.registerTask('dev-sass', ['sass', 'autoprefixer']);
	grunt.registerTask('image', ['clean:images', 'responsive_images', 'cwebp', 'clean:webp', 'imageoptim', 'copy:images', 'clean:images']);
	grunt.registerTask('svg', ['svgmin']);

	// Deploy task
	grunt.registerTask('deploy', ['shell:deploy']);

	// Default task(s).
	// ORDER IS IMPORTANT
	grunt.registerTask('default', [
		'dev-sass',
		'svg'
	]);


};
