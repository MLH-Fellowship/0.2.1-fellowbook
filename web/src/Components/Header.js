import React from "react";
import image from "../img/mlh.png";

const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "grey",
        width: "100%",
        color: "white",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <img
        src={image}
        alt="MLH logo"
        style={{ width: "150px", height: "150px" }}
      />
      <h1 style={{ paddingTop: "40px" }}>FellowBook</h1>
    </div>
  );
};

export default Header;
