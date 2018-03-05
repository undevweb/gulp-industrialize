/**
 * Will run sass building on the differents themes of the source configuration
 * Contain a task by sass theme called sass-{numberOfTheTheme}
 * Contain a task called
 * @param {*} gulp 
 * @param {*} plugins 
 * @param {*} oSources 
 * @param {*} dependencies 
 */
module.exports = function (gulp, plugins, oSources,dependencies) {

    for(var iTheme in oSources.sass.themes){

        //Create an anonyme function to keep the current iTheme in a scope
        (function(iTheme) 
        {
            //1 task by sass theme
            gulp.task('sass-' + iTheme,['clean'],function()
            {
                return gulp.src([oSources.sass.themes[iTheme].src],{
                            cwd : oSources.cwd
                        })
                        .pipe(plugins.sourcemaps.init()) // Start source maps. 
                        .pipe(plugins.sass({
                                outputStyle: 'compressed'
                            })
                            .on('error', plugins.sass.logError))
                        .pipe(plugins.sourcemaps.write()) // Write source maps. 
                        .pipe(plugins.rename({
                            dirname: oSources.sass.themes[iTheme].distFolder,
                            basename: oSources.sass.themes[iTheme].distFile,
                            prefix: "",
                            suffix: "",
                            extname: ""
                        }))
                        .pipe(gulp.dest(oSources.deploiement));
            });
        })(iTheme);//pass the current iTheme

        //Push the name of the task in the dependencies
        dependencies.push('sass-' + iTheme);
    }
    
    //Sass task with the dependencies (dependencies from the parmeter + sass themes)
    gulp.task('sass',dependencies);
    
};