"use client";
import { useState } from 'react';
import { useEffect } from 'react';
import Row from '@/components/Row';
import Keyboard from '@/components/Keyboard';
import { WORDS } from '@/components/WordsSet';
import './page.css';
import { Guess_Value } from '@/components/lib/types';
import { getLetterStates, mergeLetterStates } from '@/components/lib/wordutil';

function App() {
  const numGuesses = 6;
  const wordLength = 5;

  const [gameOver, setGameOver] = useState(false);
  const [rowNumber, setRowNumber] = useState(0);
  const [squareNumber, setSquareNumber] = useState(0);
  const [values, setValues] = useState(() => { return [...Array(numGuesses)].map(e => Array(wordLength).fill('')) });
  const [message, setMessage] = useState(() => { return "" });

  let rows = [...Array(numGuesses).keys()];
  const [submitted, setSubmitted] = useState(() => { return [...Array(numGuesses).fill(false)] });

  //const secretWord = "steel";
  const [secretWord, setSecretWord] = useState("");

  //Lazy init dictionary for the states of all letters
  const [letterStates, setLetterStates] = useState(() => {
    let alphabet = [...Array(26).keys()].map(e => String.fromCharCode(e + 65));
    let initSet: { [key: string]: Guess_Value } = {};
    for (let i = 0; i < alphabet.length; i++) {
      initSet[alphabet[i]] = Guess_Value.Black;
    }
    return initSet;
  });

  function handleSubmit() {
    //Word not fully filled in 
    if (squareNumber < wordLength) {
      setMessage("Not enough letters");
      return;
    }

    //Check if submitted word is in word list
    else if (!(WORDS.has(values[rowNumber].join("")))) {
      setMessage("Word not in word list");
      return;
    }

    //Submit 
    else {
      let newSubmitted = submitted.slice();
      newSubmitted[rowNumber] = true;
      setSubmitted(newSubmitted);
      setRowNumber(rowNumber => rowNumber + 1);
      setSquareNumber(0);
      setMessage("");
      localStorage.setItem("rowNum", `${rowNumber + 1}`);
      if (rowNumber == numGuesses - 1) {
        setMessage("Game over </3");
        localStorage.setItem("gameOver", "true")
        setGameOver(true);
      };
    };
  };

  function handleDelete() {
    let newValues = values.slice();
    let newRow = values[rowNumber].slice();
    newRow[squareNumber - 1] = "";
    newValues[rowNumber] = newRow;
    setValues(newValues);
    setSquareNumber(squareNumber => squareNumber - 1);
  }

  function handleInsert(char: string) {
    let newValues = values.slice();
    let newRow = values[rowNumber].slice();
    newRow[squareNumber] = char;
    newValues[rowNumber] = newRow;
    setValues(newValues);
    setSquareNumber(squareNumber => squareNumber + 1);
  };

  function keyDownHandler(e: globalThis.KeyboardEvent) {
    if (gameOver) {
      return;
    }

    //Try to submit
    if (e.key == "Enter") {
      handleSubmit();
      return;
    }

    //Delete
    else if ((e.key == "Backspace") && (squareNumber > 0)) {
      handleDelete();
      return;
    }

    //Check for invalid letter
    else if (!(/^[a-z]$/i.test(e.key))) {
      return;
    }

    //Insert
    else if (squareNumber < wordLength) {
      handleInsert(e.key.toUpperCase());
    };
  };

  //Change messages
  useEffect(() => {
    const element: HTMLElement | null = document.getElementById("Message");

    function removeStyle(element: HTMLElement) {
      element.className = "msg_hidden";
      setMessage("");
    };

    function changeStyle(element: HTMLElement) {
      element.style.width = `${message.length + 2}pc`;
      element.className = "msg_show"
      setTimeout(removeStyle, 3000, element);
    };

    if (message != "") {
      element ? changeStyle(element) : null;
    };
  }, [message]);

  //TODO: REFACTOR
  useEffect(() => {
    if (secretWord == ""){
      return;
    };

    let isGameOver = localStorage.getItem("gameOver");
    gameOver ? setGameOver(Boolean(isGameOver)) : null;

    let guess = localStorage.getItem("guess_1");
    let rowNum = localStorage.getItem("rowNum");
    if (rowNum == null || guess == null) {
      return;
    };

    setRowNumber(Number(rowNum));
    let newValues: string[][] = [];
    let newSubmitted: boolean[] = [];
    let newLetterStates: { [key: string]: Guess_Value } = { ...letterStates };
    let i = 0;
 
    //TODO: REFACTOR 
    while (guess) {
      let guessArray = guess.split("");
      newValues.push(guessArray);
      newSubmitted.push(true);
      i += 1;
      let updatedLetters = getLetterStates(secretWord, guessArray);
      mergeLetterStates(newLetterStates,updatedLetters);
      guess = localStorage.getItem(`guess_${i + 1}`);
    };
    setLetterStates(newLetterStates);
    while (i <= wordLength) {
      newValues.push([...Array(5).fill("")]);
      newSubmitted.push(false);
      i += 1;
    };
    setValues(newValues);
    setSubmitted(newSubmitted);
  }, [secretWord]);

  //Get word
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("api/word/");
        const data = await res.json();
        setSecretWord(data);
        //console.log(data);
        return data;
      }
      catch (error) {
        console.log(error);
        return;
      };
    }
    getData();
  }
    , []);

  //For keyboard input
  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, [squareNumber, rowNumber, values, gameOver]);

  if (secretWord === "") {
    return <>Loading</>;
  };

  return (
    <>
      <div className="Game">
        {
          rows.map((elem) =>
            <Row guessArray={values[elem]} submitted={submitted[elem]} setGameOver={setGameOver} secretWord={secretWord}
              key={elem} letterStates={letterStates} setLetterStates={setLetterStates} rowNum={elem} />
          )
        }

      </div>

      <div className='MessageBox'>
        <input className="msg_hidden" id="Message" value={message} disabled />
      </div>
      <Keyboard letterStates={letterStates}></Keyboard>
    </>

  )
};

export default App;
