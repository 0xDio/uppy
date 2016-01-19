var test = require('tape');
var Core = require('../src/core/index.js');

test('russian translation', function (t) {
  const russian = require('../src/locale/ru.js');
  const core = new Core({locale: russian});

  t.equal(
    core.translator.t('choose_file'),
    'Выберите файл',
    'should return translated string'
  );

  t.end();
});

test('interpolation', function (t) {
  const english = require('../src/locale/en_US.js');
  const core = new Core({locale: english});

  t.equal(
    core.translator.t('you_have_chosen', {'file_name': 'img.jpg'}),
    'You have chosen: img.jpg',
    'should return interpolated string'
  );

  t.end();
});

test('pluralization', function (t) {
  const russian = require('../src/locale/ru.js');
  const core = new Core({locale: russian});

  t.equal(
    core.translator.t('files_chosen', {'smart_count': '18'}),
    'Выбрано 18 файлов',
    'should return interpolated & pluralized string'
  );

  t.end();
});
