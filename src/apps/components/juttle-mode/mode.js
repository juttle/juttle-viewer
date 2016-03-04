// a Juttle mode for the ACE editor
/* global ace */
ace.define('ace/mode/juttle_highlight_rules',['require','exports','module','ace/lib/oop','ace/mode/text_highlight_rules'], function(acequire, exports, module) {
    'use strict';

    var oop = acequire('ace/lib/oop');
    var TextHighlightRules = acequire('ace/mode/text_highlight_rules').TextHighlightRules;

    var JuttleHighlightRules = function() {
        var keywords = 'const|else|error|export|if|import|input|return|var';

        var storage = 'function|reducer|sub';

        var procs = '#|?|alert|batch|dropped|emit|fields|filter|head|http|join|keep|pace|pass|publish|put|read|reduce|remove|sort|source|spaces|split|streams|subscribe|tail|unbatch|uniq|write';

        var constants = 'false|null|true';

        var keywordMapper = this.createKeywordMapper({
            'keyword.control' : keywords,
            'entity.name.function' : procs,
            'keyword.function' : storage,
            'constant.language' : constants
        }, 'identifier');

        this.$rules = {
            'start' : [
                {
                    token : 'comment',
                    regex : '\\/\\/.*$'
                }, {
                    token: 'comment',
                    regex: '\\/\\*',
                    next : 'comment'
                }, {
                    token: 'string',           // ' string
                    regex: '".*?"'
                }, {
                    token: 'string',           // ' string
                    regex: '\'.*?\''
                },
                // moments
                {
                    'regex': ':\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}:\\d{2}(\.\\d*)?)?(Z|[+-]\\d{2}:\\d{2}|[+-]\\d{4})?:',
                    'token': 'string'
                },
                {
                    'regex': ':\\d{2}:\\d{2}:\\d{2}(\.\\d*)?:',
                    'token': 'string'
                },
                {
                    'regex': ':(now|beginning|end|forever|yesterday|today|tomorrow|(\\d+(\.\\d*)?|\.\\d+)(ms|[smhdwMy])?):',
                    'token': 'string'
                },
                {
                    'regex': ':((\\d+(\.\\d*)?|\.\\d+)[ ]+)?(millisecond|second|minute|hour|day|week|month|year)[s]?(([ ]+and[ ]+(\\d+[ ]+)?(millisecond|second|minute|hour|day|week|month|year)[s]?)|[ ]+(ago|from[ ]+now))*:',
                    'token': 'string'
                },
                // end moments
                {
                    token: 'constant.numeric', // float
                    regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b'
                }, {
                    token: keywordMapper,
                    regex : '[a-zA-Z_$][a-zA-Z0-9_$]*\\b'
                }, {
                    token : 'paren.lparen',
                    regex : '[\\(]'
                }, {
                    token : 'paren.rparen',
                    regex : '[\\)]'
                }, {
                    token : 'entity.name.function',
                    regex : /@\w+/
                }, {
                    token : 'entity.name.',
                    regex : /\\-\w+/
                }, {
                    token : 'text',
                    regex : '\\s+'
                }
            ],
            'comment' : [
                {
                    token : 'comment', // closing comment
                    regex : '.*?\\*\\/',
                    next : 'start'
                }, {
                    token : 'comment', // comment spanning whole line
                    regex : '.+'
                }
            ]
        };
    };

    oop.inherits(JuttleHighlightRules, TextHighlightRules);

    exports.JuttleHighlightRules = JuttleHighlightRules;
});

ace.define('ace/mode/juttle',['require','exports','module','ace/lib/oop','ace/mode/text','ace/mode/juttle_highlight_rules','ace/range'], function(acequire, exports, module) {
    'use strict';

    var oop = acequire('ace/lib/oop');
    var TextMode = acequire('ace/mode/text').Mode;
    var JuttleHighlightRules = acequire('./juttle_highlight_rules').JuttleHighlightRules;

    var Mode = function() {
        this.HighlightRules = JuttleHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.$id = 'ace/mode/juttle';

        this.lineCommentStart = '//';
        this.blockComment = {
            start: '/*',
            end: '*/'
        };
    }).call(Mode.prototype);

    exports.Mode = Mode;

});
