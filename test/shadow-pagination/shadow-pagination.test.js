const shadowPagination = require('../../src/shadow-pagination/shadow-pagination');

test('hello jest', () => {
  const el = document.createElement('shadow-pagination');

  expect(el.count).toBe(1);
});
