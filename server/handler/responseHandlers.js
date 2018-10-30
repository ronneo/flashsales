export let responseHandlerMap = {
  'genesis': (_message, _event, _questionFlow, _userProgress, _userResponse) => {
    return new Promise((_resolve, reject) => {
      reject();
    });
  },

  'quick_reply': (message, event, questionFlow, userProgress, userResponse) => {
    return new Promise((resolve, reject) => {
      let quick_reply = message.quick_reply;
      let timeOfMessage = event.timestamp;
      if (quick_reply) {
        let payload = quick_reply.payload;
        let {stopAtQid} = userProgress.userProgress;
        let nextQid = userProgress.findNextQid(questionFlow, payload);
        userResponse.push({ qid: stopAtQid, timeOfMessage, payload })
          .then(() => {
            resolve({nextQid});
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error('reply is not quick_reply.'));
      }
    });
  },

  'text_input': (message, event, questionFlow, userProgress, userResponse) => {
    return new Promise((resolve, reject) => {
      let messageText = message.text;
      let timeOfMessage = event.timestamp;
      if (messageText) {
        let payload = messageText;
        let {stopAtQid} = userProgress.userProgress;
        let nextQid = userProgress.findNextQid(questionFlow);
        userResponse.push({ qid: stopAtQid, timeOfMessage, payload })
          .then(() => {
            resolve({nextQid});
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error('reply is not text_input.'));
      }
    });
  },

  'postback': (message, event, questionFlow, userProgress, userResponse) => {
    return new Promise((resolve, reject) => {
      let timeOfMessage = event.timestamp;

      let payload = message;
      let {stopAtQid} = userProgress.userProgress;
      let nextQid = userProgress.findNextQid(questionFlow, payload);

      userResponse.push({ qid: stopAtQid, timeOfMessage, payload })
      .then(() => {
        resolve({nextQid});
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  'confirmation': (message, event, questionFlow, userProgress, _userResponse) => {
    return new Promise((resolve, _reject) => {
      if (message == '__confirm__') {
        // if it's a confirm, process as usual
        let nextQid = userProgress.findNextQid(questionFlow, message);
        resolve({nextQid});
      } else {
        // else go back to the selected question
        let anchor = message.quick_reply.payload;
        let nextQid = questionFlow.findQidWithAnchor(anchor);
        let isGoingBack = true;
        resolve({nextQid, isGoingBack});
      }
    });
  },

  'finished': (_message, _event, _questionFlow, _userProgress, _userResponse) => {
    return new Promise((_resolve, reject) => {
      reject();
    });
  },
};
