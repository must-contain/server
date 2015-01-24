var Promise = require('bluebird');
var util = require('util');

var languages = require('./lang');


function selectRandom () {
    var totalLength = 0;
    for (var i = 0; i < arguments.length; i++) {
        totalLength += arguments[i].length;
    }

    var index = Math.floor(Math.random() * totalLength);

    for (var i = 0; i < arguments.length; i++) {
        if (index < arguments[i].length) {
            return arguments[i][index];
        }

        index -= arguments[i].length;
    }
}


function generateStandAlone (langData, options) {
    return util.format(
        langData.base_phrase,
        options.nc
            ? selectRandom(langData.stand_alone.cc_by_sa, langData.stand_alone.cc_by_nc)
            : selectRandom(langData.stand_alone.cc_by_sa)
    );
}


function generateSingleItem (langData, articleType) {
    // Filter words by article type
    var nouns = langData.nouns.filter(function (noun) {
        return noun.some(function (entry) {
            return (!entry.articles || entry.articles.indexOf(articleType) >= 0);
        });
    });


    // Select a noun
    var noun = selectRandom(nouns);

    // Filter articles by article type
    var arts = langData.articles.filter(function (art) {
        return art.type == articleType;
    });

    // Select a random article
    var art = selectRandom(arts);

    // Choose the suitable noun version
    var nounVer = selectRandom(noun.filter(function (nounVersion) {
        return nounVersion.categories.indexOf(art.category) >= 0;
    }));
    var word = nounVer.text;

    // Choose the article text
    var artText;
    if (typeof art.text === 'string') {
        artText = art.text;
    } else {
        if (nounVer.variant) {
            artText = art.text[nounVer.variant] || art.text._;
        } else {
            artText = art.text._;
        }
    }

    // Finished! Construct and return
    return util.format(artText, word);
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


function generateItemBased (langData, options) {
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

    // Select the type of article to use: 20% "any", 80% random
    var article = null;
    if (Math.random() <= 0.9) {
        article = selectRandom(langData.article_types);
    }

    // Now, generate all items
    var items = new Array(itemCount);
    for (var i = 0; i < itemCount; i++) {
        items[i] = generateSingleItem(langData, article || selectRandom(langData.article_types));
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


function generateOne (langData, options) {
    // 10% chance of "stand-alone" phrase
    //if (Math.random() <= 0.1) {
        return generateStandAlone(langData, options);
    //} else {
    //    return generateItemBased(langData, options);
    //}
}


/**
 * Return multiple random phrases
 */
module.exports.generate = function generate (num, lang, options) {
    if (! lang in languages) {
        throw new Exception();
    }

    var usedLangData = languages[lang];

    var promises = new Array(num);
    for (var i = 0; i < num; i++) {
        promises[i] = new Promise(function (accept, reject) {
            try {
                accept(generateOne(usedLangData, options));
            } catch (exc) {
                reject(exc);
            }
        });
    }

    return Promise.all(promises);
};
