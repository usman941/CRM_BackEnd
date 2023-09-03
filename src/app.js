const express = require("express");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const RootRoute = require("./routes/root.route");
const FormRouter = require("./routes/form.route");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

dotenv.config();
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended: true}))
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use("/api/v1", RootRoute)
app.use("/portal", FormRouter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(res => {
    console.log("Connected to database")
    app.listen("8000", ()=>console.log("server is running"));
}).catch(err => console.log(err));
