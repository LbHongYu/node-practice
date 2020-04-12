var yargs = require('yargs');
var chalk = require('chalk');
var note = require('./src/notes');

// add: node index.js add --name "note-1" --content "a new note"
yargs.command({
  command: 'add',
  describe: 'add a new note',
  builder: {
    name: {
      describe: 'The name of note',
      demandOption: true,
      type: 'string'
    },
    content: {
      describe: 'content of the note',
      demandOption: true,
      type: 'string'
    }
  },
  handler (argv) {
    if (!argv.content) {
      console.log(chalk.red('Please type the note content.'));
    } else {
      note.addNote(argv.name, argv.content);
    }
  }
});

// read: node index.js read --name "note-1"
yargs.command({
  command: 'read',
  describe: 'read a note',
  builder: {
    name: {
      describe: 'The name of note',
      demandOption: true,
      type: 'string'
    } 
  },  
  handler (argv) {
    let noteConent = note.readNote(argv.name);
    console.log(chalk.green(noteConent));
  }
});


// remove: node index.js remove --name "note-1"
yargs.command({
  command: 'remove',
  describe: 'remove a note',
  builder: {
    name: {
      describe: 'The name of note',
      demandOption: true,
      type: 'string'
    } 
  },
  handler (argv) {
    note.removeNote(argv.name);
  }
});

// list:  node index.js list
yargs.command({
  command: 'list',
  describe: 'list notes',  
  handler (argv) {
    let list = note.getAllNotes();
    console.log(chalk.green(JSON.stringify(list))); 
  }
});

yargs.parse()