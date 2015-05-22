'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _normalizeUrl = require('normalize-url');

var _normalizeUrl2 = _interopRequireDefault(_normalizeUrl);

var _humanizeUrl = require('humanize-url');

var _humanizeUrl2 = _interopRequireDefault(_humanizeUrl);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _lodashStringCamelCase = require('lodash/string/camelCase');

var _lodashStringCamelCase2 = _interopRequireDefault(_lodashStringCamelCase);

var _lodashStringKebabCase = require('lodash/string/kebabCase');

var _lodashStringKebabCase2 = _interopRequireDefault(_lodashStringKebabCase);

module.exports = _yeomanGenerator2['default'].Base.extend({
  constructor: function constructor() {
    _yeomanGenerator2['default'].Base.apply(this, arguments);

    this.option('silent', {
      defaults: false,
      type: Boolean,
      hide: true
    });

    this.argument('githubUsername', {
      type: String,
      required: this.options.silent
    });
    this.argument('website', {
      type: String,
      required: this.options.silent
    });
  },

  init: function init() {
    var _this = this;

    var done = this.async(),
        silent = this.options.silent;

    this.prompt([{
      name: 'moduleName',
      message: 'What do you want to name your module?',
      'default': this.appname.replace(/\s/g, '-'),
      filter: function filter(val) {
        return (0, _lodashStringKebabCase2['default'])(val);
      },
      when: function when(props) {
        if (silent) {
          props.moduleName = _this.appname;
        }
        return !silent;
      }
    }, {
      name: 'githubUsername',
      message: 'What is your GitHub username?',
      'default': this.githubUsername,
      store: true,
      validate: function validate(val) {
        return val.length > 0 ? true : 'You have to provide a username';
      },
      when: function when(props) {
        if (silent) {
          props.githubUsername = _this.githubUsername;
        }
        return !silent;
      }
    }, {
      name: 'website',
      message: 'What is the URL of your website?',
      store: true,
      'default': this.website,
      validate: function validate(val) {
        return val.length > 0 ? true : 'You have to provide a website URL';
      },
      filter: function filter(val) {
        return (0, _normalizeUrl2['default'])(val);
      },
      when: function when(props) {
        if (silent) {
          props.website = _this.website;
        }
        return !silent;
      }
    }], function (props) {
      _this.moduleName = props.moduleName;
      _this.camelModuleName = (0, _lodashStringCamelCase2['default'])(props.moduleName);
      _this.githubUsername = props.githubUsername;
      _this.name = _this.user.git.name();
      _this.email = _this.user.git.email();
      _this.website = props.website;
      _this.humanizedWebsite = (0, _humanizeUrl2['default'])(_this.website);

      _this.template('editorconfig', '.editorconfig');
      _this.template('gitattributes', '.gitattributes');
      _this.template('gitignore', '.gitignore');
      _this.template('travis.yml', '.travis.yml');
      _this.template('src/index.js');
      _this.template('test/test.js');
      _this.template('LICENSE');
      _this.template('README.md');
      // needed so npm doesn't try to use it and fail
      _this.template('_package.json', 'package.json');

      done();
    });
  },

  install: function install() {
    this.npmInstall();
  }
});