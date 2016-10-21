/////////////////////////////
// Gulp and gulp plugins
/////////////////////////////
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	extend = require('extend'),
    argv = require('minimist')(process.argv),
    fs = require("fs"),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if'),
    prompt = require('gulp-prompt'),
    inject = require('gulp-inject'),
    injectString = require('gulp-inject-string'),
    jshint = require('gulp-jshint'),
    gp_concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
	removeHtmlComments = require('gulp-remove-html-comments'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    jsonminify = require('gulp-jsonminify'),
    imageop = require('gulp-image-optimization'),
    rsync = require('gulp-rsync');


oSources = require('./gulp/config/sources.json');
oDeploy = require('./gulp/config/deploy.json');
oProject = require('./gulp/config/project.json');
PATH_INDEX = 'gulp/src/index.html.dist';
PATH_DEPLOIEMENT = 'gulp/deploiement/';


/////////////////////////////
// Micro tasks for prepare-deploiement
/////////////////////////////

//Etape 1 : vide entièrement le dossier deploiement
gulp.task('clean', function () {
    return gulp.src(PATH_DEPLOIEMENT, {read: false})
            .pipe(clean());
});

//Etape 2 : lancer la commande sass qui crée le fichier ./deploiement/style.min.css
gulp.task('css-sass',['clean'], function () {
    return gulp.src(oSources.sass,{base: '.'})
            .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed'})
			.on('error', sass.logError))
            .pipe(sourcemaps.write())
			.pipe(gp_concat('style.min.css'))
            .pipe(gulp.dest(PATH_DEPLOIEMENT));
});


//Etape 3 : minifier les json grâce à ./config/sources.json et les mettre dans ./deploiement au même endroit (modules/nommodule/data..)
gulp.task('json-minify',['clean'], function () {
    return gulp.src(oSources.json, {base: '.'})
            .pipe(jsonminify())
            .pipe(gulp.dest(PATH_DEPLOIEMENT));
});

//Etape 4 : minifier les html grâce à ./config/sources.json et les mettre dans ./deploiement au même endroit 
gulp.task('html-minify',['clean'], function () {
    return gulp.src(oSources.html,{base: '.'})
			.pipe(removeHtmlComments())
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(PATH_DEPLOIEMENT));
});

//Etape 5 : minifier et concaténer les js locaux (config + modules) grâce à ./config/sources.json et créer le fichier ./deploiement/script.min.js
gulp.task('js-minify',['clean'], function (callback) {
	
	
	return gulp.src(oSources.js)
				.pipe(jshint())
				.pipe(gp_concat('script.js'))
				.pipe(ngAnnotate())
				.pipe(uglify())
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest(PATH_DEPLOIEMENT ));
	
});

//Etape 6 : copier les images définies dans config/sources.json dans deploiement/images
gulp.task('images', function () {
    gulp.src(oSources.images).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))
            .pipe(gulp.dest(sIMAGESDestination))
            .on('end', function () {
                console.log('task images end');
            })
            .on('error', function () {
                console.log('task images error');
            });
});

//Etape 7 : Copier le index.html et injecter l'inclusion du css local, des js externes, des js locaux dans deploiement/index.html
gulp.task('copy-index',['clean'], function () {
    gulp.src(PATH_INDEX)
            .pipe(rename({basename: 'index', extname: ".html"}))
            .pipe(gulp.dest(PATH_DEPLOIEMENT));

});

gulp.task('inject', ['copy-index','css-sass','js-minify'], function () {
	
	sExterneJs = '\n';
	for(sSource in oSources.dist.js){
		sExterneJs += '     <script src="'+oSources.dist.js[sSource]+'"></script>' + '\n';
	}
	
	sExterneCSS = '\n';
	for(sSource in oSources.dist.css){
		sExterneCSS += '     <style  rel="stylesheet" href="'+oSources.dist.css[sSource]+'"></style>' + '\n';
	}
		
	gulp.src(PATH_DEPLOIEMENT+'index.html')
		.pipe(injectString.replace('##title##',oProject.title))
		.pipe(injectString.replace('##appName##',oProject.appName))
		.pipe(injectString.replace('##description##',oProject.description))
		.pipe(injectString.replace('##dist-js##',sExterneJs))
		.pipe(injectString.replace('##dist-css##',sExterneCSS))
		.pipe(inject(gulp.src(['**/*.js','**/*.css'], {read: false,cwd: PATH_DEPLOIEMENT}), {relative: true}))
		.pipe(gulp.dest(PATH_DEPLOIEMENT));
});

/////////////////////////////
// Micro tasks for deploy
/////////////////////////////



/////////////////////////////
// Macro tasks
/////////////////////////////
gulp.task('default',function(){
	
	styleMenu = gutil.colors.bgBlue.white;
	
	gutil.log(styleMenu('Bienvenue !!!^^!!!'));
	gutil.log(styleMenu('Commencez par préparer le déploiement, puis déployez sur votre serveur :'));
	gutil.log(styleMenu('1) gulp prepare-deploiement'));
	gutil.log(styleMenu('2) gulp deploy --env xxx'));
	
});

gulp.task('prepare-deploiement',['css-sass','json-minify','html-minify','inject']);

gulp.task('deploy', function () {

	oDeploy = {
		"progress": false,
		"incremental": true,
		"relative": true,
		"emptyDirectories": true,
		"recursive": true,
		"clean": true,
		"chmod": "ugo=rwX",
		"root" : __dirname + '/' + PATH_DEPLOIEMENT
	};
	
	oConfigConnexion = require('./gulp/config/deploy.json')[argv.env];
	
	if(oConfigConnexion == undefined){
		gutil.log(gutil.colors.bgRed.white('Config connexion undefined'));
		return false;
	}else{
		return gulp.src(PATH_DEPLOIEMENT + '**/*')
            .pipe(gulpif((argv.production || (argv.env && argv.env == 'production')),
                    prompt.confirm({
                        message: 'Etes-vous sûr de vouloir publier en production ?',
                        default: false
                    })
            ))
            .pipe(rsync(extend(oDeploy,oConfigConnexion)));
	}
    
});