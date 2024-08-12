const express = require("express")
const app = express()
const mysql = require("mysql")
const cors = require("cors")

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const axios = require("axios")

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
    key: "userId",
    secret: "airwavy",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24, // = 1 day
    }
}))

const db = mysql.createConnection({
    host: "freedb.tech",
    database: "freedbtech_wiewshare",
    user: "freedbtech_wiewshareuser",
    password: "pluem162550"
})

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false})
    }
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.query(
        "SELECT * FROM tableuser WHERE username = ? AND password = ?", 
        [username, password],
        (err, result) => {
            if (err) {
                console.log({err: err})
            }
            if (result.length > 0) {
                req.session.user = result
                console.log(req.session.user)
                res.send(result)
            } else {
                res.send({message: "Username & Password is empty!! Please fill them."})
            }
        }
    )
})

app.get('/getstory', (req, res) => {
    db.query(
        "SELECT * FROM post ORDER BY id DESC",
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.send(result)
            }
        }
    )
})

app.listen(3001, () => {
    console.log("Server is starting...")
})