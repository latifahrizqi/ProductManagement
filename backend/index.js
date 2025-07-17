import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import StatRoute from "./routes/StatRoute.js";
import "./models/Association.js";



dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

// (async()=>{
//     await db.sync();
// })();
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Tambahkan ini

app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

app.use(express.static("public")); // ✅ Serve file gambar dari folder public

// Routes
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use("/stats", StatRoute);




// store.sync();

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...');
});

//(async () => {
//  await db.sync({ alter: true });
//})();
