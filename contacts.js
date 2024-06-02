import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
  const data = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find(contact => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index!== -1) {
    const removedContact = contacts.splice(index, 1)[0];
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  }
  return null;
}

async function addContact(name, email, phone) {
  const newContact = { id: generateId(), name, email, phone };
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export { listContacts, getContactById, removeContact, addContact };