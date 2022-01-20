import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const MultipleSearch = ({
  socialMedia,
  twitterDatas,
  youTubeDatas,
  setDetailIndex,
  setIsDetailsVisible,
  isSearching,
}) => {
  const [twitterBrands, setTwitterBrands] = useState([]);
  const [youTubeBrands, setYouTubeBrands] = useState([]);

  let tempBrands = [];

  useEffect(() => {
    if (twitterDatas.length) {
      twitterDatas.map((_brand) => {
        tempBrands.push(twitterGetSums(_brand));
      });
      setTwitterBrands(tempBrands);
      tempBrands = [];
    }
  }, [twitterDatas]);

  useEffect(() => {
    if (youTubeDatas.length) {
      youTubeDatas.map((_brand) => {
        tempBrands.push(youTubeGetSums(_brand));
      });
      setYouTubeBrands(tempBrands);
      tempBrands = [];
    }
  }, [youTubeDatas]);

  const twitterGetSums = (_brand) => {
    let total = 0;
    //Create array template
    const tempSums = new Object();
    for (const metric in _brand.data?.[0].public_metrics) {
      tempSums[metric] = 0;
    }

    //Calculate
    _brand.data?.map((tweet) => {
      for (const metric in tweet.public_metrics) {
        tempSums[metric] += tweet.public_metrics[metric];
      }
    });

    for (const metric in tempSums) {
      if (metric !== "quote_count") total += tempSums[metric];
    }

    tempSums.total = total;
    tempSums["share_count"] = _brand.data?.length;

    const brand = {
      username: _brand.meta?.username,
      sums: tempSums,
    };

    return brand;
  };

  const youTubeGetSums = (_brand) => {
    let total = 0;
    //Create array template
    const tempSums = new Object();
    for (const metric in _brand.videos?.[0]?.statistics) {
      tempSums[metric] = 0;
    }

    //Calculate
    _brand.videos.map((video) => {
      for (const metric in video.statistics) {
        tempSums[metric] += +video.statistics[metric];
      }
    });

    for (const metric in tempSums) {
      if (metric !== "quote_count") total += +tempSums[metric];
    }

    tempSums.total = total;
    tempSums.shareCount = _brand.videos.length;

    const brand = {
      username: _brand.channelName,
      sums: tempSums,
    };

    return brand;
  };

  const showDetails = (_index) => {
    setIsDetailsVisible(true);
    setDetailIndex(_index);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="table-container"
        layout
        transition={{ type: "tween" }}
      >
        {socialMedia === "twitter" && (
          <div className="table">
            {twitterDatas.length === 0 ? (
              <p className="no-data">
                {isSearching ? " Aranıyor" : "Veri yok"}
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Marka</th>
                    <th>Beğeni</th>
                    <th>Reply</th>
                    <th>Retweet</th>
                    <th>Toplam Etkileşim</th>
                    <th>Gönderi Sayısı</th>
                  </tr>
                </thead>
                <tbody>
                  {twitterBrands.map((brand, index) => {
                    return (
                      <tr
                        className="brand"
                        key={index}
                        onClick={() => showDetails(index)}
                      >
                        <td>{brand.username}</td>
                        <td>{brand.sums["like_count"]}</td>
                        <td>{brand.sums["reply_count"]}</td>
                        <td>{brand.sums["retweet_count"]}</td>
                        <td>{brand.sums["total"]}</td>
                        <td>{brand.sums["share_count"]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
        {socialMedia === "youTube" && (
          <div className="table">
            {youTubeDatas.length === 0 ? (
              <p className="no-data">
                {isSearching ? " Aranıyor" : "Veri yok"}
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Marka</th>
                    <th>Beğeni</th>
                    <th>Yorum</th>
                    <th>İzlenme</th>
                    <th>Toplam Etkileşim</th>
                    <th>Gönderi Sayısı</th>
                  </tr>
                </thead>
                <tbody>
                  {youTubeBrands.map((brand, index) => {
                    return (
                      <tr
                        className="brand"
                        key={index}
                        onClick={() => showDetails(index)}
                      >
                        <td>{brand.username}</td>
                        <td>{brand.sums["likeCount"]}</td>
                        <td>{brand.sums["commentCount"]}</td>
                        <td>{brand.sums["viewCount"]}</td>
                        <td>{brand.sums["total"]}</td>
                        <td>{brand.sums["shareCount"]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>
      )
    </AnimatePresence>
  );
};

export default MultipleSearch;
