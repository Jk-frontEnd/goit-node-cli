import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contactsPath = join(__dirname, 'db', 'contacts.json');

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
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
  const newContact = { name, email, phone };
  fs.readFile(contactsPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // If the file doesn't exist, create it with the new contact
        const newContacts = [newContact];
        fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2), (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('Contact added successfully!');
          }
        });
      } else {
        console.error(err);
      }
    } else {
      const contacts = JSON.parse(data);
      // If the file is empty, add the new contact to the array
      if (contacts.length === 0) {
        contacts.push(newContact);
        fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('Contact added successfully!');
          }
        });
      } else {
        // If the file is not empty, check if the new contact already exists
        const existingContact = contacts.find((contact) => contact.email === email || contact.phone === phone);
        if (existingContact) {
          console.log('Contact already exists!');
        } else {
          contacts.push(newContact);
          fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('Contact added successfully!');
            }
          });
        }
      }
    }
  });
}

export { listContacts, getContactById, removeContact, addContact };