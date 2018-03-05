/**
 * Clean the destination folder (that will remove the destination folder)
 * This action ensure there is no old files in the destination folder
 * @param {*} gulp 
 * @param {*} plugins 
 * @param {*} oSources 
 * @param {*} dependencies 
 */
module.exports = function (gulp, plugins, oSources,dependencies) {

    gulp.task('css', dependencies, function () {
        if (oSources.css.active) {
            return gulp.src(oSources.css.src, { cwd: oSources.cwd})
                .pipe(plugins.cleanCss({compatibility: 'ie8'}))
                .pipe(plugins.concat(oSources.css.distFileName))
                .pipe(gulp.dest(oSources.deploiement));
        } else {
            return false;
        }
    });
    
};