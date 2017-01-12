var path = require("path");
var webpack = require('webpack');
//强制CSS不打包进js文件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//framework7 path
var __fnui = __dirname + '/assets/fnui/dist';
var __jquery = __dirname + '/bower_components/jquery/dist';
var __angular = __dirname + '/assets/angular';


module.exports = {
  // the main entry of webapp
  // can be multiple entries
  entry: {
      app: ['./src/scripts/index.js'],
      vendor: [
          'angular',
          'angular-route',
          'angular-resource',
          'angular-animate',
          'angular-smooth-scroll'
      ]
  },

  // output configuration
  output: {
    //The output directory as an absolute path (required).
    path: __dirname + '/dist/',

    //The webpack-dev-server will serve the files in the current directory, unless you configure a specific content base.
    contentBase: 'dist/',

    //Specifies the name of each output file on disk. 
    //You must not specify an absolute path here! 
    //The output.path option determines the location on disk the files are written. 
    filename: 'scripts/app.js'

    //publicPath specifies the public URL address of the output files when referenced in a browser
    //useless
    //publicPath:'/assets/'
  },


  //options affecting the resolving of modules
  resolve: {
    //replace modules with other modues or paths
    // f7 alias
    alias: {
        'angular':__angular + '/angular.min.js',
        'angular-route':__angular + '/angular-route.min.js',
        'angular-resource':__angular + '/angular-resource.min.js',
        'angular-animate':__angular + '/angular-animate.min.js',
        'angular-smooth-scroll':__angular + '/angular-smooth-scroll.js',
        'fnui.css': __fnui + '/css/fnui.min.css'
    }

    //the directory (absolute path) that contains your modules
    //root:[
        //path.resolve('./app/modules')
    //]
  },

  // how modules should be transformed
  module: {
    //an array of automaticlly applied loaders
    //  test: A condition that must be met
    //  exclude: A condition that must not be met
    //  include: An array of paths or files where the imported files will be transformed by the loader
    //  loader : a string of "!" separated loaders
    //  loaders: an array of loaders as string 
    loaders: [
        // .css files
        {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
        // .less files 
        {test: /\.less$/, loader: ExtractTextPlugin.extract( "style-loader", 'css-loader?sourceMap!less-loader!autoprefixer-loader')},
        // .js files
        {test: /\.js$/, loader: 'babel', exclude: /(node_modules|bower_components)/ },
        // .html files
        {test: /\.html$/, loader: 'html'},
        // .png .jpg .jpeg .gif files
        {test: /\.(png|jpe?g|gif)$/, loader: 'url?limit=8192&name=images/[hash].[ext]'},

        //font loader
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&name=fonts/[hash].[ext]&mimetype=image/svg+xml'},
        {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&name=fonts/[hash].[ext]&mimetype=application/font-woff2'},
        {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&name=fonts/[hash].[ext]&mimetype=application/font-woff'},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&name=fonts/[hash].[ext]&mimetype=application/octet-stream'},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=fonts/[hash].[ext]'}
    ]
  },

  // configure babel-loader.
  // babel support CommonJS AMD CMD ES6 and so on ...  
  // babel loader is the best js loader
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },


  plugins: [
      new ExtractTextPlugin("app.css", {
          allChunks: true
      }),

      new webpack.optimize.CommonsChunkPlugin(
        /* chunkName= */"vendor", /* filename= */"scripts/vendor.js"
      )
  ]
};
