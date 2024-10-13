import React, { useState, useEffect, useRef } from 'react';
import '../styles/styles.css'; // Import the styles
import codersLogo from '../components/CODERS__1_-removebg-preview.png'; // Import the logo image

const CodeEditor = () => {
  const [showCenterContent, setShowCenterContent] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const editorRef = useRef(null);
  const lineNumbersRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCenterContent(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    updateLineNumbers();
  }, [code]);

  const handleIconClick = (language) => {
    if (language !== activeLanguage) {
      setActiveLanguage(language);
      setCode('');    // Reset code when the language changes
      setOutput('');  // Reset output when the language changes
      setHistory([]); // Clear history when switching languages
      setHistoryIndex(-1); // Reset history index
    }
  };  

  const getPlaceholderText = () => {
    switch (activeLanguage) {
      case 'python':
        return 'Write your Python code here...';
      case 'cpp':
        return 'Write your C++ code here...';
      case 'java':
        return 'Write your Java code here...';
      case 'javascript':
        return 'Write your JavaScript code here...';
      default:
        return 'Write your code here...';
    }
  };

  const runCode = async () => {
    try {
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: activeLanguage, code }),
      });
      if (response.ok) {
        const result = await response.text();
        setOutput(result);
      } else {
        setOutput('Error executing code');
      }
    } catch (error) {
      setOutput('Error executing code');
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCode(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCode(history[historyIndex + 1]);
    }
  };

  
  const updateLineNumbers = () => {
    if (lineNumbersRef.current) {  // Ensure the ref is available
      const lines = code.split('\n').length;
      let lineNumberText = '';
      for (let i = 1; i <= lines; i++) {
        lineNumberText += `${i}\n`;
      }
      lineNumbersRef.current.textContent = lineNumberText;
    }
  };  

  return (
    <div>
      {showCenterContent ? (
        <div className="center-content">
          <img src={codersLogo} alt="Coders Logo" className="center-logo" />
          <p>Empower Your Coding Journey Across All Languages</p>
        </div>
      ) : (
        <>
          <header className="header fade-in-scale">
            <nav className="navbar">
              <img src="/images/coders.png" alt="Coders Logo" className="navbar-logo" />
              <ul className="navbar-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
              </ul>
            </nav>
          </header>
          <div className="editor-container fade-in-scale">
            <div className="button-container">
              <button onClick={undo}>Undo</button>
              <button onClick={redo}>Redo</button>
              <button onClick={runCode}>Run Code</button>
            </div>
            <div className="editor-wrapper">
              <div className="line-numbers" ref={lineNumbersRef}></div>
              <textarea
                className="editor"
                placeholder={getPlaceholderText()}
                value={code}
                onChange={handleCodeChange}
                ref={editorRef}
              />
            </div>
            <div className="output">{output}</div>
          </div>
          <div className="language-icons fade-in-scale">
            <i
              className={`bx bxl-python ${activeLanguage === 'python' ? 'active' : ''}`}
              title="Python"
              onClick={() => handleIconClick('python')}
            />
            <i
              className={`bx bxl-c-plus-plus ${activeLanguage === 'cpp' ? 'active' : ''}`}
              title="C++"
              onClick={() => handleIconClick('cpp')}
            />
            <i
              className={`bx bxl-java ${activeLanguage === 'java' ? 'active' : ''}`}
              title="Java"
              onClick={() => handleIconClick('java')}
            />
            <i
              className={`bx bxl-javascript ${activeLanguage === 'javascript' ? 'active' : ''}`}
              title="JavaScript"
              onClick={() => handleIconClick('javascript')}
            />
          </div>
        </>
      )}
    </div>
  );  
};

export default CodeEditor;