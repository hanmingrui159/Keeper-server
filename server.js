require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
// const cors     = require("cors");
const path     = require("path");
const app      = express();
 
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
// app.use(cors(corsOptions));
app.use(cors());

const PORT     = process.env.PORT || 4747;
// const DB_URI   = "mongodb://localhost:27017/"
const DB_URI = "mongodb+srv://admin-jason:Test123@cluster0.bdwcdkq.mongodb.net/"
const DB       = "reactDB";
 
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
 
// Establish DB connection
mongoose.connect(DB_URI + DB, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   connectTimeoutMS: 10000
});
 
const db = mongoose.connection;
 
// Event listeners
db.once('open', () => console.log(`Connected to ${DB} database`));
 
// Create Schema
let NoteSchema = new mongoose.Schema(
   {
      title: String,
      content: String
   }
   ,{ collection: "notes" }
);
 
// Create Model
let NoteModel = db.model("NoteModel", NoteSchema);
 
// Route to Get all People
app.get("/api/notes", (req, res) => {
   NoteModel.find({}, (err, docs) => {
      if (!err) {
         console.log("printing person results:", docs)
         res.json(docs);
      } else {
         res.status(400).json({"error": err});
      }
   });
})
 
// Route to Add a Person
app.post("/api/note/add", (req, res) => {
   console.log(req.body)
   let person = new NoteModel(req.body);
   
   person.save((err, result) => {
      if (!err) {
         delete result._doc.__v;
         res.json(result._doc);
      } else {
         res.status(400).json({"error": err});
      }
   });
})
 
app.listen(PORT, () => {
   console.log(app.get("env").toUpperCase() + " Server started on port " + (PORT));
});
