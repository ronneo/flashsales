'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var responseHandlerMap = exports.responseHandlerMap = {
  'genesis': function genesis(_message, _event, _questionFlow, _userProgress, _userResponse) {
    return new Promise(function (_resolve, reject) {
      reject();
    });
  },

  'quick_reply': function quick_reply(message, event, questionFlow, userProgress, userResponse) {
    return new Promise(function (resolve, reject) {
      var quick_reply = message.quick_reply;
      var timeOfMessage = event.timestamp;
      if (quick_reply) {
        var payload = quick_reply.payload;
        var stopAtQid = userProgress.userProgress.stopAtQid;

        var nextQid = userProgress.findNextQid(questionFlow, payload);
        userResponse.push({ qid: stopAtQid, timeOfMessage: timeOfMessage, payload: payload }).then(function () {
          resolve({ nextQid: nextQid });
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('reply is not quick_reply.'));
      }
    });
  },

  'text_input': function text_input(message, event, questionFlow, userProgress, userResponse) {
    return new Promise(function (resolve, reject) {
      var messageText = message.text;
      var timeOfMessage = event.timestamp;
      if (messageText) {
        var payload = messageText;
        var stopAtQid = userProgress.userProgress.stopAtQid;

        var nextQid = userProgress.findNextQid(questionFlow);
        userResponse.push({ qid: stopAtQid, timeOfMessage: timeOfMessage, payload: payload }).then(function () {
          resolve({ nextQid: nextQid });
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('reply is not text_input.'));
      }
    });
  },

  'postback': function postback(message, event, questionFlow, userProgress, userResponse) {
    return new Promise(function (resolve, reject) {
      var timeOfMessage = event.timestamp;

      var payload = message;
      var stopAtQid = userProgress.userProgress.stopAtQid;

      var nextQid = userProgress.findNextQid(questionFlow, payload);

      userResponse.push({ qid: stopAtQid, timeOfMessage: timeOfMessage, payload: payload }).then(function () {
        resolve({ nextQid: nextQid });
      }).catch(function (err) {
        reject(err);
      });
    });
  },

  'confirmation': function confirmation(message, event, questionFlow, userProgress, _userResponse) {
    return new Promise(function (resolve, _reject) {
      if (message == '__confirm__') {
        // if it's a confirm, process as usual
        var nextQid = userProgress.findNextQid(questionFlow, message);
        resolve({ nextQid: nextQid });
      } else {
        // else go back to the selected question
        var anchor = message.quick_reply.payload;
        var _nextQid = questionFlow.findQidWithAnchor(anchor);
        var isGoingBack = true;
        resolve({ nextQid: _nextQid, isGoingBack: isGoingBack });
      }
    });
  },

  'finished': function finished(_message, _event, _questionFlow, _userProgress, _userResponse) {
    return new Promise(function (_resolve, reject) {
      reject();
    });
  }
};
//# sourceMappingURL=responseHandlers.js.map