import React, {useState, useContext, useEffect} from 'react';
import QuestionList from './questionList.jsx';
import AddQuestion from './addQuestion.jsx';
import { ProductContext } from "../../App.jsx";
import axios from 'axios';
import { questionList } from './sampledata';

const QandA = (props) => {
  // const [product, setProduct] = useContext(ProductContext);
  const [questionData, setQuestionData] = useState(questionList.results);
  const [searching, setSearching] = useState('');
  const [seeMoreQuestions, setSeeMoreQuestions] = useState(false);
  const [addQuestionPopup, setAddQuestionPopup] = useState(false);
  const [count, setCount] = useState(4);
  const [update, setUpdate] = useState(false);
  const toggleUpdate = () => setUpdate(!update);

  let searchResult = questionData.slice(0, count);
  searchResult= Object.values(searchResult).sort(function(a, b) {
    return b.question_helpfulness - a.question_helpfulness;
   })

  const increaseByTwo = () => {
    setCount(count + 2);
  };

  let moreQuestionsBtn;
  let collapseQuestionsBtn;
  if (questionData.length > 4) {
    moreQuestionsBtn =
    <div><button className='see-more-questions' onClick={() => {increaseByTwo();}}>
    More Answered Questions</button></div>;
    if(count >= questionData.length) {
      moreQuestionsBtn = null;
      collapseQuestionsBtn = <div><button className='see-more-questions' onClick={() => {setCount(4)}}>
      Collapse all Questions</button></div>
    }
  }

  if (searching.length >= 3) {
    moreQuestionsBtn = null;
    searchResult = questionData.filter((question) => {
      const questionContent = question.question_body.toLowerCase();
      return questionContent.includes(searching);
    });
  }

  // useEffect(() => {
  //   axios
  //   .get(`http://localhost:3000/hr-rfp//qa/questions/?product_id=${product.product_id}`,
  //   { params: { count: 30 } })
  //   .then(res => {
  //     setQuestionData(res.data.results)
  //   })
  //   .catch(err => console.log(err));
  // }, [product.product_id, update]);

  return(
    <div id='qa'>
      <h3>Customer questions & answers</h3>
      <input className='search' type='text' value={searching} placeholder='Have a question? Search for answers…' onChange={() => setSearching(event.target.value)} />
      <div id='body'>
        {searchResult.map((question,index) =>
          <QuestionList key={index} question={question} toggleUpdate={toggleUpdate}/>)}
        {moreQuestionsBtn}
        {collapseQuestionsBtn}
      </div>
      <button className='ask-question-btn' onClick={(e) => {e.preventDefault(); setAddQuestionPopup(true)}}>
        Ask your question
      </button>
      <AddQuestion trigger={addQuestionPopup} setTrigger={setAddQuestionPopup}>
      </AddQuestion>
    </div>
  )
};

export default QandA;

