'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TemplateHelper = require('server/helper/TemplateHelper');

var _TemplateHelper2 = _interopRequireDefault(_TemplateHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConfirmationHelper = function () {
  function ConfirmationHelper() {
    _classCallCheck(this, ConfirmationHelper);
  }

  _createClass(ConfirmationHelper, null, [{
    key: 'render_text',
    value: function render_text(question, userProfile, questionFlow, userResponse) {
      var responses = question.fields.map(function (field) {
        var qid = questionFlow.findQidWithAnchor(field.anchor);
        if (qid == -1) {
          return null; // TODO
        }
        var question = questionFlow.findQuestionWithQid(qid);

        var response = userResponse.userResponses.filter(function (response) {
          return response.qid == qid;
        }).reduce(function (latest, current) {
          return current.timeOfMessage > latest.timeOfMessage ? current : latest;
        });

        var response_text = question.type == 'question' ? question.options.find(function (opt) {
          return opt.resp_payload == response.payload;
        }).text : response.payload;

        return field.title + ': ' + response_text;
      }).join('\n');

      return (0, _TemplateHelper2.default)(question.text, userProfile) + '\n' + responses;
    }
  }, {
    key: 'quick_replies',
    value: function quick_replies(question, _userProfile, _userResponse) {
      return question.fields.map(function (field) {
        return {
          content_type: 'text',
          title: field.title,
          payload: field.anchor
        };
      });
    }
  }]);

  return ConfirmationHelper;
}();

exports.default = ConfirmationHelper;
//# sourceMappingURL=ConfirmationHelper.js.map