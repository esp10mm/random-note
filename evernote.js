import Evernote from 'evernote';
import { reduce } from 'lodash';

const clients = {};

const getClient = token =>
  clients[token] || new Evernote.Client({ token, sandbox: false, china: false });

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


const getRandomIndex = (noteCount) => {
  const totalNotes = reduce(noteCount.notebookCounts, (r, v) => r + v, 0);
  const index = getRandomInt(0, totalNotes);
  return index;
};

export const getRedirectUrl = note =>
  `https://www.evernote.com/Home.action#n=${note.guid}&s=s112&b=${note.notebookGuid}&ses=4&sh=1&sds=5&`;

export const randomNote = async (token) => {
  const client = getClient(token);
  const noteStore = client.getNoteStore();

  const filter = new Evernote.NoteStore.NoteFilter()

  const noteCount = await noteStore.findNoteCounts(token, filter);

  const index = getRandomIndex(noteCount);

  const maxNotes = 1;

  const spec = new Evernote.NoteStore.NotesMetadataResultSpec()
  spec.includeNotebookGuid = true;
  spec.includeTitle = true;

  const notesMetadata = await client.getNoteStore().findNotesMetadata(filter, index, maxNotes, spec)

  return notesMetadata.notes[0];

  // return getRedirectUrl(randomNote.guid, randomNote.notebookGuid);
};

export const auth = new Evernote.Client({
  consumerKey: process.env.KEY,
  consumerSecret: process.env.SECRET,
  sandbox: false,
  china: false,
})
