var path = require('path');
var bindings = require('../build/Release/spellchecker.node');

var Spellchecker = bindings.Spellchecker;

var defaultSpellcheck = null;
var defaultLang = 'en_US';

var ensureDefaultSpellCheck = function() {
  if (defaultSpellcheck) {
    return;
  }

  var lang = process.env.LANG;
  lang = lang ? lang.split('.')[0] : defaultLang;
  defaultSpellcheck = new Spellchecker();

  if (!setDictionary(lang, getDictionaryPath()) && lang !== defaultLang) {
    setDictionary(defaultLang, getDictionaryPath());
  }
};

var setDictionary = function(lang, dictPath) {
  ensureDefaultSpellCheck();
  return defaultSpellcheck.setDictionary(lang, dictPath);
};

var isMisspelled = function() {
  ensureDefaultSpellCheck();

  return defaultSpellcheck.isMisspelled.apply(defaultSpellcheck, arguments);
};

var checkSpelling = function() {
  ensureDefaultSpellCheck();

  return defaultSpellcheck.checkSpelling.apply(defaultSpellcheck, arguments);
};

var add = function() {
  ensureDefaultSpellCheck();

  defaultSpellcheck.add.apply(defaultSpellcheck, arguments);
};

var remove = function() {
  ensureDefaultSpellCheck();

  defaultSpellcheck.remove.apply(defaultSpellcheck, arguments);
};

var getCorrectionsForMisspelling = function() {
  ensureDefaultSpellCheck();

  return defaultSpellcheck.getCorrectionsForMisspelling.apply(defaultSpellcheck, arguments);
};

var getAvailableDictionaries = function() {
  ensureDefaultSpellCheck();

  return defaultSpellcheck.getAvailableDictionaries.apply(defaultSpellcheck, arguments);
};

var getDictionaryPath = function() {
  var dict = path.join(__dirname, '..', 'vendor', 'hunspell_dictionaries');
  try {
    // HACK: Special case being in an asar archive
    var unpacked = dict.replace('.asar' + path.sep, '.asar.unpacked' + path.sep);
    require('fs').statSync(unpacked)
    dict = unpacked;
  } catch (error) {
  }
  return dict;
}

module.exports = {
  setDictionary: setDictionary,
  add: add,
  remove: remove,
  isMisspelled: isMisspelled,
  checkSpelling: checkSpelling,
  getAvailableDictionaries: getAvailableDictionaries,
  getCorrectionsForMisspelling: getCorrectionsForMisspelling,
  Spellchecker: Spellchecker
};
