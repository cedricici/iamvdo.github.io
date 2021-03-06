exports.config =
  paths:
    public: '../public'
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^vendor/
      order:
        after: ['app/js/main.js']
    stylesheets:
      joinTo:
        'css/app.css': /^app/
        'css/vendor.css': /^vendor/
      order:
        before: ['app/css/main.css','app/css/svg.css']
    templates:
      joinTo: 'app.js'
  modules:
    wrapper: false
    definition: false
  plugins:
    imageoptimizer:
      smushit: false
      path: '/'
