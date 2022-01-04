import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import emojiByName from '../utils/lib/json/emoji.json'
import { toArray } from 'lodash'

class NodeEmoji {
    constructor(){
        this.emojiNameRegex = /:([a-zA-Z0-9_\-\+]+):/g;
        this.trimSpaceRegex = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        this.NON_SPACING_MARK = String.fromCharCode(65039); // 65039 - '️' - 0xFE0F;
        this.nonSpacingRegex = new RegExp(this.NON_SPACING_MARK, "g");
    }

    stripColons(str) {
        var colonIndex = str.indexOf(":");
        if (colonIndex > -1) {
            // :emoji: (http://www.emoji-cheat-sheet.com/)
            if (colonIndex === str.length - 1) {
                str = str.substring(0, colonIndex);
                return this.stripColons(str);
            } else {
                str = str.substr(colonIndex + 1);
                return this.stripColons(str);
            }
        }
    
        return str;
    }
    
    wrapColons(str) {
        return typeof str === "string" && str.length > 0 ? ":" + str + ":" : str;
    }
    
    ensureColons(str) {
        return typeof str === "string" && str[0] !== ":" ? this.wrapColons(str) : str;
    }
    
    stripNSB(code) {
        return code.replace(this.nonSpacingRegex, "");
    }
    
    emojiByCode() {
        return Object.keys(emojiByName).reduce(function(h, k) {
            h[stripNSB(emojiByName[k])] = k;
            return h;
        }, {});
    }
    
    _get(emoji) {
        if (emojiByName.hasOwnProperty(emoji)) {
            return emojiByName[emoji];
        }
        return this.ensureColons(emoji);
    };
    
    get(emoji) {
        emoji = this.stripColons(emoji);
        return this._get(emoji);
    };
    
    find(nameOrCode) {
        return this.findByName(nameOrCode) || this.findByCode(nameOrCode);
    };
    
    findByName(name) {
        var stripped = this.stripColons(name);
        var emoji = emojiByName[stripped];
        return emoji ? { emoji: emoji, key: stripped } : undefined;
    };
    
    findByCode(code) {
        var stripped = this.stripNSB(code);
        var name = this.emojiByCode()[stripped];
        return name ? { emoji: emojiByName[name], key: name } : undefined;
    };
    
    hasEmoji(nameOrCode) {
        return this.hasEmojiByName(nameOrCode) || this.hasEmojiByCode(nameOrCode);
    };
    
    hasEmojiByName(name) {
        var result = this.findByName(name);
        return !!result && result.key === this.stripColons(name);
    };
    
    hasEmojiByCode(code) {
        var result = this.findByCode(code);
        return !!result && this.stripNSB(result.emoji) === this.stripNSB(code);
    };
    
    which(emoji_code, includeColons) {
        var code = this.stripNSB(emoji_code);
        var word = this.emojiByCode()[code];
    
        return includeColons ? this.wrapColons(word) : word;
    };
    
    emojify(str, on_missing, format) {
        if (!str) return "";
        return str.split(this.emojiNameRegex).map((s, i) => {
            if (i % 2 === 0) return s;
            var emoji = Emoji._get(s);
            var isMissing = emoji.indexOf(":") > -1;
            if (isMissing && typeof on_missing === "function") {
                return on_missing(s);
            }
            if (!isMissing && typeof format === "function") {
                return format(emoji, s);
            }
            return emoji;
        }).join(""); // convert back to string
    };
    
    random() {
        var emojiKeys = Object.keys(emojiByName);
        var randomIndex = Math.floor(Math.random() * emojiKeys.length);
        var key = emojiKeys[randomIndex];
        var emoji = this._get(key);
        return { key: key, emoji: emoji };
    };
    
    search(str) {
        var emojiKeys = Object.keys(emojiByName);
        var matcher = this.stripColons(str);
        var matchingKeys = emojiKeys.filter(function(key) {
            return key.toString().indexOf(matcher) === 0;
        });
        return matchingKeys.map(function(key) {
            return {
                key: key,
                emoji: this._get(key)
            };
        });
    };
    
    unemojify(str) {
        if (!str) return "";
        var words = toArray(str);
        return words.map(function(word) {
            return this.which(word, true) || word;
        }).join("");
    };
    
    replace(str, replacement, cleanSpaces) {
        if (!str) return "";
        var replace = typeof replacement === "function" ? replacement : function(){return replacement;};
        var words = toArray(str);
        var replaced = words.map(function(word, idx) {
            var emoji = this.findByCode(word);
            if (emoji && cleanSpaces && words[idx + 1] === " ") {
                words[idx + 1] = "";
            }
            return emoji ? replace(emoji) : word;
        }).join("");
        return cleanSpaces ? replaced.replace(this.trimSpaceRegex, "") : replaced;
    };
    
    strip(str) {
        return this.replace(str, "", true);
    };
}

const Emoji = props => {
    const { name, size, style } = props
    const nodeEmoji = new NodeEmoji();
    const emoji = nodeEmoji.get(name);
    return (
        <Text style={[{fontSize: size}, style]}>
            { emoji }
        </Text>
    )
}

Emoji.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
}

Emoji.defaultProps = {
    name: 'heart',
    size: 24,
}

export default Emoji;
