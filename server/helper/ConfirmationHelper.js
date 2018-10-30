import render_template from 'server/helper/TemplateHelper';

export default class ConfirmationHelper {
  static render_text(question, userProfile, questionFlow, userResponse) {
    let responses = question.fields.map((field) => {
      let qid = questionFlow.findQidWithAnchor(field.anchor);
      if (qid == -1) {
        return null;  // TODO
      }
      let question = questionFlow.findQuestionWithQid(qid);

      let response = userResponse.userResponses
        .filter(response => (response.qid == qid))
        .reduce((latest, current) => {
          return (
            (current.timeOfMessage > latest.timeOfMessage) ?
            current:
            latest
          );
        });

      let response_text = (question.type == 'question') ?
        question.options.find(opt => opt.resp_payload == response.payload).text :
        response.payload;

      return `${field.title}: ${response_text}`;
    }).join('\n');

    return `${render_template(question.text, userProfile)}
${responses}`;
  }

  static quick_replies(question, _userProfile, _userResponse) {
    return question.fields.map((field) => {
      return {
        content_type: 'text',
        title: field.title,
        payload: field.anchor,
      };
    });
  }
}
