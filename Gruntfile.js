/**
 * Global constant defining the Grunt tasks we need
 * @type {[*]}
 */
const GRUNT_TASKS = [
    'grunt-exec',
    'grunt-wiredep',
    'grunt-contrib-cssmin',
    'grunt-bower-main',
    'grunt-contrib-uglify',
    'grunt-contrib-compass',
    'grunt-contrib-watch',
    'grunt-contrib-connect',
    'grunt-contrib-copy',
    'grunt-includes',
    'grunt-contrib-clean',
    'grunt-bower-install-simple',
    'grunt-string-replace',
    'grunt-import-js',
    'grunt-eslint'
];


/**
 * Global constant defining the task list for the registerTask method
 * @type {{default: [*], build: [*], bower: [*], common: [*], after: [*], serve: [*]}}
 */
const TASKLIST = {
    'default': [
        'exec:npm_install',
        'exec:bower_install',
        'copy:general'
    ],

    'default_noinstall': [
        'copy:general'
    ],

    'build': [
        'eslint',
        'clean:beforeBuild',
        'compass:dev',
        'copy:html',
        'copy:partials',
        'copy:images',
        'copy:fonts',
        'copy:webradio',
        'includes',
        'string-replace:publicationName',
        'exec:compile_typescript'
    ],

    'build_production': [
        'eslint',
        'clean:beforeBuild',
        'clean:production',
        'compass:dist',
        'copy:images',
        'copy:fonts',
        'copy:webradio',
        'exec:compile_typescript',
    ],

    'override_ani': [
        'copy:ani_css',
    ],


    'bower': [
        'bower_main',
        'uglify:bower',
        'cssmin:bower'
    ],

    'common': [
        'uglify:common',
        'compass:common',
        'cssmin:common'
    ],

    'common_dev': [
        'compass:common',
    ],

    'after': [
        'clean:afterBuild',
        'import_js',
        'uglify:dev',
    ],

    'after_production': [
        'clean:afterBuild',
        'import_js',
        'uglify:main',
    ],

    'serve': [
        'connect:server',
        'watch'
    ]
};


/**
 * Build the task list based on given parameters.
 * When quick === true the exec part will be skipped and npm install and bower install not executed.
 * @param quick
 * @param type
 * @param prod
 * @param app
 * @param noInstall
 * @returns {Array}
 * @private
 */
function _buildTasklist(type, quick, prod, app, noInstall) {
    var t = [];

    if( !quick && !noInstall ) {
        if( !noInstall ) {
            t = t.concat(TASKLIST.default);
        } else {
            t = t.concat(TASKLIST.default_noinstall);
        }
    }

    if( !prod ) {
        t = t.concat(TASKLIST.build);
    } else {
        t = t.concat(TASKLIST.build_production);
    }

    if( !!app && app === 'ani' ) {
        t = t.concat(TASKLIST.override_ani);
    }

    if( !quick ) {
        t = t.concat(TASKLIST.bower);
    }

    t = t.concat(TASKLIST.common);
    t = t.concat((!!prod) ? TASKLIST.after_production : TASKLIST.after);

    switch(type) {
        case 'serve':
            t = t.concat(TASKLIST.serve);
            break;

        default:
            break;
    }

    return t;
}


/**
 * Grunt process
 * @param grunt
 */
module.exports = function(grunt) {
    var app = grunt.option('app') || '';
    if( !app ) {
        throw('ERROR: No app name defined!');
    }

    var port = grunt.option('port') || '';
    if( !port ) {
        port = 9001;
    }

    var reloadPort = grunt.option('livereload') || '';
    if( !reloadPort ) {
        reloadPort = 35729;
    }

    var quick = !!(grunt.option('quick') || '');
    if( quick ) {
        grunt.log.writeln('Quick mode enabled.');
    }

    var noInstall = !!(grunt.option('no-install') || '');
    if( noInstall ) {
        grunt.log.writeln('Skipping node/bower install.');
    }

    var production = !!(grunt.option('prod') || '');
    if( production ) {
        grunt.log.writeln('Production mode enabled.');
    }

    var SCRIPTS_FILES = {};
    SCRIPTS_FILES['dist/' + app + '/scripts/main.js'] = ['build/app/' + app + '/scripts/*.js'];

    var BOWER_FILES = {};
    BOWER_FILES['dist/' + app + '/scripts/vendor.js'] = require('wiredep')({
        overrides: {
            'moment': {
                'main': 'min/moment-with-locales.js'
            },
        }
    }).js;

    var COMMON_FILES = {};
    COMMON_FILES['dist/' + app + '/scripts/common.js'] = ['app/common/**/*.js'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //
        // Execute external commands
        //
        exec: {
            npm_install: 'npm install',
            bower_install: 'bower install',
            compile_typescript: 'bash bin/build-typescript.sh ' + app,
        },


        //
        // Copy files
        //
        copy: {
            general: {
                expand: true,
                cwd: 'app/' + app + '/',
                src: ['robots.txt', 'favicon.ico'],
                dest: 'dist/' + app + '/',
            },

            html: {
                expand: true,
                src: ['app/' + app + '/*.html'],
                dest: 'build/',
            },

            scss: {
                expand: true,
                src: ['app/' + app + '/styles/**'],
                dest: 'build/',
            },

            /*js: {
                expand: true,
                src: ['app/' + app + '/scripts/*.js'],
                dest: 'build/',
            },*/

            partials: {
                expand: true,
                src: ['app/' + app + '/partials/**'],
                dest: 'build/',
            },

            images: {
                expand: true,
                cwd: 'app/' + app + '/images/',
                src: ['**'],
                dest: 'dist/' + app + '/images/',
            },

            fonts: {
                expand: true,
                cwd: 'app/' + app + '/fonts/',
                src: ['**'],
                dest: 'dist/' + app + '/fonts/',
            },

            webradio: {
                expand: true,
                cwd: 'app/' + app + '/webradio/',
                src: ['**'],
                dest: 'build/app/' + app + '/webradio',
            },

            // ANO Overrides
            ani_css: {
                expand: true,
                cwd: 'app/' + app + '/styles/',
                src: ['_icomoon.css'],
                dest: 'dist/' + app + '/styles/',
            }
        },


        //
        // Replace includes
        //
        includes: {
            files: {
                src: ['build/app/' + app + '/*.html'],
                dest: 'build/app/' + app + '/',
                flatten: true,
                cwd: '.',
                options: {
                    includeRegexp: /^(\s*)#include\s+"(\S+)"\s*$/,
                    silent: false,
                    banner: '<!-- compiled by grunt <% includes.files.dest %> -->\n'
                }
            }
        },


        //
        // String replaces
        //
        'string-replace': {
            publicationName: {
                files: [{
                    cwd: 'build/app/' + app + '/',
                    expand: true,
                    src: '**/*.html',
                    dest: 'build/app/' + app + '/'
                }],

                options: {
                    replacements: [{
                        pattern: /%DMH_PUBLICATION_NAME%/ig,
                        replacement: app
                    }]
                }
            }
        },


        //
        // Clean up
        //
        clean: {
            afterBuild: {
                src: [
                    //'build/app/' + app + '/partials/',
                    'dist/' + app + '/bower/',
                    'dist/' + app + '/styles-common/'
                ]
            },

            production: {
                src: [
                    'build/app/' + app + '/**',
                    'dist/' + app + '/*',
                ]
            },

            beforeBuild: {
                src: [
                    'build/app/' + app + '/**',
                    'dist/' + app + '/bower/',
                    'dist/' + app + '/images/',
                    'dist/' + app + '/styles-common/'
                ]
            }
        },


        //
        // Internal web server
        //
        connect: {
            server: {
                options: {
                    port: parseInt(port, 10) || 0,
                    debug: false,
                    livereload: parseInt(reloadPort, 10) || 0,
                    base: (function(){
                        if(!!app && (app === 'ani' || app === 'brocken') ) {
                            return ['build/app/' + app + '/', './app/' + app + '/', './', './dist'];
                        } else {
                            return ['build/app/' + app + '/', './', './dist'];
                        }
                    })()}

            }
        },


        //
        // ES2015 linting
        //
        eslint: {
            app: {
                src: ['app/' + app + '/scripts/*.js']
            },

            common: {
                src: ['app/common/scripts/*.js']
            },
        },


        //
        // Watch files for changes
        //
        watch: {
            html: {
                files: ['app/' + app + '/*.html', 'app/' + app + '/partials/**/*.html'],
                options: { livereload: parseInt(reloadPort, 10) || 0 },
                tasks: ['copy:html', 'copy:partials', 'includes', 'string-replace'],
            },

            scss: {
                files: ['app/' + app + '/styles/**'],
                options: { livereload: parseInt(reloadPort, 10) || 0 },
                tasks: ['compass:dev'],
            },

            common_scss: {
                files: ['app/common/styles/**'],
                options: { livereload: parseInt(reloadPort, 10) || 0 },
                tasks: ['compass:dev'],
            },

            js: {
                files: [
                    'app/' + app + '/scripts/**'
                ],
                options: { livereload: parseInt(reloadPort, 10) || 0 },
                tasks: ['import_js', 'eslint', 'uglify:dev'],
            },

            common_js: {
                files: [
                    'app/common/**/*.js'
                ],
                options: { livereload: parseInt(reloadPort, 10) || 0 },
                tasks: ['uglify:common'],
            },

            typescript: {
                files: [
                    'app/' + app + '/typescript/**/*.ts',
                ],
                tasks: ['exec:compile_typescript'],
            },

            typescript_common: {
                files: [
                    'app/common/typescript/**/*.ts',
                ],
                tasks: ['exec:compile_typescript'],
            },
        },


        //
        // SCSS compilation
        //
        compass: {
            dist: {
                options: {
                    sassDir: 'app/' + app + '/styles/',
                    cssDir: 'dist/' + app + '/styles/',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            },

            dev: {
                options: {
                    sassDir: 'app/' + app + '/styles/',
                    cssDir: 'dist/' + app + '/styles/',
                    outputStyle: 'expanded',
                    noLineComments: true
                }
            },

            common: {
                options: {
                    sassDir: 'app/common/styles/',
                    cssDir: 'dist/' + app + '/styles-common/',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            }
        },


        //
        // JS includes
        //
        import_js: {
            files: {
                expand: true,
                cwd: 'app/' + app + '/scripts/',
                src: ['*.js'],
                dest: 'build/app/' + app + '/scripts/',
                ext: '.js'
            }
        },


        //
        // Uglify Javascript files
        //
        uglify: {
            main: {
                options: {
                    compress: (app !== 'ani'),
                    unused: true,
                    ie8: true,
                    reserveDOMProperties: true,
                    mangle: false,
                    hoist_vars: true,
                },
                files: SCRIPTS_FILES,
            },

            dev: {
                options: {
                    compress: false,
                    beautify: true,
                    ie8: true,
                    reserveDOMProperties: true,
                },
                files: SCRIPTS_FILES
            },

            common: {
                files: COMMON_FILES
            },

            bower: {
                files: BOWER_FILES
            },
        },


        //
        // Copy installed bower modules
        //
        bower_main: {
            copy: {
                options: {
                    dest: 'dist/' + app + '/bower/'
                }
            }
        },


        //
        // CSS minification
        //
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },

            bower: {
                files: [{
                    src: require('wiredep')({
                        overrides: {
                            'slick-carousel': {
                                'main': 'slick/slick.css'
                            },
                            'modernizr': {
                                'main': '**/*.css'
                            },
                            'jquery-qrcode': {
                                'main': 'dist/**/*.css'
                            },
                            'bootstrap': {
                                'main': 'dist/**/*.css'
                            },
                            'eonasdan-bootstrap-datetimepicker': {
                                'main': 'build/css/bootstrap-datetimepicker.min.css'
                            }
                        }
                    }).css,
                    dest: 'dist/' + app + '/styles/vendor.css'
                }]
            },

            common: {
                files: [{
                    src: 'dist/' + app + '/styles-common/**/*.css',
                    dest: 'dist/' + app + '/styles/common.css'
                }]
            }
        },

        'bower-install-simple': {
            options: {
                color: true
                //directory: 'bower_components'
            },
            prod: {
                options: {
                    production: true
                }
            },
            dev: {
                options: {
                    production: false
                }
            }
        }
    });


    // Load Grunt tasks
    for(var i in GRUNT_TASKS) {
        grunt.loadNpmTasks(GRUNT_TASKS[i]);
    }


    grunt.registerTask('build', _buildTasklist(null, quick, production, app, noInstall));
    grunt.registerTask('serve', _buildTasklist('serve', quick, production, app, noInstall));
    grunt.registerTask('prepserve', ['bower-install-simple']);
};
