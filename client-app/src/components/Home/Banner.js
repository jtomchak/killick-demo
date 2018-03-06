import React from "react";
/*
Object Deconstruction
const Banner = props => {
const appName = props.appName;
...
*/

const Banner = ({ appName }) => {
  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">{appName.toLowerCase()}</h1>
        <p>A place to float your knowledge</p>
      </div>
    </div>
  );
};

export default Banner;
