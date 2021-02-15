//import Sections from "../../data/sections.json";
import fs from "fs";
import zlib from "zlib";

const Sections = JSON.parse(zlib.gunzipSync(fs.readFileSync("data/sections.json.gz")));

export default (req, res) => {
  const course = req.query["course"],
        year = req.query["year"],
        term = req.query["term"];

  // Check for valid course, year, and term

  res.statusCode = 200;
  res.json(Sections[course][year][term]);
};