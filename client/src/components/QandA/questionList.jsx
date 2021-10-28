import React, {useState, useContext, useEffect} from 'react';
import Addanswer from './addAnswer.jsx';
import AnswerList from './answerList.jsx';
import axios from 'axios';


const QuestionList = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const [seeMoreAnswers, setSeeMoreAnswers] = useState(false);
  const toggleMoreAnswers = () => setSeeMoreAnswers(!seeMoreAnswers);
  const [addAnswerPopup, setAddAnswerPopup] = useState(false);
  const [questionHelpful, setQuestionHelpful] = useState(false);

  let moreAnswersBtn;
    if (Object.values(props.question.answers).length > 2) {
      moreAnswersBtn = <a className='see-more-answers-click' onClick={() => { toggleOpen(); toggleMoreAnswers();}}>
      &raquo;&nbsp;See more answers </a>
    }

  let sortedAnswerList = Object.values(props.question.answers);
  let others = [];
  let sellers = [];
   sortedAnswerList.forEach(answer => {
     if (answer.answerer_name === 'Seller') {
       sellers.push(answer);
     }else{
       others.push(answer)
     }
   })
   others = others.sort(function(a, b) {
    return b.helpfulness - a.helpfulness;
   })
   sellers = sellers.sort(function(a, b) {
    return b.helpfulness - a.helpfulness;
   })
   sortedAnswerList = sellers.concat(others);

   if(seeMoreAnswers === false){
     sortedAnswerList = sortedAnswerList.slice(0, 2);
    }

  const handleUpdateQuestionHelpfulness = () => {
    props.question.question_helpfulness++;
    axios
    .put(`http://localhost:3000/hr-rfp/qa/questions/${props.question.question_id}/helpful`)
    .then(res => {
      res.sendStatus(200)
    })
    .catch(err => console.log(err));
  };

  return (
      <div key={'question'} className='question-head'><a>Q:</a>&nbsp;&nbsp;{props.question.question_body}
        <a>&nbsp;&nbsp;|&nbsp;&nbsp;</a>
        <a>Helpful?&nbsp;</a>
        {questionHelpful ? <a>Yes({props.question.question_helpfulness})</a> :
        <a href='url'
          className='question-helpful-click'
          onClick={(e) =>
            { e.preventDefault(); handleUpdateQuestionHelpfulness(); setQuestionHelpful(true);}}>
            Yes({props.question.question_helpfulness})
        </a>}
        <a>&nbsp;&nbsp;|&nbsp;&nbsp;</a>
        <a href='url'
          className='add-answer-click'
          onClick={(e) => {
            e.preventDefault(); setAddAnswerPopup(true)}}>Add answer
        </a>
        <Addanswer questionBody={props.question.question_body} questionId={props.question.question_id} toggleUpdate={props.toggleUpdate} trigger={addAnswerPopup} setTrigger={setAddAnswerPopup}>
        </Addanswer>
        {sortedAnswerList.map((answer,index) =>
          <AnswerList key={index} answer={answer} />
        )}
        {isOpen === true ? null : moreAnswersBtn}
        {seeMoreAnswers===true ? <a className='see-more-answers-collapse' onClick={() => {toggleMoreAnswers(); toggleOpen()}}>
        &raquo;&nbsp;Collapse answers</a> : null}
      </div>
  )};

  export default QuestionList;