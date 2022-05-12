import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { randomWordApiUrl, musicBrainzApiUrl } from "./config";



function App() {

  const [numberOfWords, setNumberOfWords] = useState("");
 

  const onNumberOfWordsInputChange = (e) => { //onchanged taking input
    let value = e.target.value;
    setNumberOfWords(parseInt(value));
  };

  const onFormSubmit = async (e) => { //generating function 
    e.preventDefault();
    //generateWords();
  };
  

  return(
    <div className="container-fluid">
        <div className="row">
        <div className="col-6">
          <form onSubmit={onFormSubmit}>
            <div className="mb-3">
              <label htmlFor="numberOfWords" className="form-label">
                How many words do you want to generate?
              </label>
              <input
                type="number"
                className="form-control"
                id="numberOfWords"
                value={numberOfWords}
                onChange={onNumberOfWordsInputChange}
              />
              <div className="form-text">
                the number has to be between 5 and 20
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={numberOfWords <= 4 || numberOfWords > 20}
            >
              Generate
            </button>
          </form>
        </div>
        </div>
    </div>

  );



}

export default App;