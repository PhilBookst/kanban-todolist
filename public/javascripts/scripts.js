const container = document.querySelector('.container')
const formDiv = document.querySelector('.formDiv');
const createButton = document.querySelector('.createButton');
const newKanban = document.querySelector('.newKanban');
const plus = document.querySelector('#plus');
const kanbanRow = document.querySelector('.kanbans');
const newKanbanForm = document.querySelector('#newKanbanForm');

function darkMode() {
  
  const innerKanban = document.querySelectorAll('.innerKanban')
  
  if(localStorage.darkMode === 'true') {
    innerKanban.forEach((div) => {
      div.classList.add('darkKanban');
    });
    
    root.style.setProperty('--textColor', 'white');
    root.style.setProperty('--backGround', '#01001b');
    document.querySelector('html').classList.add('darkMode');
    document.querySelector('body').classList.add('darkMode');
    document.querySelector('.formLayout').classList.add('darkMode');
    
  } else {
    innerKanban.forEach((div) => {
      div.classList.remove('darkKanban');
    });
    
    root.style.setProperty('--textColor', 'black');
    root.style.setProperty('--backGround', 'white');
    document.querySelector('html').classList.remove('darkMode');
    document.querySelector('body').classList.remove('darkMode');
    document.querySelector('.formLayout').classList.remove('darkMode');    
  }
  
}

function toggleDark() {
  if (localStorage.darkMode === 'false') localStorage.setItem('darkMode', true);
  else localStorage.setItem('darkMode', false);
  darkMode();
}

function toggleMenu() {
  $('.accountMenu').toggleClass('disabled');
}


window.addEventListener('load', () => {
  darkMode();
});

function kanbanID() {
  document.querySelectorAll('.kanbanTitle').forEach((elem) => elem.id = elem.innerText);
}

createButton.addEventListener('click', (event) => {
  formDiv.classList.remove('disabled');
  container.classList.add('disabled');
});

formDiv.addEventListener('click', (event) => {
  if(event.target !== event.currentTarget) return;
  formDiv.classList.add('disabled');
  container.classList.remove('disabled');
});

// TODO: dynamic 
plus.addEventListener('click', (event) => {   

  $.ajax({
    type:'POST',
    url:'/new',
    data: { due: 'New Kanban' },
    dataType: 'json',
  });

  window.location.reload();
});

function deleteKanban(event) {

  if(event.target.parentElement.nextElementSibling.childElementCount > 0) {
    alert('Items left');
    return;
  };

  $.ajax({
    type:'DELETE',
    url:'/remove',
    data: { field: event.target.parentElement.id },
    dataType: 'json',
  });

  window.location.reload();

};

// DRAG & DROP Section

function dragstart_handler(ev) {
  ev.dataTransfer.setData('application/my-app', ev.target.id);
  ev.dataTransfer.dropEffect = "move";

  document.querySelectorAll('.kanbanLayout').forEach((col) => {
    if(col != ev.target) col.style.opacity = 0.4;
  });

}


function dragover_handler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move"
}

// form submit on Drop to update DB
function drop_handler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("application/my-app");
  const dragDiv = document.getElementById(data);

  document.querySelectorAll('.kanbanLayout').forEach((col) => col.style.opacity = 1);
  
  if(dragDiv.classList.contains('kanban') && ev.target.classList.contains('innerKanban')) {

    if(ev.target.children[0].id === "Finished") {
      
      $.ajax({
        type:'POST',
        url:'/delete',
        data: { id: dragDiv.id },
        dataType: 'json',
      });

    } else if (!ev.target.classList.contains('kanbanContent')){
      $.ajax({
        type:'PUT',
        url:'/update',
        data: { id: dragDiv.id, nextDue: ev.target.children[0].id },
        dataType: 'json',
      });
    }

  };

  if(dragDiv.classList.contains('kanban')) ev.target.children[1].appendChild(dragDiv);
  else dragDiv.parentElement.insertBefore(dragDiv, ev.target);
}



// END DRAG AND DROP

document.querySelectorAll('.kanbanTitle').forEach((kanban) => {
  kanban.addEventListener('focusout', (event) => {
    $.ajax({
      type: 'PUT',
      url: '/',
      data: { id: kanban.id, newID: kanban.textContent },
      dataType: 'text/html',
    });
    kanban.id = kanban.textContent;
  });
});

document.querySelectorAll('.kanban').forEach((kanban) => {
  kanban.addEventListener('focusout', (event) => {
    $.ajax({
      type: 'PUT',
      url: '/task',
      data: { task: kanban.id, newTask: kanban.textContent },
      dataType: 'text/html',
    });
    kanban.id = kanban.textContent;
  });
});

document.querySelectorAll('.editable').forEach(field => field.addEventListener('keypress', (event) => {
  if(event.key === 'Enter') event.preventDefault();
}));