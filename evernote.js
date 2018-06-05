import Evernote from 'evernote';
import { reduce } from 'lodash';

const clients = {};

const getClient = token =>
  clients[token] || new Evernote.Client({ token, sandbox: false, china: false });

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRedirectUrl = (note, book) => `https://www.evernote.com/Home.action#n=${note}&s=s112&b=${book}&ses=4&sh=1&sds=5&`;

const getRandomIndex = (noteCount) => {
  const totalNotes = reduce(noteCount.notebookCounts, (r, v) => r + v, 0);
  const index = getRandomInt(0, totalNotes);
  return index;
};

export const randomNoteUrl = async (token) => {
  const client = getClient(token);
  const noteStore = client.getNoteStore();

  const filter = new Evernote.NoteStore.NoteFilter()

  const noteCount = await noteStore.findNoteCounts(token, filter);

  const index = getRandomIndex(noteCount);

  const maxNotes = 1;

  const spec = new Evernote.NoteStore.NotesMetadataResultSpec()
  spec['includeNotebookGuid'] = true

  const notesMetadata = await client.getNoteStore().findNotesMetadata(filter, index, maxNotes, spec)

  const randomNote = notesMetadata.notes[0];

  return getRedirectUrl(randomNote.guid, randomNote.notebookGuid);
};

export const auth = new Evernote.Client({
  consumerKey: process.env.KEY,
  consumerSecret: process.env.SECRET,
  sandbox: false,
  china: false,
})
