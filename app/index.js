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

  .get("/head", async (req, res) => {
    const result = await req.conn.execute(`SELECT * FROM heads`);
    res.status(200).json(result);
  })

  .get("/semesterinfo", async (req, res) => {
    const result = await req.conn.execute(`SELECT semester, year FROM recap GROUP BY semester, year ORDER BY year`);
    res.status(200).json(result);
  })

  .get("/showDetails/:semester/:year", async (req, res) => {
    const semester = req.params.semester;
    const year = req.params.year;
    const result = await req.conn.execute(
      `SELECT r.semester, r.year, r.coursename,r.faculty, r.class, COUNT(DISTINCT s.sid), SUM(CASE WHEN h.header = 'Total' AND rs.obtain > 50 THEN 1 ELSE 0 END)
      FROM recap r
      JOIN register rg ON r.recapid = rg.recapid
      JOIN student s ON rg.sid = s.sid
      JOIN result rs ON rs.sid = s.sid and rs.recapid = r.recapid
      JOIN heads h ON h.recapid = r.recapid
      WHERE r.semester = :semester AND r.year = :year
      GROUP BY r.semester, r.year, r.coursename, r.class, r.faculty ORDER BY r.coursename`,
      [semester, year]);
    res.status(200).json(result);
  })


  .listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));