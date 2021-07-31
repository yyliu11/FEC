import React, { useContext, useState, useEffect } from "react";
import Gallery from "./gallery/Gallery.jsx";
import ProductInfo from "./ProductInfo.jsx";
import StyleSelector from "./StyleSelector.jsx";
import AddToCart from "./AddToCart.jsx";
import Rating from "./Rating.jsx";
import { ProductContext } from "../../App.jsx";

// consider using context here, because prop drilling is slow

const Overview = (props) => {
  const [product, setProduct] = useContext(ProductContext);
  const [currentStyle, setCurrentStyle] = useState({ photos: [] });

  useEffect(() => {
    if (!product.styles.length) return;
    setCurrentStyle(product.styles[0]);
  }, [product]);

  // function handleGalleryArrowClick(plusOrMinus) {
  //   //Normally you'd want to use a reducer for this, i suppose. Might be a bit overkill though
  //   //plusOrMinus(the var passed to this function) should be either a posititive or negative 1, which will represent the previous or next image

  //   setGalleryImage(current => current += plusOrMinus)
  //   if (product.styles.length + 1 >= currentGalleryImage) {
  //     //Rotate back to to the start and return undefined
  //     setCurrentStyle(product.styles[0])
  //     setGalleryImage(0)
  //     return undefined;
  //   }
  //   if ()
  // }

  return (
    <div id="overview-components">
      <Gallery
        currentStyle={currentStyle}
        setCurrentStyle={setCurrentStyle} />
      <div id="detail-components">
        <Rating />
        <ProductInfo id="info" />
        <StyleSelector id="styles" />
        <AddToCart id="cart" />
      </div>
    </div>
  );
};

export default Overview;
