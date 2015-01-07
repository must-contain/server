var Promise = require('bluebird');

var phrases = [
    'Your password must contain kittens'
];

/**
 * Return all phrases available
 */
module.exports.all = function all () {
    return Promise.resolve(phrases);
};

/**
 * Return multiple random phrases
 */
module.exports.random = function random (n) {
    var len = phrases.length;
    n = Math.min(n || 1, len);

    var result = new Array(n);
    var taken = new Array(len);

    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = phrases[x in taken ? taken[x] : x];
        taken[x] = --len;
    }

    return Promise.resolve(result);
};
