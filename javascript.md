# javascript

#### multi line string
```javascript
/**
 * @description get multi line string method
 * @param {Function}
 * @return {String}
 */
function getString(fn) {
	var s = fn.toString();
	s = s.substring(s.indexOf('/*') + 2, s.lastIndexOf('*/'));
	s = s.replace(/^*?!?(@preserve)?\r?\n?|\r?\n?$/g, '');
	return s;
}
```
