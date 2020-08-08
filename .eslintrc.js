module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "standard",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
	"rules": {
        "padded-blocks": 0,
        "generator-star-spacing": "off",
        "semi": ["error", "never"],
		"indent": [1, 4],
		"no-tabs": 0,
		"no-unused-vars": 2,
		"no-use-before-define": 2,
		"quotes": ["error", "single"],
		"curly": ["error", "all"],
		"no-loop-func": "error",
        "no-path-concat": "error",
        'lines-around-comment': ['error', { 'beforeLineComment': true, 'allowClassStart': false }],
        'newline-before-return': 'error',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
	}
};