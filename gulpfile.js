"use strict"; //показывать место ошибки в терминале

//создание переменных для вызова
var browserify = require('browserify');
var gulp = require("gulp");
var source = require('vinyl-source-stream');
var buffer = require("vinyl-buffer");
var cssnano = require("cssnano");

var babelify = require("babelify");

var postcss = require("gulp-postcss");
var vars = require("postcss-simple-vars");
var autoprefixer = require("autoprefixer");
var cssnext = require("cssnext");             // включает синтаксис будущего
var nested = require("postcss-nested");
var colorFunctions = require("postcss-colour-functions");
var stripInlineComment = require("postcss-strip-inline-comments");
var importCss = require("postcss-partial-import");
var inlineSvg = require("postcss-inline-svg");
var stylelint = require("stylelint");
var config = require("./stylelint.config.js");

var jade = require("gulp-jade");
var uglify = require("gulp-uglify");    //минифицирует js
var clean = require("gulp-clean");      //для очистки папки dest перед пересборкой
var prettify = require("gulp-prettify");
var filter = require("gulp-filter");    //для фильтрования шрифтов
var size = require("gulp-size");            //показывает размер сборки
var imagemin = require("gulp-imagemin");   //минификация изображений
var browserSync = require("browser-sync");  //для обновления страницы при разработке
var reload = browserSync.reload;

// очистка папки
gulp.task("clean", function () {
  return gulp.src("./dest/*")
    .pipe(clean());
});

// перенос шрифтов
gulp.task("fonts", function(){
  return gulp.src("./app/fonts/*")
    .pipe(filter(["*.eot", "*.svg", "*.ttf", "*.woff", "*.woff2"]))
    .pipe(gulp.dest("./dest/fonts"));
});

// оптимизация и перенос картинок
gulp.task("images", function () {
  return gulp.src("./app/img/*")
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest("./dest/img"));
});

// перенос остальных файлов, такие как favicon и пр.
gulp.task("extras", function () {
  return gulp.src(["./app/json/*.json", "./app/*.*", "!app/*.html"])
              .pipe(gulp.dest("./dest"));
});

// компиляция Jade в html
gulp.task("jade", function() {
  return gulp.src("./app/templates/pages/*.jade")
    .pipe(jade())
    .on("error", log)
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest("./dest"))
    .pipe(reload({stream: true}));
});

// компиляция css
gulp.task("css", function() {
  var processors = [
    stylelint(config),
    importCss,
    nested,
    vars({ silent: true }),
    cssnext,
    colorFunctions,
    inlineSvg({
      path: "./app/img"
    }),
    stripInlineComment,
    autoprefixer({ browsers: ["last 4 versions"] }),
    cssnano()
  ];

  return gulp.src("./app/css/styles.css")
    .pipe(postcss(processors))
    .on("error", log)
    .pipe(gulp.dest("./dest/css"))
    .pipe(reload({stream: true}));
});

// компиляция js
gulp.task("js", function() {
  return browserify({entries: "./app/js/main.js", debug: true})
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(uglify())
    .on("error", log)
    .pipe(gulp.dest("./dest/js", uglify()))
    .pipe(reload({stream: true}));
});

//сборка и вывод размера содержимого папки dest
gulp.task("dest", ["jade", "css", "js", "images", "fonts", "extras"], function(){
  return gulp.src("./dest/**/*").pipe(size({title:"Total build size"}));
});

// Собираем папку DEST (только после компиляции Jade, CSS, JS)
gulp.task("build", ["clean"], function() {
  gulp.start("dest");
});

// Запускаем локальный сервер (только после компиляции jade)
gulp.task("server", function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: "./dest"
    }
  });
});

// слежка и запуск задач
gulp.task("watch", function () {
  gulp.watch("./app/templates/**/*.jade", ["jade"]);
  gulp.watch("./app/css/**/*.css", ["css"]);
  gulp.watch("./app/js/**/*.js", ["js"]);
  gulp.watch("./app/img/*", ["images"]);
});

// Задача по-умолчанию
gulp.task("default", ["build", "server", "watch"]);

        //  =============
        //  == Функции ==
        //  =============

// Более наглядный вывод ошибок
var log = function (error) {
  console.log([
    "",
    "----------ERROR MESSAGE START----------",
    ("[" + error.name + " in " + error.plugin + "]"),
    error.message,
    "----------ERROR MESSAGE END----------",
    ""
  ].join("\n"));
  this.end();
};
