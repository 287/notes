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

#### get object type
```javascript
/**
 * @description get object type
 * @param {Object}
 * @return {String}
 */
function typeOf(o) {
	return Object.prototype.toString.call(o).match(/ (\w+)/)[1].toLowerCase();
}
```
