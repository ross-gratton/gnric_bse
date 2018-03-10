/*//////////////////////////////////////////////////////////////////////////////
|| Setup
//////////////////////////////////////////////////////////////////////////////*/

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    || Load Config
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    var config = require('./config.json');
    var run_timestamp = Math.round(Date.now()/1000);

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    || Include Node Files
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    var gulp = require('gulp'),
        fs = require('fs'),
        del = require('del');

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    || Include Plugins
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    var sass = require('gulp-ruby-sass'),
        rename = require('gulp-rename'),
        cssnano = require('gulp-cssnano'),
        livereload = require('gulp-livereload'),
        autoprefixer = require('gulp-autoprefixer'),
        twig = require('gulp-twig'),
        sourcemaps = require('gulp-sourcemaps'),
        plumber = require('gulp-plumber'),
        jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish'),
        concat = require('gulp-concat'),
        iconfont = require('gulp-iconfont'),
        iconfontCss = require('gulp-iconfont-css'),
        print = require('gulp-print'),
        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant');


/*//////////////////////////////////////////////////////////////////////////////
|| Styles
//////////////////////////////////////////////////////////////////////////////*/
gulp.task('styles', function(){

    var files = config.env.source.base + config.env.source.sass + '*.scss';
    var destination = config.env.build.base + config.env.build.css;

    return sass(files, {
            sourcemap: false,
            precision: 8
        })
        .pipe(plumber(function (error) {
            console.log('--------------------');
            console.log(''+error);
            console.log('--------------------');
            this.emit('end');
        }))
        .pipe(autoprefixer({
            "browsers": ["last 2 versions"]
        }))
        .pipe(cssnano({ zindex: false }))
        .pipe(gulp.dest(destination))
        .pipe(livereload());
});


/*//////////////////////////////////////////////////////////////////////////////
|| HTML
//////////////////////////////////////////////////////////////////////////////*/
gulp.task('html', function(){

    var the_date = new Date();
    var the_date = the_date.toString().slice(0, 24);
    config.the_date = the_date;

    var files = config.env.source.base + config.env.source.templates + "**/*.twig";
    var components = config.env.source.base + config.env.source.components;
    var destination = config.env.build.base;

    return gulp.src(files)
        .pipe(twig({
            base: components,
            data: { config: config }
        }))
        .pipe(gulp.dest(destination))
        .pipe(livereload());
});


/*//////////////////////////////////////////////////////////////////////////////
|| Images
//////////////////////////////////////////////////////////////////////////////*/

    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    || Optimise
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    gulp.task('images', function(){

        var files = config.env.source.images + config.env.source.images + '**/*';
        var destination = config.env.build.base + config.env.build.images;

        return gulp.src(files)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(destination));
    });
    

/*//////////////////////////////////////////////////////////////////////////////
|| General
//////////////////////////////////////////////////////////////////////////////*/
    
    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    || Build Tasks
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    gulp.task('build', ['html', 'images', 'styles']);


/*//////////////////////////////////////////////////////////////////////////////
|| Watches
//////////////////////////////////////////////////////////////////////////////*/
gulp.task('watch', function(){
    
    livereload.listen();
    
    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    || Images
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    gulp.watch(config.env.source.base + config.env.source.images + '**/*', { debounceDelay: 2000 }, ['images']);
    
    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    || Styles
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    gulp.watch(config.env.source.base + config.env.source.sass + '**/*.scss', { debounceDelay: 2000 }, ['styles']);
    
    /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    || HTML
    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
    gulp.watch(config.env.source.base + config.env.source.html + '**/*.twig', { debounceDelay: 2000 }, ['html']);


});


/*//////////////////////////////////////////////////////////////////////////////
|| Default task wrapper
//////////////////////////////////////////////////////////////////////////////*/
gulp.task('default', ['watch']);
