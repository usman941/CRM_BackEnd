const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv');
const { UserSeeder } = require('./user');

dotenv.config();

const Seed = () => {
    UserSeeder();
}

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log("Connected to database")
    Seed();
}).catch(err => console.log(err));