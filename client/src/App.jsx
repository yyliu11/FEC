import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Overview from './components/overview/Overview.jsx';
import Outfits from './components/RelatedItems/Outfits.jsx';
import Ratings from './components/Ratings/Ratings.jsx';
import QandA from './components/QandA/QandA.jsx';
import { getProduct, getStyles, getRatings, postToApi } from './helperFunctions.js';

import items from './components/RelatedItems/sampleData.json';
import {questionList, answerList} from './components/QandA/sampledata.js';
import Stars from './Stars.jsx';

export const ProductContext = React.createContext([{}, () => {}]);

let App = () => {

  const [product, setProduct] = useState({
    product_id: 17069,
    currentProduct: {},
    styles: [],
    ratings: []
  })

  useEffect(() => {
    Promise.all([
      getProduct(product.product_id),
      getStyles(product.product_id),
      getRatings(product.product_id)
    ])
    .then((productData) => {
      setProduct(prevState => ({
        ...prevState,
        currentProduct: productData[0],
        styles: productData[1].results,
        ratings: productData[2].ratings
      }))
    })
  }, [product.product_id])

  return (
    <ProductContext.Provider value={[product, setProduct]}>
      <h2>FEC</h2>
      <button onClick={() => {
        setProduct(prevState => ({
          ...prevState,
          product_id: prevState.product_id + 1
        }))
      }}>
        {`${product.product_id}`}
      </button>
      <Stars />
      <Stars product_id={product.product_id}/>
      <h3>{product.currentProduct.name}</h3>
      <h4>{product.currentProduct.slogan}</h4>
      <p>{product.currentProduct.description}</p>
      <div id='overview'>
        <Overview />
      </div>
      <div className='widget'>
        <Outfits items={items}/>
      </div>
      <div className='widget' id='qa'>
        <QandA
          questionList={questionList} answerList={answerList}
        />
      </div>
      <div className='widget' id='ratings'>
        <Ratings />
      </div>
    </ProductContext.Provider>
  );
}

export default App;
