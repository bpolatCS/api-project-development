import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { randomWordApiUrl, musicBrainzApiUrl } from "./config";



function App() {

  const [numberOfWords, setNumberOfWords] = useState("");
  const [randomWords, setRandomWords] = useState([]);
  const [musics, setMusics] = useState([]);
 

  const onNumberOfWordsInputChange = (e) => { //onchanged taking input
    let value = e.target.value;
    setNumberOfWords(parseInt(value));
  };

  const onFormSubmit = async (e) => { //generating function 
    e.preventDefault();
    generateWords();
  };

  const generateWords = async () => {
    let randomWordsFromApi = [];
    if (numberOfWords >= 5 && numberOfWords <= 20) {
      //reset random words and musics as an empty array
      setRandomWords([]);
      setMusics([]);
      while (randomWordsFromApi.length !== numberOfWords) {
        let response = await fetch(randomWordApiUrl).then((res) => {
          return res.json();
        });
        let word = response[0].word;
        //if does not exist the word in random words array
        if (!randomWordsFromApi.includes(word)) {
          randomWordsFromApi.push(word);
        }
      }
      let sortedWords = randomWordsFromApi.sort();
      setRandomWords(sortedWords);
      getMusics(sortedWords);
    }
  };

  const getMusics = async (words) => {
    let result = [];
    for (let i = 0; i < words.length; i++) {
      let music = {};
      const word = words[i];
      music.randomWord = word;
      let response = await fetch(
        musicBrainzApiUrl + `?query=${word}&fmt=json`
      ).then((res) => {
        return res.json();
      });
      let recordings = response.recordings;
      if (recordings.length > 0) {
        //check the order
        let sortedRecords = recordings.sort((a, b) => a.score - b.score);
        music.recording = sortedRecords[sortedRecords.length - 1];
      } else {
        music.recording = null;
      }
      result.push(music);
    }
    setMusics(result);
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
              disabled={numberOfWords <= 4 || numberOfWords > 20} //validation
            >
              Generate
            </button>
          </form>
        </div>
        <div className="col-6">
          {randomWords.length > 0 && (
            <>
              <p>We have generated the following words for you</p>
              <ul className="list-group">
                {randomWords.map((word) => {
                  return (
                    <li key={word} className="list-group-item">
                      {word}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
      {musics.length > 0 && (
        <div className="row">
          <div className="col-12">
            <table className="table">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Artist</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {musics.map((music) => {
                  return (
                    <tr>
                      <td>{music.randomWord}</td>
                      <td>
                        {music.recording && music.recording["artist-credit"]
                          ? music.recording["artist-credit"][0].name
                          : "No recording found!"}
                      </td>
                      <td>
                        {music.recording
                          ? music.recording.title
                          : "No recording found!"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;