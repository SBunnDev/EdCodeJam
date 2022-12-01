import React, { useState, useEffect, useRef } from "react";
import FlashcardList from "./FlashcardList";
import "./app.css";
import axios from "axios";
import Questions from "./questions.json";

function App() {
  // State handlers for categories and flashcards
  const [flashcards, setFlashcards] = useState(Questions);
  const [categories, setCategories] = useState([]);
  // Reference items so things can survive re-renders without changing, namely card category and count.
  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    // pulls categories from api
    axios.get("https://opentdb.com/api_category.php").then((res) => {
      // console.log(res.data)
      setCategories(res.data.trivia_categories);
    });
  }, []);

  // removes html from json data
  function decodeString(str) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }

  function handleSubmit(e) {
    // Event handler for sumbit, also pulls questions from API with parameters and category taken from header form values.
    e.preventDefault();
    axios
      .get("https://opentdb.com/api.php", {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value,
        },
      })
      .then((res) => {
        setFlashcards(
          res.data.results.map((questionItem, index) => {
            const answer = decodeString(questionItem.correct_answer);
            const options = [
              ...questionItem.incorrect_answers.map((a) => decodeString(a)),
              answer,
            ];
            // indexes set to date.now to be unique
            return {
              id: `${index}-${Date.now()}`,
              question: decodeString(questionItem.question),
              answer: answer,
              options: options.sort(() => Math.random() - 0.5),
            };
          })
        );
      });
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of Questions</label>
          <input
            type="number"
            id="amount"
            min="1"
            step="1"
            defaultValue={10}
            ref={amountEl}
          />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
