let chalk = require('chalk');
let fs = require('fs');
const path = require('path'); 

const addNote = (name, content) => {
  let notes = getAllNotes();

  let bExist = notes.findIndex(d => d.name === name); 

  if (~bExist) {
    errTitle(name + ' has existed in note');
  } else {
    notes.push({ name, content });
    saveNotes(notes, 'add');
  }
};

const removeNote = (name) => {
  let notes = getAllNotes();
  let idx = notes.findIndex(d => d.name === name); 
  if (~idx) {
    notes.splice(idx);
    saveNotes(notes, 'remove');
  } else {
    errTitle('no such a file in notes');
  }
};


const readNote = (name) => {
  let res = '';
  let notes = getAllNotes();
  let idx = notes.findIndex(d => d.name === name); 
  
  if (~idx) {
    res = notes[idx].content;
  } else {
    errTitle('no such a file in notes');
  }
  return res;
};

const getAllNotes = () => {
  let res = [];
  try {
    let notes = fs.readFileSync('./notes.json').toString();
    res = JSON.parse(notes);
  } catch (error) {
    
  }
  return res;
};

const saveNotes = (notes, action) => {
  let _notes = JSON.stringify(notes);
  fs.writeFileSync('./notes.json', _notes);
  succTitle(action);
};

const addLog = (action, content) => {

};

const errTitle = (txt) => {
  console.log(chalk.bgRed.bold('ERROR')); 
  console.log(chalk.red(txt));   
};

const succTitle = (txt) => {
  console.log(chalk.bgGreen.bold('SUCC:')); 
  console.log(chalk.green(txt)); 
};

module.exports = {
  getAllNotes,
  readNote,
  addNote,
  removeNote
}