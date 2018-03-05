/**
 * Clean the destination folder (that will remove the destination folder)
 * This action ensure there is no old files in the destination folder
 * @param {*} gulp 
 * @param {*} plugins 
 * @param {*} oSources 
 * @param {*} dependencies 
 */
module.exports = function (gulp, plugins, oSources,dependencies) {
    
    gulp.task('html',dependencies, function () {
        if (oSources.html.active) {
            return gulp.src(oSources.html.src, {cwd: oSources.cwd})
                       .pipe(plugins.removeHtmlComments())
                       .pipe(plugins.htmlmin({collapseWhitespace: true}))
                       .pipe(gulp.dest(oSources.deploiement + oSources.html.dist));
        } else {
            return false;
        }
    });
    
};