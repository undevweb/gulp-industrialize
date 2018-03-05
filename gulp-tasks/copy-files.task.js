/**
 * 
 * @param {*} gulp 
 * @param {*} plugins 
 * @param {*} oSources 
 * @param {*} dependencies 
 */
module.exports = function (gulp, plugins, oSources,dependencies) {
    
    gulp.task('copy-files', dependencies, function () {
        if(oSources.copy.active){

            for (oRepos in oSources.copy.repos) {
                
                gulp.src(oSources.copy.repos[oRepos].src, {cwd : oSources.cwd})
                    .pipe(gulp.dest(oSources.deploiement + oSources.copy.repos[oRepos].dist));
            }
            
            return gulp;
            
        }else{
            return false;
        }
    });
    
};