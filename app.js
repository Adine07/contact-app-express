const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const {loadContacts, findContact, addContact, cekDuplikat, deleteContact, updateContacts} = require('./utils/contacts')

const app = express()
const port = 3000

// deklarasi pakai ejs
app.set('view engine', 'ejs')

// Third-party middleware
app.use(expressLayouts)
const { body, validationResult, check } = require('express-validator');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')

// Buildin middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

// Aplication level middleware
// app.use((req, res ,next) => {
//   console.log('Time: ' + Date.now())
//   next()
// })

// Konfigurasi Flash Message
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)
app.use(flash())

app.get('/', (req, res) => {
  const mahasiswa = [
    {
      nama: "pahmi",
      email: "pahmi@mail.com"
    },
    {
      nama: "joned",
      email: "joned@mail.com"
    },
    {
      nama: "supri",
      email: "supri@mail.com"
    },
  ]
  res.render('index', {
    title: 'Home',
    nama: "A Pamungkas",
    mahasiswa,
    layout: 'layouts/app',
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/app',
    title: "About"
  })
})

app.get('/contact', (req, res) => {
  const contacts = loadContacts();
  // console.log(contacts)
  res.render('contact', {
    layout: 'layouts/app',
    title: "Contact",
    contacts,
    msg: req.flash('msg')
  })
})

// Halaman Buat contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Form Tambah Data Contact',
    layout: 'layouts/app',
  })
})

// Store Contact
app.post('/contact', [
  body('nama').custom((value) => {
    const duplicat = cekDuplikat(value)
    if (duplicat) {
      throw new Error('Nama contact sudah terdaftar!')
    }
    return true
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('nohp', 'Nomor Hp tidak valid').isMobilePhone('id-ID')
], (req, res) => {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    // return res.status(400).json({error: err.array()})
    res.render('add-contact', {
      title: 'Form Tambah Data Contact',
      layout: 'layouts/app',
      errors: err.array()
    })
  }else{
    addContact(req.body)
    req.flash('msg', 'Data Contact berasil ditambahkan!')
    res.redirect('/contact')
  }
})

// delete contact
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama)

  // jika contact tidak ada
  if (!contact) {
    res.status(404)
    res.send("<h1>404</h1>")
  }else{
    // res.send('ok')
    deleteContact(req.params.nama)
    req.flash('msg', 'Data Contact berasil dihapus!')
    res.redirect('/contact')
  }
})

// Halaman edit contact
app.get('/contact/edit/:nama', (req, res) => {
  const contact = findContact(req.params.nama)
  res.render('edit-contact', {
    title: 'Form Ubah Data Contact',
    layout: 'layouts/app',
    contact,
  })
})

// Proses Update contact
app.post('/contact/update', [
  body('nama').custom((value, {req}) => {
    const duplicat = cekDuplikat(value)
    if (value !== req.body.oldNama && duplicat) {
      throw new Error('Nama contact sudah terdaftar!')
    }
    return true
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('nohp', 'Nomor Hp tidak valid').isMobilePhone('id-ID')
], (req, res) => {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    // return res.status(400).json({error: err.array()})
    res.render('edit-contact', {
      title: 'Form Ubah Data Contact',
      layout: 'layouts/app',
      errors: err.array(),
      contact: req.body
    })
  }else{
    // res.send(req.body)
    updateContacts(req.body)
    req.flash('msg', 'Data Contact berasil diubah!')
    res.redirect('/contact')
  }
})

// Tampilkan contact
app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  // console.log(contacts)
  res.render('detail', {
    layout: 'layouts/app',
    title: "Detail Contact",
    contact
  })
})

app.use('/', (req, res) => {
    res.status(404)
    res.send("<h1>404</h1>")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})