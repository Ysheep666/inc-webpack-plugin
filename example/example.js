require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success require ensure 1', a);
}, 'chunkName1');

require.ensure(['./b'], function() {
	var b = require('./b');
    console.log('success require ensure 2', b);
});
