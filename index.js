const express = require("express");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const AutoComplete = require("youtube-autocomplete");
const app = express();

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Welcome to API YT");
});

app.get("/search/:keyword", async (req, res) => {
  const { keyword } = req.params;
  try {
    const filters1 = await ytsr.getFilters(keyword);
    const filter1 = filters1.get("Type").get("Video");
    const searchResults = await ytsr(filter1.url);

    res.json(searchResults.items);
  } catch (error) {
    console.log(error);
  }
});

app.get("/detail/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    let info = await ytdl.getInfo(videoId);
    let details = info.videoDetails;
    res.json(details);
  } catch (error) {
    console.log(error.message);
  }
});

//autocomplete
app.get("/queries/:keyword", (req, res) => {
  const { keyword } = req.params;
  AutoComplete(keyword, (err, queries) => {
    if (err) throw err;
    res.json(queries[1]);
  });
});

app.listen(port, () => console.log(`Server running on, ${port}`));
