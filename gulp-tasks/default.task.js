module.exports = function (gulp, plugins) {
    gulp.task('default', function () {
        styleMenu = plugins.util.colors.bgBlue.white;
        plugins.util.log(styleMenu('Bienvenue !!!^^!!!'));
        plugins.util.log(styleMenu('Commencez par préparer le déploiement, puis déployez sur votre serveur :'));
        plugins.util.log(styleMenu('1) gulp build --source="sources-****.json"'));
        plugins.util.log(styleMenu('2) gulp deploy --env xxx'));
    });
};