var Promise = require('bluebird');
var util = require('util');

var languages = require('./lang');


function selectRandom (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


function generateStandAlone (langData) {
    return util.format(
        langData.base_phrase,
        selectRandom(langData.stand_alone)
    );
}


function generateSingleItem (langData) {
    return "X";
}


function joinItems (items, middle, last) {
    var result = "";
    var len = items.length;
    for (var i = 0; i < len; i++) {
        if (i > 0) {
            result += (i < len-1) ? middle : last;
        }

        result += items[i];
    }

    return result;
}


function generateItemBased (langData) {
    // First, decide how many items:
    // - 1 item (40%)
    // - 2 items (30%)
    // - 3 items (20%)
    // - 4 items (10%)
    var itemCount = 0;
    var rn = Math.random();
    if (rn <= 0.4) {
        itemCount = 1;
    } else if (rn <= 0.7) {
        itemCount = 2;
    } else if (rn <= 0.9) {
        itemCount = 3;
    } else {
        itemCount = 4
    }

    // Now, generate all items
    var items = new Array(itemCount);
    for (var i = 0; i < itemCount; i++) {
        items[i] = generateSingleItem(langData);
    }

    // Last step is to join using OR / AND
    var finalPhrase;
    if (Math.random() < 0.4) {
        finalPhrase = joinItems(items, langData.join_or_middle, langData.join_or_end);
    } else {
        finalPhrase = joinItems(items, langData.join_and_middle, langData.join_and_end);
    }

    // Generate result
    return util.format(
        langData.base_phrase,
        finalPhrase
    );
}


function generateOne (langData) {
    // 10% chance of "stand-alone" phrase
    if (Math.random() <= 0.1) {
        return generateStandAlone(langData);
    } else {
        return generateItemBased(langData);
    }
}


/**
 * Return multiple random phrases
 */
module.exports.generate = function generate (num, lang) {
    if (! lang in languages) {
        throw new Exception();
    }

    var usedLangData = languages[lang];

    var promises = new Array(num);
    for (var i = 0; i < num; i++) {
        promises[i] = new Promise(function (accept, reject) {
            try {
                accept(generateOne(usedLangData));
            } catch (exc) {
                reject(exc);
            }
        });
    }

    return Promise.all(promises);
};
