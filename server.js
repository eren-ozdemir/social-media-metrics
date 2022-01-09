require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const { TwitterApi } = require("twitter-api-v2");
const { default: axios } = require("axios");
const path = require("path");

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "client", "public", "index.html")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "index.html"));
  console.log("hey");
});
//Twitter
const twitterConsumerKey = process.env.TW_CONSUMER_KEY;
const twitterConsumerSecret = process.env.TW_CONSUMER_KEY_SECRET;
const twitterBearer = process.env.TW_BEARER_TOKEN;
const twitterClient = new TwitterApi(twitterBearer);

app.get("/twitter/public/", async (req, res) => {
  try {
    const user = await twitterClient.v2.userByUsername(req.query?.username);
    const userTimeline = await twitterClient.v2.userTimeline(user?.data?.id, {
      "tweet.fields": "public_metrics,created_at",
      max_results: 100,
      start_time: req.query?.start_time,
      end_time: req.query?.end_time,
      exclude: ["replies", "retweets"],
    });

    const tweets = await userTimeline.fetchLast(1000);
    res.send(tweets.data.data);
  } catch (err) {
    console.log(err);
  }
});

//Youtube
const ytApiKey = process.env.YT_API_KEY;

const getChannelIdByChannelName = async (_channelName) => {
  try {
    const channelNameEncoded = encodeURI(_channelName);
    const res = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${channelNameEncoded}&key=${ytApiKey}`
    );

    const items = res.data.items;
    const channel = items.find((item) => item.snippet.title === _channelName);
    return channel ? channel.snippet.channelId : undefined;
  } catch (err) {
    console.log(err);
  }
};

const getUploadsListIdByChannelId = async (_channelId, startTime, endTime) => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels`,
      {
        params: {
          key: ytApiKey,
          id: _channelId,
          part: "contentDetails",
        },
      }
    );
    const uploadsListId =
      res.data.items[0].contentDetails.relatedPlaylists.uploads;
    return uploadsListId;
  } catch (err) {
    console.log(err);
  }
};

const getVideosByListId = async (_listId, _nextPageToken) => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems`,
      {
        params: {
          key: ytApiKey,
          playlistId: _listId,
          part: "snippet,contentDetails",
          maxResults: 50,
          pageToken: _nextPageToken,
        },
      }
    );
    return [res.data.items, res.data.nextPageToken];
  } catch (err) {
    console.log(err);
  }
};

const getStatistics = async (_videos) => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          key: ytApiKey,
          part: "snippet,statistics",
          id: getVideoIds(_videos),
        },
      }
    );
    return res.data.items;
  } catch (err) {
    console.log(err);
  }
};

const getVideoIds = (_videos) => {
  const ids = _videos.map((video) => video.contentDetails.videoId);
  return ids.toString();
};

const getResults = async (_listId, _startTime, _endTime) => {
  let [vids, token] = await getVideosByListId(_listId);
  let allVideos = [];
  let allStats = [];
  let endIndex = -1;
  let startIndex = -1;
  console.time("getResults");

  //Find the page that includes end date
  while (endIndex < 0) {
    endIndex = vids.findIndex(
      (video) => video.contentDetails.videoPublishedAt <= _endTime
    );
    if (endIndex < 0) {
      //end date not in page
      [vids, token] = await getVideosByListId(_listId, token);
    } else {
      //end date in page, check start date
      startIndex = vids.findIndex(
        (video) => video.contentDetails.videoPublishedAt <= _startTime
      );
      if (startIndex >= 0) {
        //end and start dates are in same page
        allVideos = vids.slice(endIndex, startIndex);
        allStats = await getStatistics(allVideos);
      } else {
        //Get videos on the page and call next page
        allVideos = vids.slice(endIndex);
        allStats = await getStatistics(allVideos);
        [vids, token] = await getVideosByListId(_listId, token);
      }
    }
  }

  //If end and start dates are not in the same page find the page that includes start date
  while (startIndex < 0) {
    //check if start date in page
    startIndex = vids.findIndex(
      (video) => video.contentDetails.videoPublishedAt <= _startTime
    );
    //If start that is not in the page, get all videos and call next page
    if (startIndex < 0) {
      allVideos = [...allVideos, ...vids];
      const stats = await getStatistics(vids);
      allStats = [...allStats, ...stats][(vids, token)] =
        await getVideosByListId(_listId, token);
    } else {
      //If start date in the page, get matching videos
      const lastPart = vids.slice(0, startIndex);
      allVideos = [...allVideos, ...lastPart];
      const stats = await getStatistics(lastPart);
      allStats = [...allStats, ...stats];
    }
  }

  console.timeEnd("getResults");
  return allStats;
};

app.get("/youtube/public/", async (req, res) => {
  videos = [];
  try {
    let channelId, uploadsListId;
    console.log(req.query.channelName);
    channelId = await getChannelIdByChannelName(req.query.channelName);
    if (channelId) {
      uploadsListId = await getUploadsListIdByChannelId(channelId);
      const resultVideos = await getResults(
        uploadsListId,
        req.query.start_time,
        req.query.end_time
      );
      console.log("Results Length:", resultVideos.length);
      res.send(resultVideos);
    } else {
      console.log("Channel not found");
      res.send([]);
    }
  } catch (err) {}
});

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 3001;

server.listen(port, () => console.log("Server started on port: ", port));
