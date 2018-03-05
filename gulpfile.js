////////////////// VARIABLES /////////////////////////

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var argv = require('minimist')(process.argv);

//default task
require('./gulp-tasks/default.task.js')(gulp, plugins);

if(undefined == argv.source){
    //If there isn't the configuration path in parameter, ask the user indicate it
    styleMenu = plugins.util.colors.bgRed.white;
    plugins.util.log(styleMenu('Le paramètre source est manquant : --source="sources-****.json"'));
}else{

    //////// PARAMETERS - CONFIGURATION //////////////////
    oSources = require('./config/'+ argv.source);

    ////////////////// TASKS (gulp, plugins, source, dependencies) ////////////////
    require('./gulp-tasks/clean.task.js')(gulp, plugins,oSources,[]);
    require('./gulp-tasks/sass.task.js')(gulp, plugins,oSources,['clean']);
    require('./gulp-tasks/css.task.js')(gulp, plugins,oSources,['clean']);
    require('./gulp-tasks/javascript.task.js')(gulp, plugins,oSources,['clean']);
    require('./gulp-tasks/json.task.js')(gulp, plugins,oSources,['clean']);
    require('./gulp-tasks/html.task.js')(gulp, plugins,oSources,['clean']);
    require('./gulp-tasks/image.task.js')(gulp, plugins,oSources,['clean']);
    require('./gulp-tasks/copy-files.task.js')(gulp, plugins,oSources,['clean']);

    require('./gulp-tasks/index.task.js')(gulp, plugins,oSources,[
        'clean',
        'javascript',
        'sass',
        'css',
        'copy-files'
    ]);

    ////////////////////////////////// BUILD //////////////////////////

    //STEP : Get active tasks
    var aTasksActive = Array();
    aTasksActive.push('clean');
    aTasksActive.push('javascript');
    aTasksActive.push('sass');
    aTasksActive.push('css');
    aTasksActive.push('html');

    if(oSources.json.active){
        aTasksActive.push('json');
    }
    
    aTasksActive.push('image');
    aTasksActive.push('copy-files');

    if(oSources.index.active){
        aTasksActive.push('inject');
    }
    //STEP : Create build task with actived tasks
    gulp.task('build', aTasksActive);
}