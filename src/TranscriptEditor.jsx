import React, { useState, useEffect } from 'react';
import '../src/TranscriptEditor.css'
const TranscriptEditor = ({ initialTranscript }) => {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [correctionPopup, setCorrectionPopup] = useState({
    visible: false,
    wordIndex: null,
    x: 0,
    y: 0,
  });
  const [correctionValue, setCorrectionValue] = useState('');

  useEffect(() => {
    let timer;
    if (isPlaying && currentWordIndex < transcript.length) {
      const currentWord = transcript[currentWordIndex];
      timer = setTimeout(() => {
        setCurrentWordIndex(currentWordIndex + 1);
      }, currentWord.duration);
    } else {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentWordIndex]);

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentWordIndex(0);
  };

  const handleEditWord = (index, event) => {
    const rect = event.target.getBoundingClientRect();
    setCorrectionValue(transcript[index].word);
    setCorrectionPopup({
      visible: true,
      wordIndex: index,
      x: rect.left,
      y: rect.bottom + window.scrollY,
    });
  };

  const handleCorrectionChange = (event) => {
    setCorrectionValue(event.target.value);
  };

  const applyCorrection = () => {
    const updatedTranscript = transcript.map((word, i) =>
      i === correctionPopup.wordIndex ? { ...word, word: correctionValue } : word
    );
    setTranscript(updatedTranscript);
    setCorrectionPopup({ visible: false, wordIndex: null, x: 0, y: 0 });
  };

  return (
    <div className="transcript-editor relative">
      <div className="transcript">
        {transcript.map((wordObj, index) => (
          <span
            key={index}
            className={`word inline-block ${index === currentWordIndex ? 'highlighted bg-yellow-300' : ''}`}
            onClick={(e) => handleEditWord(index, e)}
          >
            {wordObj.word} 
          </span>
        ))}
      </div>
      <button onClick={handlePlay} className="play-button mt-4 py-2 px-4 bg-blue-600 text-white rounded">
        Play
      </button>
      
      {correctionPopup.visible && (
        <div
          className="correction-popup absolute bg-gray-800 text-white rounded p-2 shadow-lg"
          style={{ top: correctionPopup.y, left: correctionPopup.x }}
        >
          <input
            type="text"
            value={correctionValue}
            onChange={handleCorrectionChange}
            className="text-black p-1 rounded"
          />
          <div className="flex mt-2">
            <button onClick={applyCorrection} className="ml-2 bg-yellow-500 px-2 py-1 rounded">
              Correct
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptEditor;
