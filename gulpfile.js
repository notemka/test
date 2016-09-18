"use strict"; //показывать место ошибки в терминале

//создание переменных для вызова
var browserify = require('browserify');
var gulp = require("gulp");
var source = require('vinyl-source-stream');
var useref = require("gulp-useref");
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var cssnano = require("cssnano");

var babelify = require("babelify");

var postcss = require("gulp-postcss");        // npm install --save-dev gulp-postcss
var vars = require("postcss-simple-vars");
var autoprefixer = require("autoprefixer");
var cssnext = require("cssnext");             // включает синтаксис будущего
var nested = require("postcss-nested");
var colorFunctions = require("postcss-color-function");
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

      // ============
      // == Сборка ==
      // ============

// очистка папки
gulp.task("clean", function () {
  return gulp.src("dest")
    .pipe(clean());
});

// перенос html, css, js в папку dest
gulp.task("useref", function () {
  return gulp.src("app/*.html")
    .pipe(gulpif("app/js/*.js", uglify()))
    .pipe(useref())
    .pipe(gulp.dest("dest")); // прописывает новые пути
});

// перенос шрифтов
gulp.task("fonts", function(){
  gulp.src("./app/fonts/*")
    .pipe(filter(["*.eot", "*.svg", "*.ttf", "*.woff", "*.woff2"]))
    .pipe(gulp.dest("./dest/fonts"));
});

// картинки
gulp.task("images", function () {
  return gulp.src("./app/img/*")
    .pipe(imagemin({
      progressive: true,
      interlaced:true
    }))
    .pipe(gulp.dest("./dest/img"));
});

// остальные файлы, такие как favicon и пр.
gulp.task("extras", function () {
  return gulp.src([
    "./app/*.*",
    "!app/*.html"
  ]).pipe(gulp.dest("./dest"));
});

// сборка и вывод размера содержимого папки dest
gulp.task("dest", ["useref", "images", "fonts", "extras"], function(){
  return gulp.src("./dest/**/*").pipe(size({title: "build"}));
});

      // ==================
      // == Работа с APP ==
      // ==================

// Компилируем Jade в html
gulp.task("jade", function() {
  gulp.src("./app/templates/pages/*.jade")
    .pipe(jade())
    .on("error", log)
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest("./app"))
    .pipe(reload({stream: true}));
});

// Компилируем css
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
    autoprefixer,
    cssnano()
  ];

  return gulp.src("app/css/main.css")
    .pipe(postcss(processors))
    .on("error", log)
    .pipe(rename("bundle.css"))
    .pipe(gulp.dest("app/css"))
    .pipe(reload({stream: true}));
});

// Компилируем js
gulp.task("js", function() {
  return browserify({entries: "./app/js/main.js", debug: true})
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    // .pipe(uglify())
    .pipe(source("bundle.js"))
    .on("error", log)
    .pipe(gulp.dest("./app/js"))
    .pipe(reload({stream: true}));
});

// Собираем папку DEST (только после компиляции Jade, CSS, JS)
gulp.task("build", ["clean", "jade", "css", "js"], function () {
  gulp.start("dest");
});

// Запускаем локальный сервер (только после компиляции jade)
gulp.task("server", ["jade", "css", "js"], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: "./app"
    }
  });
});

// слежка и запуск задач
gulp.task("watch", function () {
  gulp.watch("./app/templates/**/*.jade", ["jade"]).on("change", reload);
  gulp.watch("./app/css/**/*.css", ["css"]).on("change", reload);
  gulp.watch("./app/js/**/*.js", ["js"]).on("change", reload);
});

// Задача по-умолчанию
gulp.task("default", ["server", "watch"]);

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
