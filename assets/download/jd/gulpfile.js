var gulp      = require("gulp"),
    minifyCss = require("gulp-minify-css"),
    uglify    = require("gulp-uglify")
    concat    = require("gulp-concat"),
    rename    = require("gulp-rename"),
    notify    = require("gulp-notify"),
    autoprefixer = require("gulp-autoprefixer"),
    plumber   = require("gulp-plumber");


gulp.task("style", function () {
    return gulp.src("./css/blog-post.css")
           .pipe(plumber())
           // .pipe(concat("main.css"))
           .pipe(rename({suffix: ".min"}))
           .pipe(autoprefixer({
                browsers: ['last 3 version']
            }))
           .pipe(minifyCss())
           .pipe(gulp.dest("./dist/css"))
           // .pipe(notify("css 压缩已经完成"))
})

gulp.task("js", function () {
    return gulp.src("./js/*.js")
           .pipe(plumber())
           .pipe(concat("main.js"))
           .pipe(rename({suffix: ".min"}))
           .pipe(uglify())
           .pipe(gulp.dest("./dist/js"))
           .pipe(notify("js 压缩已经完成"))
})