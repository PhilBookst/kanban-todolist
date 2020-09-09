let todoForm = document.querySelector('#todoForm');
let editor = document.getElementById("editor");

let cm = new CodeMirror.fromTextArea(editor, {
  lineNumbers: true, 
  autoCloseBrackets: true,
  lineWrapping: true,
  fullScreen: true,
  theme: "dracula",
  mode: "javascript", 
});

let timeout = null;

cm.on('change', (event) => {
  todoForm.todoSubmit.value = cm.getValue();

  clearTimeout(timeout);

  timeout = setTimeout(function () {
    todoForm.submit();
  }, 2000);

});
