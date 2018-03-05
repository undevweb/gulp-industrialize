/**
 * Minify the javascripot and concat by repo of the configuration source
 * @param {*} gulp 
 * @param {*} plugins 
 * @param {*} oSources 
 * @param {*} dependencies 
 */
module.exports = function (gulp, plugins, oSources,dependencies) {

    /**
     * Copy the index in the destination folder
     */
    gulp.task('copy-index',['clean'], function () 
    {   
        return gulp.src(oSources.index.origine.file, {cwd: oSources.cwd + oSources.index.origine.folder})
                   .pipe(plugins.rename({basename: oSources.index.destination.file, extname: ""}))
                   .pipe(gulp.dest(oSources.deploiement + oSources.index.destination.folder));
    });
    dependencies.push('copy-index');

    /**
     * Inject in the index file all dependencies
     */
    gulp.task('inject',dependencies, function () {

        //STEP : index file
        gp = gulp.src(oSources.index.destination.file, {cwd: oSources.deploiement + oSources.index.destination.folder});


        //STEP : Javascript dist
        sExterneJs = '\n';
        for (var sSource in oSources.index.inject.javascript.dist) {
            sExterneJs += '     <script src="' + oSources.index.inject.javascript.dist[sSource] + '"></script>' + '\n';
        }
        gp = gp.pipe(plugins.injectString.replace('##dist-js##', sExterneJs));


        //STEP : CSS dist
        sExterneCSS = '\n';
        for (var sSource in oSources.index.inject.css.dist) {
            sExterneCSS += '     <style  rel="stylesheet" href="' + oSources.index.inject.css.dist[sSource] + '"></style>' + '\n';
        }
        gp = gp.pipe(plugins.injectString.replace('##dist-css##', sExterneCSS));
        

        //STEP : Javascript and CSS local in 1 time
        var aLocalSources = oSources.index.inject.javascript.local;
        aLocalSources.concat(oSources.index.inject.css.local);
        gp = gp.pipe(plugins.inject(gulp.src(aLocalSources, {read: false, cwd: oSources.deploiement}), {relative: true}))


        //STEP : Text replace
        for(var iTextReplace in oSources.index.inject.textReplace){
            gp = gp.pipe(plugins.injectString.replace(oSources.index.inject.textReplace[iTextReplace].tag, oSources.index.inject.textReplace[iTextReplace].text))
        }

        return gp.pipe(gulp.dest(oSources.deploiement + oSources.index.destination.folder));

    });


    gulp.task('index',dependencies);
    
};