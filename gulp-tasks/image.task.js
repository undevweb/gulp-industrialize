/**
 * Clean the destination folder (that will remove the destination folder)
 * This action ensure there is no old files in the destination folder
 * @param {*} gulp 
 * @param {*} plugins 
 * @param {*} oSources 
 * @param {*} dependencies 
 */
module.exports = function (gulp, plugins, oSources,dependencies) {

    gulp.task('image', dependencies, function () {
        if (oSources.images.active) {
            gulp.src(oSources.images.src, {cwd: oSources.cwd})
                .pipe(plugins.imagemin())
                .pipe(gulp.dest(oSources.deploiement + oSources.images.dist))
                .on('end', function () {
                    //console.log('task images end');
                })
                .on('error', function () {
                    //console.log('task images error');
                });
        } else {
            return false;
        }
    });
    
};