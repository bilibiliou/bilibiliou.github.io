var gulp      = require("gulp"),
    minifyCss = require("gulp-minify-css"),
    uglify    = require("gulp-uglify")
    concat    = require("gulp-concat"),
    rename    = require("gulp-rename"),
    notify    = require("gulp-notify")


gulp.task("style", function () {
    return gulp.src("./css/*.css")
           .pipe(concat("main.css"))
           .pipe(rename({suffix: ".min"}))
           .pipe(minifyCss())
           .pipe(gulp.dest("./dist/css"))
           .pipe(notify("css 压缩已经完成"))
})

gulp.task("js", function () {
    return gulp.src("./js/*js")
           .pipe(concat("main.js"))
           .pipe(rename({suffix: ".min"}))
           .pipe(uglify())
           .pipe(gulp.dest("./dist/js"))
           .pipe(notify("js 压缩已经完成"))
})