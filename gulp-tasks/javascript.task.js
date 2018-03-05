/**
 * Minify the javascripot and concat by repo of the configuration source
 * @param {*} gulp 
 * @param {*} plugins 
 * @param {*} oSources 
 * @param {*} dependencies 
 */
module.exports = function (gulp, plugins, oSources,dependencies) 
{
    for(var iRepo in oSources.javascript.repos){

        //Create an anonyme function to keep the current iRepo in a scope
        (function(iRepo) 
        {
            //1 task by javascript repo
            gulp.task('javascript-' + iRepo,['clean'],function()
            {

                return  gulp.src(oSources.javascript.repos[iRepo].src, {base: '.', cwd: oSources.cwd})
                            .pipe(plugins.jshint())
                            .pipe(plugins.concat(oSources.javascript.repos[iRepo].distFile))
                            .pipe(plugins.ngAnnotate())
                            .pipe(plugins.uglify())
                            //.pipe(plugins.rename(oSources.javascript.repos[iRepo].distFile))
                            .pipe(gulp.dest(oSources.deploiement + oSources.javascript.repos[iRepo].distFolder)); 

            });
        })(iRepo);//pass the current iRepo

        //Push the name of the task in the dependencies
        dependencies.push('javascript-' + iRepo);
    }
    
    //Sass task with the dependencies (dependencies from the parmeter + sass themes)
    gulp.task('javascript',dependencies);
    
};