const express       =require('express'),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),   
      cors          =require('cors')

const adminRoutes = require('./routes/user')
const vendorRoutes = require('./routes/vendor')

const app = express();
require('dotenv').config();

app.use(express.json())
app.use(cors());
app.use(bodyParser.json({limit: "30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))

const url = process.env.MONGODB_URI || 5000;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true})   
.then(() => console.log("Connected to database."))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.json({ message: "Hello User" });
})

app.use("/admin",adminRoutes);
app.use("/vendor",vendorRoutes);

const port = process.env.PORT || 5000;

app.listen(port, process.env.IP, () => {
    console.log("showing on port 5000.");
});

