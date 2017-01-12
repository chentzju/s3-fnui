var gulp = require("gulp");
var gutil = require("gulp-util");
var fse = require('fs-extra');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var WebpackConfig = require("./webpack.config.js");



// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
    gulp.watch(["src/**/*","src/*"], ["webpack:build-dev"]);
});

gulp.task("webpack:build", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(WebpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        //Search for equal or similar files and deduplicate them in the output.
        // This comes with some overhead for the entry chunk, but can reduce file size effectively.
        new webpack.optimize.DedupePlugin(),
        //Minimize all JavaScript output of chunks. 
        //Loaders are switched into minimizing mode.
        new webpack.optimize.UglifyJsPlugin()
    );

    // Ensures that a directory is empty.
    // Deletes directory contents if the directory is not empty. 
    // If the directory does not exist, it is created. The directory itself is not deleted.
    fse.emptyDirSync('dist');
    // run webpack
    // Node.js API
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));

        gulp.src('src/index.html').pipe(gulp.dest('dist'));
        gulp.src('src/404.html').pipe(gulp.dest('dist'));
        gulp.src('assets/jquery.min.js').pipe(gulp.dest('dist/scripts'));
        gulp.src('assets/fnui/dist/js/fnui.min.js').pipe(gulp.dest('dist/scripts'));
        fse.copySync('src/views', 'dist/views');
        //callback();
    });
});

gulp.task("webpack:build-dev", function(callback) {
    // modify some webpack config options
    var devConfig = Object.create(WebpackConfig);

    //A SourceMap is emitted
    devConfig.devtool = 'sourcemap';
    devConfig.debug = true;

    //complier is a instance of Complier
    // create a single instance of the compiler to allow caching
    var divComplier = webpack(devConfig);
    //compiler.run(callback)
    //- Builds the bundle(s). It makes an incremental build.
    divComplier.run(function(err, stats){
        if(err) throw new gutil.PluginError("webpack", err);

        gutil.log("[webpack]", stats.toString({
            // output options
            color: true
        }));

        //Copy a file or directory. Sync.
        fse.copySync('src/index.html', 'dist/index.html');
        gulp.src('assets/jquery.min.js').pipe(gulp.dest('dist/scripts'));
        gulp.src('assets/fnui/dist/js/fnui.min.js').pipe(gulp.dest('dist/scripts'));
        fse.copySync('src/views', 'dist/views');

        callback();
    });
});

//webpack dev server
//The webpack-dev-server is a little Node.js Express server
gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server

    //inline mode
    //(a small webpack-dev-server client entry is added to the bundle which refresh the page on change)
    var serverConfig = Object.create(WebpackConfig);
    // A SourceMap is emitted.
    // source code can be seen in dev enviroment
    serverConfig.devtool = '#sourcemap';
    serverConfig.debug = true;
    //add entry point
    serverConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080", "webpack/hot/dev-server");
    //add new webpack.HotModuleReplacementPlugin()
    serverConfig.plugins = serverConfig.plugins.concat(
        new webpack.HotModuleReplacementPlugin()
    );

    new WebpackDevServer(webpack(serverConfig), {
        //This modified bundle is served from memory at the relative path specified in publicPath
        //publicPath:"/assets/"
        //
        contentBase: serverConfig.output.contentBase,
   hot: true,
        stats: {
            color: true
        }
    }).listen(8080, function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/");
    });
});


