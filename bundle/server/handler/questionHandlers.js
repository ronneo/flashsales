'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.questionExpectMap = exports.questionHandlerMap = undefined;

var _TemplateHelper = require('server/helper/TemplateHelper');

var _TemplateHelper2 = _interopRequireDefault(_TemplateHelper);

var _ConfirmationHelper = require('server/helper/ConfirmationHelper');

var _ConfirmationHelper2 = _interopRequireDefault(_ConfirmationHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NEED_NO_ANSWER = true;
var NEED_ANSWER = false;

var URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

var questionHandlerMap = {
  'greeting': function greeting(psid, question, userProfile) {
    var message_payload = void 0;

    if (question.buttons && question.buttons.length > 0) {
      message_payload = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: (0, _TemplateHelper2.default)(question.text, userProfile),
            buttons: question.buttons.map(function (button) {
              return {
                type: 'web_url',
                url: button.url,
                title: button.title,
                webview_height_ratio: 'full'
              };
            })
          }
        }
      };
    } else {
      message_payload = {
        text: (0, _TemplateHelper2.default)(question.text, userProfile)
      };
    }

    return [{
      recipient: { id: psid },
      message: message_payload
    }, NEED_NO_ANSWER];
  },

  'question': function question(psid, _question, userProfile) {
    return [{
      recipient: { id: psid },
      message: {
        text: (0, _TemplateHelper2.default)(_question.text, userProfile),
        quick_replies: _question.options.map(function (option) {
          return {
            'content_type': 'text',
            'title': (0, _TemplateHelper2.default)(option.text, userProfile),
            'payload': option.resp_payload
          };
        })
      }
    }, NEED_ANSWER];
  },

  'input': function input(psid, question, userProfile) {
    var quick_replies = question.quick_replies || [];
    if (quick_replies.length === 0) {
      return [{
        recipient: { id: psid },
        message: { text: (0, _TemplateHelper2.default)(question.text, userProfile) }
      }, NEED_ANSWER];
    }
    return [{
      recipient: { id: psid },
      message: {
        text: (0, _TemplateHelper2.default)(question.text, userProfile),
        quick_replies: quick_replies.map(function (quick_reply) {
          return {
            content_type: quick_reply.content_type
          };
        })
      }
    }, NEED_ANSWER];
  },

  't&c': function tC(psid, question, userProfile) {
    return [{
      recipient: { id: psid },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: (0, _TemplateHelper2.default)(question.text, userProfile),
            buttons: [{
              type: 'web_url',
              url: question.url,
              title: (0, _TemplateHelper2.default)(question.urlText, userProfile),
              'webview_height_ratio': 'compact'
            }]
          }
        }
      }
    }, NEED_NO_ANSWER];
  },

  'carousel': function carousel(psid, question, userProfile) {
    return [{
      recipient: { id: psid },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: question.elements.map(function (element) {
              var obj = {
                title: (0, _TemplateHelper2.default)(element.title, userProfile),
                subtitle: (0, _TemplateHelper2.default)(element.subtitle, userProfile),
                image_url: element.image_url
              };

              if (element.image_url) {
                obj.image_url = element.image_url;
              }

              if (element.buttons && element.buttons.length > 0) {
                obj.buttons = element.buttons.map(function (button) {
                  if (button.next || !button.url.match(URL_REGEXP)) {
                    return {
                      type: 'postback',
                      title: (0, _TemplateHelper2.default)(button.title, userProfile),
                      payload: button.next
                    };
                  } else {
                    return {
                      type: 'web_url',
                      title: (0, _TemplateHelper2.default)(button.title, userProfile),
                      url: button.url
                    };
                  }
                });
              }

              return obj;
            })
          }
        }
      }
    }, question.next ? NEED_NO_ANSWER : NEED_ANSWER];
  },
  'image': function image(psid, question, userProfile) {
    return [{
      recipient: { id: psid },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: question.url,
            is_reusable: true
          }
        }
      }
    }, NEED_NO_ANSWER];
  },
  'confirmation': function confirmation(psid, question, userProfile, questionFlow, userResponse) {
    if (psid == 0) {
      // TODO: Hack. AppEvent.jsx is calling this without actual request
      // making render_text fail.
      // should extract NEED_ANSWER & NEED_NO_ANSWER to a separate method
      return [{}, NEED_ANSWER];
    } else {
      return [{
        recipient: { id: psid },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'button',
              text: _ConfirmationHelper2.default.render_text(question, userProfile, questionFlow, userResponse),
              buttons: [{
                type: 'postback',
                title: question.confirmation_prompt || 'Confirm',
                payload: '__confirm__'
              }]
            }
          },
          quick_replies: _ConfirmationHelper2.default.quick_replies(question, userProfile, userResponse)
        }
      }, NEED_ANSWER];
    }
  }
};

exports.questionHandlerMap = questionHandlerMap;
var questionExpectMap = exports.questionExpectMap = {
  'question': 'quick_reply',
  'input': 'text_input',
  'carousel': 'postback',
  'confirmation': 'confirmation'
};
//# sourceMappingURL=questionHandlers.js.map