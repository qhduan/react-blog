


/* Markdown Converter */
import marked from "marked";
import katex  from "katex";
import hljs   from "highlight.js";

var languagesList = hljs.listLanguages();

marked.setOptions({
  renderer:    new marked.Renderer(),
  gfm:         true,
  tables:      true,
  breaks:      true,
  pedantic:    false,
  sanitize:    true,
  smartLists:  true,
  smartypants: false,
  highlight: function (code, lang) {
    var out;
    if (lang && languagesList.indexOf(lang) != -1) {
      out = hljs.highlight(lang, code).value;
    } else {
      out = hljs.highlightAuto(code).value;
    }
    return `${out}`;
  }
});

export default function markdown (source) {

    var converted = source;
    var mathArray = [];

    // 把latex公式挑出来，行内的$之间，跨行的$$之间
    converted = converted.replace(/\$\$((?!\$\$)[^\0]){0,1024}\$\$|\$((?!\$)[^\0\r\n]){0,128}\$/g, (match) => {
      var possibleMath = match;
      while (possibleMath[0] == "$") possibleMath = possibleMath.substr(1);
      while (possibleMath[possibleMath.length - 1] == "$") possibleMath = possibleMath.substr(0, possibleMath.length - 1);
      var math = null;
      try {
        math = katex.renderToString(possibleMath);
      } catch (e) {}
      if (math) {
        mathArray.push(math);
        return "[MATH-" + (mathArray.length - 1).toString() + "]";
      }
      return match;
    });

    converted = marked(converted);

    converted = converted.replace(/\[MATH-(\d+)\]/g, function (match) {
      var m = match.match(/\[MATH-(\d+)\]/);
      var index = parseInt(m[1]);
      return mathArray[index];
    });

    return converted;
};
