//import Sections from "../../data/sections.json";
import fs from "fs";
import path from "path";
import zlib from "zlib";

const Sections = JSON.parse(
  zlib.gunzipSync(fs.readFileSync(path.resolve("data/sections.json.gz")))
);

export default (req, res) => {
  res.status(200).json("test");
};