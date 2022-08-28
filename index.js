const express = require("express");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const ytpl = require("ytpl");
const AutoComplete = require("youtube-autocomplete");
const app = express();
const ytch = require("yt-channel-info");
const cors = require("cors");
const HttpsProxyAgent = require("https-proxy-agent");

// Remove 'user:pass@' if you don't need to authenticate to your proxy.
const proxy = "http://111.111.111.111:8080";
const agent = HttpsProxyAgent(proxy);

const port = process.env.PORT || 8000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to API YT");
});

//video
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

//playlist
app.get("/search/playlist/:keyword", async (req, res) => {
  const { keyword } = req.params;
  try {
    const filters1 = await ytsr.getFilters(keyword);
    const filter1 = filters1.get("Type").get("Playlist");
    const searchResults = await ytsr(filter1.url);

    res.json(searchResults.items);
  } catch (error) {
    console.log(error);
  }
});

//channel
app.get("/search/channel/:keyword", async (req, res) => {
  const { keyword } = req.params;
  try {
    const filters1 = await ytsr.getFilters(keyword);
    const filter1 = filters1.get("Type").get("Channel");
    const searchResults = await ytsr(filter1.url);

    res.json(searchResults.items);
  } catch (error) {
    console.log(error);
  }
});

//get video by id
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

//related videos
app.get("/related/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    let info = await ytdl.getInfo(videoId);
    let related_video = info.related_videos;
    res.json(related_video);
  } catch (error) {
    console.log(error);
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

//spell check
app.get("/spellcheck/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;
    const searchResults = await ytsr(keyword);
    res.json({
      query: searchResults.originalQuery,
      check: searchResults.correctedQuery,
    });
  } catch (error) {
    console.log(error);
  }
});

//get all playlist video
app.get("/playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await ytpl(playlistId);

    res.json(playlist);
  } catch (error) {
    console.log(error);
  }
});

//get channel information
app.get("/channel/:channelId", async (req, res) => {
  const { channelId } = req.params;
  const payload = {
    channelId,
  };
  ytch
    .getChannelInfo(payload)
    .then((response) => {
      if (!response.alertMessage) {
        res.json(response);
      } else {
        console.log("Channel could not be found.");
        // throw response.alertMessage
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// video to audio
app.get("/music/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    let info = await ytdl.getInfo(videoId);
    let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    // console.log("Formats with only audio: " + audioFormats);
    res.json(audioFormats);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Server running on, ${port}`));
