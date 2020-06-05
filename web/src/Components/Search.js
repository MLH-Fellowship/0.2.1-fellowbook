import React, { useState } from "react";
import styled from "styled-components";

// import "./styles.css";

const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: grey;
  color: white;
  /* Change width of the form depending if the bar is opened or not */
  width: ${(props) => (props.barOpened ? "30rem" : "2rem")};
  /* If bar opened, normal cursor on the whole form. If closed, show pointer on the whole form so user knows he can click to open it */
  cursor: ${(props) => (props.barOpened ? "auto" : "pointer")};
  padding: 1rem;
  height: 2rem;
  border-radius: 10rem;
  transition: width 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
`;

const Input = styled.input`
  font-size: 14px;
  line-height: 1;
  background-color: transparent;
  width: 100%;
  margin-left: ${(props) => (props.barOpened ? "1rem" : "0rem")};
  border: none;
  color: white;
  transition: margin 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  &:focus,
  &:active {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
`;

const Button = styled.button`
  line-height: 1;
  pointer-events: ${(props) => (props.barOpened ? "auto" : "none")};
  cursor: ${(props) => (props.barOpened ? "pointer" : "none")};
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
  font-weight: bold;
`;

const Search = (props) => {
  // const [data, setData] = useState([]);
  // const [input, setInput] = useState("");
  const [barOpened, setBarOpened] = useState(false);
  // const formRef = useRef();
  // const inputFocus = useRef();

  // console.log(data);

  const onFormSubmit = (e) => {
    // When form submited, clear input, close the searchbar and do something with input
    e.preventDefault();
    // setInput("");
    setBarOpened(true);

    //Fetch function on search
    // console.log(setData);
    // if (data.length === 0) {
    //   data.filter((fellow) => Object.values(fellow).toString().includes(input));
    // }

    // After form submit, do what you want with the input value
    // console.log(`Form was submited with input: ${input}`);
  };

  return (
    <div className="App">
      <Form
        barOpened={barOpened}
        onClick={() => {
          // When form clicked, set state of baropened to true and focus the input
          setBarOpened(true);
          // inputFocus.current.focus();
        }}
        // on focus open search bar
        onFocus={() => {
          setBarOpened(true);
          // inputFocus.current.focus();
        }}
        // on blur close search bar
        onBlur={() => {
          setBarOpened(false);
        }}
        // On submit, call the onFormSubmit function
        onSubmit={onFormSubmit}
        // ref={formRef}
      >
        <Button type="submit" barOpened={barOpened}>
          Search
        </Button>
        <Input
          onChange={props.handleInput}
          // ref={inputFocus}
          // value=""
          barOpened={barOpened}
          placeholder="Search for a Fellow or a Pod..."
        />
      </Form>
    </div>
  );
};

export default Search;
