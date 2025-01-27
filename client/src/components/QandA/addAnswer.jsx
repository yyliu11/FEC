import React, {useState, useContext} from 'react';
import { ProductContext } from "../../App.jsx";
import axios from 'axios';


const Addanswer = (props) => {
  const [product, setProduct] = useContext(ProductContext);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState([]);
  const [errors, setErrors] = useState({});

  const handleValidation = () => {
    let isValid = true;
    let errors = {};
    if(name.length === 0) {
      isValid = false;
      errors['name'] = 'Please fill out this field'
    }
    if(body.length === 0) {
      isValid = false;
      errors['body'] = 'Please fill out this field'
    }
    if(typeof email !== undefined){
      let lastAtPos = email.lastIndexOf('@');
      let lastDotPos = email.lastIndexOf('.');
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 &&
         lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
           isValid = false;
           errors["email"] = "Email is invalid";
      }
    }
    setErrors(errors);
    if(isValid) {
      submitForm();
      props.setTrigger();
    }
  };

  const submitForm = () => {
    axios
      .post(`http://localhost:3000/hr-rfp/qa/questions/${props.questionId}/answers`,
            {body: body, name: name, email: email, photos: photo})
      .then((res) => {
        props.toggleUpdate();
        alert('Answer posted!');
        setName('');
        setBody('');
        setEmail('');
        setPhoto([]);
      })
      .catch((err) => {
        alert('Post failed...');
        setName('');
        setBody('');
        setEmail('');
        setPhoto([]);
      });
  };

  return (props.trigger) ? (
    <div className='popup'>
      <div className='inner'>
        <h4 id='answer-modal-title'>Submit your Answer</h4>
        <h3>{product.currentProduct.name}: {props.questionBody}</h3>
        <form>
          <label><span className='red-star'>*</span>Your Answer:</label>
          <div>
            <textarea maxLength='1000' id="type-answer" value={body} onChange={(e) => setBody(e.target.value)}></textarea>
            <span className='error' style={{color: "red"}}>{errors["body"]}</span>
          </div>
          <label><span className='red-star'>*</span>What is your nickname:</label>
          <input type='text' className='answer-name' value={name} maxLength='60' placeholder="Example: jack543!" onChange={(e) => setName(e.target.value)}></input>
          <span className='error' style={{color: "red"}}>&nbsp;&nbsp;{errors["name"]}</span>
          <p className='popup-text'>For privacy reasons, do not use your full name or email address</p>
          <label><span className='red-star'>*</span>Your email:</label>
          <input type='text' className='answer-email' value={email} maxLength='60' placeholder="Example: jack@email.com" onChange={(e) => setEmail(e.target.value)}></input>
          <span className='error' style={{color: "red"}}>&nbsp;&nbsp;{errors["email"]}</span>
          <p className='popup-text'>For authentication reasons, you will not be emailed</p>
          <label>Upload your photos:</label>
          <PhotoUploader photo={photo} setPhoto={setPhoto} />
          <button className='close-btn' onClick={() => {props.setTrigger();setErrors({}); setName(''); setBody(''); setEmail(''); setPhoto([]); }}>Cancel</button>
          <button id='submit-answer-btn' onClick={(e) => { e.preventDefault(); handleValidation()}}>Submit</button>
        </form>
      </div>
    </div>
  ): '';
};

const PhotoUploader = ({photo, setPhoto}) => {
  const [alert, setAlert] = useState(false);

  const deleteSelected = (pic) => {
    var index = photo.indexOf(pic);
    const temp = [...photo];
    temp.splice(index, 1);
    setPhoto(temp);
    if (alert === true) { setAlert(false); }
  };

  const handlePhoto = (e) => {
    setPhoto(photo => [...photo, URL.createObjectURL(e.target.files[0])]);
    if (photo.length > 4) {
      setPhoto(photo.slice(0, 5));
      setAlert(true);
     }
  };

  return (
    <div className="photo-uploader">
      <input type="file" name="image-upload" id='select-photo' accept=".jpg, .jpeg, .png" onChange={handlePhoto}>
      </input>
      {photo.map((thumbnail,index) => {
        return (
        <>
        <img key={index} src={thumbnail} id='answer-img' onClick={() => {deleteSelected(thumbnail)}}/>
        </>
        )}
      )}
      {alert ? <a id='alert'>Exceeds maximum counts</a>: null}
    </div>
  )
};



export default Addanswer;