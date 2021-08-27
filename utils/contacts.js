const fs = require('fs')

// buat folder jika belum ada
const dirPath = './data';
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

// buat file contacts.json jika belum ada
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// ambil semua data
const loadContacts = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(fileBuffer)
    return contacts
}

// ambil satu data berdasar nama
const findContact = (nama) => {
    const contacts = loadContacts();
    const contact = contacts.find((contact) => contact.nama === nama)
    return contact
}

// Menimpa / menuliskan file contacts.json dengan data baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

// menambahkan data contact baru
const addContact = (contact) => {
    const contacts = loadContacts()
    contacts.push(contact)
    saveContacts(contacts)
}

// Cek duplikat contact
const cekDuplikat = (nama) => {
    const contacts = loadContacts()
    return contacts.find((contact) => contact.nama === nama)
}

// delete contact
const deleteContact = (nama) => {
    const contacts = loadContacts()
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama) // difilter selain nama akan di ambil kalo sesuai nama tidak diambil
    // console.log(filteredContacts)
    saveContacts(filteredContacts)
}

// ubah contacts
const updateContacts = (contactBaru) => {
    const contacts = loadContacts()
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama)
    // console.log(filteredContacts, contactBaru)
    delete contactBaru.oldNama
    filteredContacts.push(contactBaru)
    saveContacts(filteredContacts)
}

module.exports = { loadContacts, findContact, addContact, cekDuplikat, deleteContact, updateContacts }