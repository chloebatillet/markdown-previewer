import { useState, useEffect, useRef } from "react";
import "./App.scss";

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import DOMPurify from "isomorphic-dompurify";

import "highlight.js/styles/github-dark.css";

function App() {
  
  const initialValue = `
# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`javascript
// this is multi-line code

const highlight = "code";

function anotherExample(firstLine, lastLine) {
  if (firstLine == \'\`\`\`\' && lastLine == \'\`\`\`\') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
  Or _italic_.
  Or... wait for it... **_both!_**
  And feel free to go crazy ~~crossing stuff out~~.

  There's also [links](https://www.freecodecamp.org), and
  > Block Quotes!

  And if you want to get really crazy, even tables:

  Wild Header | Crazy Header | Another Header?
  ------------ | ------------- | -------------
  Your content can | be here, and it | can be here....
  And here. | Okay. | I think we get it.

  - And of course there are lists.
    - Some are bulleted.
       - With different indentation levels.
          - That look like this.

  1. And there are numbered lists too.
  1. Use just 1s if you want!
  1. And last but not least, let's not forget embedded images:

  ![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

  const [editorValue, setEditorValue] = useState(initialValue);
  const [outputValue, setOutputValue] = useState("");
  const editorWindow = useRef();
  const previewWindow = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);

  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language: language }).value;
      },
    })
  );

  let dirtyValue = marked.parse(editorValue, {
    gfm: true,
    breaks: true,
  });

  function clean(value) {
    return DOMPurify.sanitize(value);
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
    alert("Copied the text: " + text);
  }

  useEffect(() => {
    setOutputValue(clean(dirtyValue));
  }, [dirtyValue]);

  return (
    <div className="App">
      <section className="editor-container">
        <article className="container">
          <header className="container-header">
            // Editor
            <button type="button" onClick={() => setEditorValue(initialValue)}>
              Reset
            </button>
          </header>
          <textarea
            ref={editorWindow}
            id="editor"
            placeholder="Type your text here..."
            value={editorValue}
            onChange={(e) => {
              setEditorValue(e.target.value);
            }}
            onScroll={(e) => {
              let p =
                (e.currentTarget.scrollTop /
                  (e.currentTarget.scrollHeight -
                    e.currentTarget.offsetHeight)) *
                100;
              setScrollPosition(p);
              //console.log(p);
              // console.log("scrollP :", e.currentTarget.scrollTop);
              // console.log("pourcent :", p);

              let h =
                previewWindow.current.scrollHeight -
                e.currentTarget.offsetHeight;
              // console.log("pixel :", h * (p / 100));
              // console.log("scrollP :", previewWindow.current.scrollTop);
              previewWindow.current.scrollTop = h * (scrollPosition / 100);
            }}
          ></textarea>
        </article>
      </section>
      <section className="preview-container">
        <article className="container">
          <header className="container-header">
            // Previewer
            <button type="button" onClick={() => copy(outputValue)}>
              Copy
            </button>
          </header>
          <div
            id="preview"
            dangerouslySetInnerHTML={{ __html: outputValue }}
            ref={previewWindow}
          ></div>
        </article>
      </section>
    </div>
  );
}

export default App;
