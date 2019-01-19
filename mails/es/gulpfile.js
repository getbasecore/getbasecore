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
// Watch Tasks
//
/////////////////////////

gulp.task('default', ['browserSync'], function (){
	
	
	//Mails
	gulp.watch(config.mailComponents+'/**/*.html', ['mailInline']);
	gulp.watch(config.mailHtmlSrc+'/**/*.html', ['mailInline']);  	  
	gulp.watch(config.mailScss+'/*.scss', ['sassMail']); 
	gulp.watch(config.mailComponents+'/**/*.scss', ['sassMail']);
	gulp.watch(config.mailCSS + '/*.css', ['mailInline']);
	gulp.watch(config.mailPath+'/dist/*.html', browserSync.reload);  
	
	
  
});

