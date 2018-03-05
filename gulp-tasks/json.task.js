/**
 * Clean the destination folder (that will remove the destination folder)
 * This action ensure there is no old files in the destination folder
 * @param {*} gulp 
 * @param {*} plugins 
 * @param {*} oSources 
 * @param {*} dependencies 
 */
module.exports = function (gulp, plugins, oSources,dependencies) {
    
    gulp.task('json', dependencies, function () {

        return gulp.src(oSources.json.src, {cwd: oSources.cwd})
                   .pipe(plugins.jsonminify())
                   .pipe(gulp.dest(oSources.deploiement));

    });
    
};