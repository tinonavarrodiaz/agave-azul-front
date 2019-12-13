import gulp from 'gulp'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import browserSync from 'browser-sync'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import buffer from 'vinyl-buffer'
import minify from 'gulp-minify'
import imagemin from 'gulp-imagemin'
import sitemap from 'gulp-sitemap'
import cachebust from 'gulp-cache-bust'
import tildeImporter from 'node-sass-tilde-importer'
import robots from 'gulp-robots'
import data from 'gulp-data'
import fs from 'fs'
import ts from 'gulp-typescript'


const tsProject = ts.createProject('tsconfig.json');

const wordPress = false
const themeName = 'comtech-theme'
const wordpressThemePath = './wordpress/wp-content/themes'
const siteUrl = 'http://destiladoraagaveazul.com'

const urlLocal= ''

const dest = wordPress ? `${wordpressThemePath}/${themeName}` : './public'


sass.compiler= require('node-sass')



const server = browserSync.create()

const postcssPlugins = [
  cssnano({
    core: true,
    zindex: false,
    autoprefixer: {
      add: true,
      browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
    }
  })
]

const stylesDev = ()=>{
  return (
    gulp
      .src('./src/scss/*.scss')
      .pipe(sourcemaps.init({ loadMaps : true}))
      .pipe(plumber())
      .pipe(sass({
          importer: tildeImporter,
          outputStyle: 'expanded',
          includePaths: ['./node_modules']
        }))
      .on('error', sass.logError)
      .pipe(postcss(postcssPlugins))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(`${dest}/css`))
      .pipe(server.stream({match: '**/*.css'}))
  )
}

const stylesBuild = ()=>{
  return (
    gulp.src('./src/scss/*.scss')
    .pipe(plumber())
    .pipe(sass({
      importer: tildeImporter,
      includePaths: ['./node_modules']
    }))
    .pipe(postcss(
      [
        cssnano({
          core: false,
          zindex: false,
          autoprefixer: {
            add: true,
            browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
          }
        })
      ]
    ))
    .pipe(gulp.dest(`${dest}/css`))
  )
}

const pugDev = ()=>{
  return (
    gulp.src('./src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(data(function () {
      return JSON.parse(fs.readFileSync('./src/data/data.json'))
    }))
    .pipe(pug({
      pretty: true,
      basedir: './src/pug'
    }))
    .pipe(gulp.dest(dest))
  )
}

const pugBuild = ()=>{
  return (
    gulp.src('./src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(data(function () {
      return JSON.parse(fs.readFileSync('./src/data/data.json'))
    }))
    .pipe(pug({
      pretty: true,
      basedir: './src/pug'
    }))
    .pipe(gulp.dest(dest))
  )
}

const scriptsDev = ()=>{
  return (
    browserify('./src/js/index.js')
    .transform(babelify, {
      global: true // permite importar desde afuera (como node_modules)
    })
    .bundle()
    .on('error', function (err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(minify({
      ext: {
        src: '-min.js',
        min: '.js'
      }
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${dest}/js`))
  )
}

const scriptsBuild = ()=>{
  return (
    browserify('./src/js/index.js')
    .transform(babelify, {
      global: true // permite importar desde afuera (como node_modules)
    })
    .bundle()
    .on('error', function (err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(minify({
      ext: {
        src: '-min.js',
        min: '.js'
      }
    }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${dest}/js`))
  )
}

const imagesDev = ()=>{
  return (
    gulp.src('./src/img/**/**')
    .pipe(gulp.dest(`${dest}/img`))
  )
}

const imagesBuild = ()=>{
  return (
    gulp.src('./src/img/**/**')
    // .pipe(imagemin([
    //   imagemin.gifsicle({interlaced: true}),
    //   imagemin.jpegtran({progressive: true}),
    //   imagemin.optipng({optimizationLevel: 5}),
    //   imagemin.svgo()
    // ]))
    .pipe(gulp.dest(`${dest}/img`))
  )
}

const assets = ()=>{
  return (
    gulp.src('./src/assets/**/**')
    .pipe(gulp.dest(`${dest}/assets`))
  )
}

const php = () => {
  return (
    gulp.src('./src/php/**/**')
      .pipe(gulp.dest('./public/php'))
  )
}

const sitemapTask = ()=>{
  return (
    gulp.src('./public/**/*.html', {
      read: false
    })
    .pipe(sitemap({
      siteUrl: siteUrl // remplazar por tu dominio
    }))
    .pipe(gulp.dest(`${dest}`))
  )
}
const robotsTask = ()=>{
  return (
    gulp.src('./public/**/*.html')
      .pipe(robots({
        useragent: '*',
        allow: [''],
        disallow: ['cgi-bin/']
      }))
      .pipe(gulp.dest(`${dest}`))
  )
}

const tsTask = ()=>{
  return (
    tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(`${dest}/ts`))
  )
}

const cache = ()=> {
  return (
    gulp.src('./public/**/*.html')
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest(dest))
  )
}

const serverInit = (done)=>{
  server.init({
    server: {
      baseDir: dest
    }
  })
}

const watch1 = ()=>{
  console.log('watch')
  watch(['src/scss/**.**'], ()=>{stylesDev})
}

gulp.task('dev', gulp.series(stylesDev,scriptsDev,pugDev,imagesDev,assets,php,(done)=>{
  if (!wordPress){
    server.init({
      server: {
        baseDir: './public'
      }
    })    
  }else{
    server.init({
      port: 8888,
      baseDir: `./wordpress`,
      proxy: urlLocal,
      notify: false
    });
  }
  gulp.watch('./src/scss/**/**').on('change', gulp.series(stylesDev))
  gulp.watch('./src/pug/**/**').on('change', gulp.series(pugDev,server.reload))
  gulp.watch('./src/data/**/**').on('change', gulp.series(pugDev,server.reload))
  gulp.watch('./src/js/**/**').on('change', gulp.series(scriptsDev,server.reload))
  gulp.watch('./src/php/**/**').on('change', gulp.series(php))
  gulp.watch('./src/img/**/**', gulp.series(imagesDev,server.reload))
  gulp.watch('./src/assets/**/**', gulp.series(assets,server.reload))
  done()
}))

gulp.task('build', gulp.series(stylesBuild,pugBuild,scriptsBuild,imagesBuild,assets,cache,sitemapTask,robotsTask,php))


exports.stylesDev = stylesDev
exports.stylesBuild = stylesBuild
exports.pugDev = pugDev
exports.pugBuild = pugBuild
exports.scriptsDev = scriptsDev
exports.scriptsBuild = scriptsBuild
exports.imagesDev = imagesDev
exports.imagesBuild = imagesBuild
exports.assets = assets
exports.sitemapTask = sitemapTask
exports.cache = cache
exports.robotsTask = robotsTask
exports.tsTask =  tsTask
exports.php =  php
// exports.dev = dev
