const express = require("express"),
  path = require("path"),
  oracledb = require("oracledb"),
  dbConfig = require("./dbconfig.js"),
  app = express();

const PORT = process.env.PORT || 5001;

app
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(async (req, res, next) => {
    oracledb.autoCommit = true;
    req.conn = await oracledb.getConnection(dbConfig);
    next();
  })
  .set("views", path.join(__dirname, "views"))
  .engine("html", require("ejs").renderFile)
  .set("view engine", "html")
  .get("/", async (req, res) => {
    res.render("index");
  })

  .get("/student", async (req, res) => {
    const result = await req.conn.execute(`SELECT * FROM student`);
    res.status(200).json(result);
  })

  .get("/recap", async (req, res) => {
    const result = await req.conn.execute(`SELECT * FROM recap`);
    res.status(200).json(result);
  })

  .get("/register", async (req, res) => {
    const result = await req.conn.execute(`SELECT * FROM register`);
    res.status(200).json(result);
  })

  .get("/result", async (req, res) => {
    const result = await req.conn.execute(`SELECT * FROM result`);
    res.status(200).json(result);
  })

  .get("/heads", async (req, res) => {
    const result = await req.conn.execute(`SELECT * FROM heads`);
    res.status(200).json(result);
  })

  .listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));