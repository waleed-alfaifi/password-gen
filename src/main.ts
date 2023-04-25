import "./style.css";
import { attachListeners, renderToDOM } from "modules/dom";
import { generate } from "modules/generator";

function init() {
  const output = generate({
    includeNumbers: false,
    uppercase: false,
    lowercase: false,
    includeSymbols: false,
    length: 10,
  });

  renderToDOM(output);
  attachListeners();
}

init();
