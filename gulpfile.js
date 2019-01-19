/////////////////////////
//
// Variables
//
/////////////////////////

var gulp = require('gulp');
var config = require('./config.json');
var secrets = require('./secrets.json');
var util = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var newer = require('gulp-newer');
var postcss = require('gulp-postcss');
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
//var critical = require('critical');
var inlineCss = require('gulp-inline-css');
var cssnano = require('gulp-cssnano');
var sendmail = require('gulp-mailgun');
var notify = require("gulp-notify");
var sftp = require('gulp-sftp');
var svgSprite = require('gulp-svg-sprite');
var fileinclude = require('gulp-file-include');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var runTimestamp = Math.round(Date.now()/1000);
const pngquant = require('imagemin-pngquant');
var critical = require('critical').stream;
var bulkSass = require('gulp-sass-bulk-import');
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');
const {sh} = require("gulp-sh");
// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';
var fontName = 'Icons';


/////////////////////////
//
// VirtualServer Tasks
//
/////////////////////////

gulp.task('browserSync', function() {
	
	if (config.app == ''){
		
	  browserSync.init({
		files: [config.js+'./**/*.js',config.css+'/**/*.css',config.src+'./pages/**/*.'+config.ext],
		server: {
	        baseDir: "./",
	        directory: true
	     },
	  })
	
		
	}else{
	  browserSync.init({
		files: [config.js+'./**/*.js',config.css+'/**/*.css',config.src+'./pages/**/*.'+config.ext],
		proxy: config.app,
		open: "external"
	  })
	
		
	}
	
})


/////////////////////////
//
// PreCSS Tasks
//
/////////////////////////

gulp.task('sass', function() {
  return gulp.src(config.scss + '/*.scss')
	//.pipe(sourcemaps.init())
	.pipe(bulkSass())
	.pipe(sass.sync({outputStyle: 'compressed'}).on('error', notify.onError(function (error) {
	   return 'Error compilando SASS.\n' + error;
	})))   
   //.pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(config.css + ''))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Styles task complete' }));;
});

/////////////////////////
//
// PostCSS Tasks
//
/////////////////////////

gulp.task('postcss', function () {
    var processors = [
        autoprefixer({browsers: ['last 2 versions']}),
    ];
    return gulp.src(config.css + '/*.css')
	    //.pipe(sourcemaps.init())
        .pipe(postcss(processors)).on('error', notify.onError(function (error) {
	   return 'Error PostCSS.\n' + error;
	}))
		//.pipe(sourcemaps.write('maps'))	
        .pipe(gulp.dest(config.css + '/'))
    //Inyectamos el CSS
    //.pipe(browserSync.stream())
    ;
});

gulp.task('css', ['sass','postcss'], function() {});

/////////////////////////
//
// JS Tasks
//
/////////////////////////

gulp.task('lint', function() {
  return gulp.src([
  	config.components+'/**/*.js',
  	config.blocks+'/**/*.js',
  	'!'+config.indexPath+config.components+'/_app-frontend/**/*.js',
  	'!'+config.indexPath+config.components+'/_vendor/**/*.js',  	
  	])
    .pipe(jshint())
	.pipe(notify(function (file) {
      if (file.jshint.success) {
        // Don't show something if success
        return false;
      }
      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }));    
//    .pipe(jshint.reporter('default'));
});


//Concat
gulp.task('concatA', function() {
  return gulp.src([
  	config.indexPath+config.components+'/_app-frontend/_'+config.appFront+'/**/*.js',
  	config.indexPath+config.components+'/_utils-js/**/*.'+config.jsType,
  	'!'+config.indexPath+config.components+'/_critical-js/**/*.js',  	
  	config.indexPath+config.components+'/_vendor/**/*.'+config.jsType,
  	config.indexPath+config.components+'/**/*.'+config.jsType,
  	config.blocks+'/**/*.'+config.jsType,
  	])
  	.pipe(sourcemaps.init())
    .pipe(concat('async.js')).on('error', notify.onError(function (error) {
	   return 'Error compilando Async JS.\n' + error;
	}))
    
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(config.js));
});


gulp.task('concatC', function() {
  return gulp.src([
  	config.indexPath+config.components+'/_critical-js/**/*.js',
  ])
	.pipe(sourcemaps.init())
    .pipe(concat('critical.js')).on('error', notify.onError(function (error) {
	   return 'Error compilando Critical JS.\n' + error;
	}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(config.js));
});

gulp.task('concat', ['concatA','concatC'], function() {});


/////////////////////////
//
// Mail Tasks
//
/////////////////////////

gulp.task('sassMail', function() {
  return gulp.src(config.mailScss+'/*.scss')
	//.pipe(sourcemaps.init())
	.pipe(bulkSass())
	.pipe(sass.sync({outputStyle: 'compressed'}).on('error', notify.onError(function (error) {
	   return 'Error compilando SASS.\n' + error;
	})))   
   //.pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(config.mailCSS))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Styles task complete' }));;
});

gulp.task('build-mail', function() {
  return gulp.src([config.mailHtmlSrc+'/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      config: '@file',
      basepath: config.mailHtmlSrc
    })).on('error', notify.onError(function (error) {
	   return 'Error compilando HTML.\n' + error;
	})) 
  .pipe(gulp.dest(config.mailHtmlDist));
});

gulp.task('mailInline',['build-mail'], function() {
	return gulp.src(config.mailHtmlDist+'/**/*.html')
    .pipe(inlineCss({removeStyleTags: false})).on('error', notify.onError(function (error) {
	   return 'Error inlining email.\n' + error;
	}))
   .pipe(gulp.dest(config.mailHtmlDist))
   .on('end', ()=> {
     console.log('Yay success!');
    });
   ;
});

//gulp mail --src email-name --dest gmail
gulp.task('mail', function() {

	var mailTemplate = config.mailPath+''+util.env.src+'.html';
	var mailService = util.env.dest;
	
	if(mailService == 'gmail'){
		recipient = config.gmailtest;
	}else if(mailService == 'outlook'){
		recipient = config.outlooktest;
	}else if(mailService == 'outlookPC'){
		recipient = config.outlookPCtest;
	}else if(mailService == 'icloud'){
		recipient = config.icloudtest;
	}else if(mailService == 'yahoo'){
		recipient = config.yahootest;
	}else{
		recipient = config.gmailtest+','+config.outlooktest+','+config.outlookPCtest+','+config.icloudtest+','+config.yahootest;
	}			

	gulp.src(mailTemplate) // Modify this to select the HTML file(s)
	  .pipe(sendmail({
	    key: secrets.mailgunAPI, // Enter your Mailgun API key here
	    sender: secrets.mailgunSender,
	    recipient: recipient,
	    subject: 'This is a test email'
	  })).on('error', notify.onError(function (error) {
	   return 'Error enviando email test.\n' + error;
	}))
	  ;


});


gulp.task('sftp', function () {
	return gulp.src(config.indexPath+'mails/src/img/*')
		.pipe(newer(config.indexPath+'mails/src/img/*'))	
		.pipe(sftp({
			host: secrets.sftpHost,
			port: secrets.sftpPort,
			user: secrets.sftpUser,
			pass: secrets.sftpPass,
			remotePath: secrets.sftpRemotePath,
		})).on('error', notify.onError(function (error) {
	   return 'Error subiendo FTP.\n' + error;
	}))
		;
});

gulp.task('imageminmail', function(){
    return gulp.src(config.mailPath+'./**/*.+(png|jpg|jpeg|gif|svg)')
	    .pipe(newer(config.mailPath+'./*.+(png|jpg|jpeg|gif|svg)'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ],
            use: [pngquant()]
        }))
        .on('error', notify.onError(function (error) {
		   return 'Error optimizando imágenes.\n' + error;
		}))        
        .pipe(gulp.dest(config.mailPath));
});



/////////////////////////
//
// Icons
//
/////////////////////////

//
// Icons - sprite SVG
//


gulp.task('iconsvg',['cleaniconsvg'], function () {
	
	return gulp.src(config.svgSrc+'/icons/*.svg')
    .pipe(svgSprite(
		{
		    shape               : {
		        dimension       : {         
		            maxWidth    : 64,
		            maxHeight   : 64
		        },
		        spacing         : {         
		            padding     : 0
		        },
		    },
		    mode                : {
		        symbol          : true
		    },
			preview: {
                sprite: "index.html"
            }		    
		}   
    )).on('error', notify.onError(function (error) {
	   return 'Error creando sprite SVG.\n' + error;
	}))
    .pipe(gulp.dest(config.svg));	
	
});




gulp.task('cleaniconsvg', sh('sh ./src/svg/icons/clean-icons.sh'));




//
// Icons - webfont
//

//gulp.task('iconfont', function(){
//  gulp.src(config.svg+'/icons/*.svg')
//    .pipe(iconfontCss({
//      fontName: 'Icons',
//      path: 'scss',
//      targetPath: config.scss+'_icons.scss',
//      fontPath: config.fonts,
//    }))
//    .pipe(iconfont({
//      fontName: 'Icons',
//      formats: ['ttf', 'eot', 'woff'],
//     }))
//    .pipe(gulp.dest('app/assets/fonts/icons/'));
//});

gulp.task('iconfont', function(){
  return gulp.src(config.svgSrc+'/icons/*.svg')
  
  	.pipe(iconfontCss({
      fontName: 'Iconfont',
      path: 'css',
      //path: './html/scss/_components/_icons-template.css',
      targetPath: '../'+config.components+'/_icons-font/_icons-font.scss',
      fontPath: '../../fonts/'
    }))  
  
    .pipe(iconfont({
      fontName: 'Iconfont', // required 
      prependUnicode: true, // recommended option 
      formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available 
      timestamp: runTimestamp, // recommended to get consistent builds when watching files 
    }))
      .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g. 
        console.log(glyphs, options);
      })
    .pipe(gulp.dest(config.src+'/fonts/'));
});

//
// Icons - Favicon
//

gulp.task('generate-favicon', function(done) {
	realFavicon.generateFavicon({
		masterPicture: config.svgSrc+'/favicon.svg',
		dest: config.dist+'/img/favicons/',
		iconsPath: config.dist+'/img/favicons/',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#ffffff',
				margin: '14%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#da532c',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#5bbad5'
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});

gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});

/////////////////////////
//
// Static Template
//
/////////////////////////

gulp.task('build-html', function() {
  gulp.src([config.src+'/pages/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      config: '@file',
      basepath: config.src
    })).on('error', notify.onError(function (error) {
	   return 'Error compilando HTML.\n' + error;
	})) 
    .pipe(gulp.dest(config.dist));
});

/////////////////////////
//
// Toolkit
//
/////////////////////////

gulp.task("toolkit", sh("stylemark -i src/ -o toolkit -c .stylemark.yml"));

/////////////////////////
//
// Optimization Tasks - Manual call
//
/////////////////////////

//
// CSS Optimization
//


//Urls separadas cuando trabajamos con un CMS
gulp.task('critical-home', function() {
    return critical.generate({
        src: 'http://www.website.com',
        dest: config.css + '/critical/critical-home.css',
        width: 1200,
        height: 900,
        minify: true
    });
});


gulp.task('critical-contact', function() {
    return critical.generate({
        src: 'http://www.website.com/contacto/',
        dest: config.css + '/critical/critical-contacto.css',
        width: 1200,
        height: 900,
        minify: true
    });
});

//All critical CMS declarations in one
gulp.task('criticalcms',[

	'critical-home',
	'critical-contact',

], function() {});


//Urls automáticas cuando son HTMLs planos
gulp.task('critical', ['build-html'], function () {
    return gulp.src(config.indexPath+'*.html')
    
    	// Inline en HTML
        .pipe(critical({base: './', inline: true, minify:true, css: [config.css+'/styles.css']}))
        .on('error', notify.onError(function (error) {
		   return 'Error optimizando CSS.\n' + error;
		}))
        .pipe(gulp.dest(config.indexPath))
 
        //CSS Externo
        .pipe(critical({base: config.css+'./critical', inline: false, minify:true, css: [config.css+'/styles.css']}))
        .on('error', notify.onError(function (error) {
		   return 'Error optimizando CSS.\n' + error;
		}))
        .pipe(gulp.dest(config.css+'./critical'));

        
});


gulp.task('cssnano', function() {
    return gulp.src(config.css + '/**/*.css')
	   // .pipe(sourcemaps.init())
    	.pipe(newer(config.css + '/**/*.css'))
        .pipe(cssnano())
        .on('error', notify.onError(function (error) {
		   return 'Error optimizando CSS.\n' + error;
		}))
        //.pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(config.css + ''));
});

//
// IMG Optimization
//

gulp.task('imagemin', function(){
    return gulp.src(config.dist+'./**/*.+(png|jpg|jpeg|gif)')
	    .pipe(newer(config.dist+'./*.+(png|jpg|jpeg|gif)'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ],
            use: [pngquant()]
        }))
        .on('error', notify.onError(function (error) {
		   return 'Error optimizando imágenes.\n' + error;
		}))        
        .pipe(gulp.dest(config.dist));
});
gulp.task('imageminCMS', function(){
    return gulp.src(config.imgCMS+'./**/*.+(png|jpg|jpeg|gif|svg)')
	    .pipe(newer(config.imgCMS+'./*.+(png|jpg|jpeg|gif|svg)'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ],
            use: [pngquant()]
        }))
        .on('error', notify.onError(function (error) {
		   return 'Error optimizando imágenes.\n' + error;
		}))        
        .pipe(gulp.dest(config.imgCMS));
});



//
// JS Optimization
//

gulp.task('uglify', function() {
  return gulp.src(config.js + '/*.js')
  .pipe(newer(config.js + '/*.js'))
    .pipe(uglify())
    .on('error', notify.onError(function (error) {
	   return 'Error comprimiendo JS.\n' + error;
	}))    
  .pipe(gulp.dest(config.js + ''));
});


//
// All in one optimization
//

gulp.task('optimize',[

	'uglify',
	'imagemin',
	'imageminCMS',
	'iconsvg',
	'cssnano'	

], function() {});

//
// Copy SVG & Fonts assets
//
gulp.task('copySVG', function () {
    gulp.src(config.svgSrc + '/*.svg')
    .pipe(gulp.dest(config.svg))
    .pipe(gulp.dest('toolkit/svg'));
});

gulp.task('copyFonts', function () {
    gulp.src(config.fontsSrc + '/*.*')
    .pipe(gulp.dest(config.fonts))
    .pipe(gulp.dest('toolkit/fonts'));
});

gulp.task('copySVGFonts',[

	'copySVG',
	'copyFonts'	

], function() {});


/////////////////////////
//
// Watch Tasks
//
/////////////////////////

gulp.task('default', ['browserSync'], function (){
	
	//CSS
	gulp.watch(config.indexPath+'/**/*.scss', ['sass']); 
	gulp.watch(config.css + '/*.css', ['postcss']);


	//JS
	gulp.watch(config.indexPath+config.components+'/**/*.{js,jsx}', ['lint','concat']);
	gulp.watch(config.blocks+'**/*.js', ['lint','concat']);   
	gulp.watch(config.js + '/*.js', browserSync.reload);
		
	//Theme
	gulp.watch(config.src+'/**/*.html', ['build-html']);  
	gulp.watch(config.indexPath+'./**/*.'+config.ext, browserSync.reload);

	//Toolkit
	gulp.watch(config.src+'/**/*.md', ['toolkit']);  
		
	//Icons
	//gulp.watch(config.svgSrc+'/icons/*.svg', ['iconfont','sass','postcss']);  
	gulp.watch(config.svgSrc+'/icons/*.svg', ['iconsvg']);  
	gulp.watch(config.svgSrc+'/icons/*.svg', browserSync.reload);
	gulp.watch(config.svgSrc+'/favicon.svg', ['generate-favicon'], browserSync.reload);

  //Copy SVG & Fonts
  gulp.watch([config.svgSrc+'/*.svg',config.fontsSrc+'/*.*'], ['copySVGFonts'], browserSync.reload);
	
	//Mails
	gulp.watch(config.mailComponents+'/**/*.html', ['mailInline']);
	gulp.watch(config.mailHtmlSrc+'/**/*.html', ['mailInline']);  	  
	gulp.watch(config.mailScss+'/*.scss', ['sassMail']); 
	gulp.watch(config.mailComponents+'/**/*.scss', ['sassMail']);
	gulp.watch(config.mailCSS + '/*.css', ['mailInline']);
	gulp.watch(config.mailPath+'/dist/*.html', browserSync.reload);  
	
	
  
});

