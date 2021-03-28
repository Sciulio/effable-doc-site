const { join } = require('path');
const build = require('@sciulio/effable');


const inDevelopmentMode = process.env.NODE_ENV !== 'production';

const {
  SERVING_URL_DOMAIN,
  BUILD_FOLDER_OUT,
  BUILD_FOLDER_SOURCES
} = process.env;


build({
  paths: {
    assets: join(BUILD_FOLDER_SOURCES, 'assets'),
    data: join(BUILD_FOLDER_SOURCES, 'data'),
    partials: join(BUILD_FOLDER_SOURCES, 'partials'),
    views: join(BUILD_FOLDER_SOURCES, 'views'),
    out: './' + BUILD_FOLDER_OUT
  },
  host: {
    virtualPath: '/',
    baseUrl: SERVING_URL_DOMAIN,
    resxUrl: SERVING_URL_DOMAIN,
  },
  options: {
    siteMap: true,
    robots: true
  },
  helpers: {
  }
}, {
  'markdown-it': mit => new mit({
    html: true,
    //breaks: true, => use br
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externally.
    // If result starts with <pre... internal wrapper is skipped.
    highlight: function (/*str, lang*/) { return ''; }
  }),
  'handlebars': hbs => {
    //require('handlebars-helpers')();
    //require('handlebars-layouts').register(hbs);

    // example helper
    hbs.registerHelper('contains', function (value, contains) {
      return ~value.indexOf(contains);
    });
    hbs.registerHelper('objectify', function ({ hash }) {
      return hash;
    });
    hbs.registerHelper('arraify', function (...args) {
      return args.filter((_, idx) => idx < args.length - 1);
    });
    hbs.registerHelper('assign', function (context) {
      const { hash, data } = context;

      Object.assign(data, hash);
    });
    hbs.registerHelper('unassign', function (...args) {
      const { data: { root } } = args.pop();

      args.forEach(prop => delete root[prop]);
    });
    
    hbs.registerHelper('get', function (...args) {
      args.pop();
      let [item, ...props] = args;
      console.log('get-------------------------')
      props = props.reduce((list, prop) => ([
        ...list,
        ...prop.split('.')
      ]), []);
      console.log(props.reduce((result, prop) => result[prop], item))
      console.log(props)

      return props.reduce((result, prop) => result[prop], item);
    });

    hbs.registerHelper('JSON', function (value) {
      return new hbs.SafeString(`
      <small><pre><code>
      ${JSON.stringify(value, null, 2)}
      </code></pre></small>
      `);
    });

    return hbs;
  }
})
.then(res => {
  console.log('DONE!')
})
.catch(rej => {
  console.error('ERROR!', rej)
  console.error(rej)
});