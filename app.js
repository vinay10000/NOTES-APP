const inputBox = document.getElementById("input");
const addBtn = document.querySelector(".addBtn");
const notesListWrapper = document.querySelector(".notes-list-wrapper");
const errorText = document.querySelector(".error-msg-text");

let currentEditedNote = null;

function createNewNoteItem(getCurrentNote) {
  const li = document.createElement("li");
  const p = document.createElement("p");
  const editBtn = document.createElement("button");
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.classList.add("btn", "del-btn");
  editBtn.textContent = "Edit";
  editBtn.classList.add("btn", "edit-btn");
  p.textContent = getCurrentNote;
  li.appendChild(p);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  return li;
}

function saveNotesToStorage(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function addNewNote() {
  const extractInputText = inputBox.value.trim();

  if (extractInputText.length === 0) {
    errorText.textContent = "Please write some text";
    return false;
  }

  if (addBtn.innerText === "Edit Note") {
    handleEditCurrentNote(
      currentEditedNote.target.previousElementSibling.innerHTML,
      extractInputText
    );
    currentEditedNote.target.previousElementSibling.innerHTML = extractInputText;
    addBtn.innerText = "Add Note";
    inputBox.value = "";
    errorText.textContent = "";
  } else {
    const newNoteItem = createNewNoteItem(extractInputText);
    notesListWrapper.appendChild(newNoteItem);
    inputBox.value = "";
    errorText.textContent = "";
    saveNotesToStorage([...getAllNotes(), extractInputText]);
  }
}

function getAllNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function fetchAllNotes() {
  const notesList = getAllNotes();
  notesList.forEach((note) => {
    const extractLi = createNewNoteItem(note);
    extractLi.classList.add("note-item");
    notesListWrapper.appendChild(extractLi);
  });
}

function handleEditCurrentNote(oldNote, newNote) {
  const notes = getAllNotes();
  const index = notes.indexOf(oldNote);
  if (index !== -1) {
    notes[index] = newNote;
    saveNotesToStorage(notes);
  }
}

function handleDeleteNotes(currentNote) {
  const notesList = getAllNotes();
  const currentNoteText = currentNote.children[0].innerHTML;
  const index = notesList.indexOf(currentNoteText);
  if (index !== -1) {
    notesList.splice(index, 1);
    saveNotesToStorage(notesList);
  }
}

function handleEditOrDeleteNote(event) {
  if (event.target.innerHTML === "Delete") {
    notesListWrapper.removeChild(event.target.parentElement);
    handleDeleteNotes(event.target.parentElement);
  }
  if (event.target.innerHTML === "Edit") {
    inputBox.value = event.target.previousElementSibling.innerHTML;
    inputBox.focus();
    addBtn.innerText = "Edit Note";
    currentEditedNote = event;
  }
}

document.addEventListener("DOMContentLoaded", fetchAllNotes);
addBtn.addEventListener("click", addNewNote);
notesListWrapper.addEventListener("click", handleEditOrDeleteNote);
document.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addNewNote();
  }
});
