import { useState, useEffect } from "react";

const MultipleSearch = ({ socialMedia, twitterDatas, youTubeDatas }) => {
  const [twitterBrands, setTwitterBrands] = useState([]);
  const [youTubeBrands, setYouTubeBrands] = useState([]);

  let tempBrands = [];

  useEffect(() => {
    if (twitterDatas.length) {
      twitterDatas.map((_brand) => {
        tempBrands.push(twitterGetSums(_brand));
      });
      setTwitterBrands(tempBrands);
    }

    return () => {
      tempBrands = [];
    };
  }, [twitterDatas]);

  useEffect(() => {
    if (youTubeDatas.length) {
      youTubeDatas.map((_brand) => {
        tempBrands.push(youTubeGetSums(_brand));
      });
      setYouTubeBrands(tempBrands);
    }

    return () => {
      tempBrands = [];
    };
  }, [youTubeDatas]);

  const twitterGetSums = (_brand) => {
    let total = 0;
    //Create array template
    const tempSums = new Object();
    for (const metric in _brand.data[0].public_metrics) {
      tempSums[metric] = 0;
    }

    //Calculate
    _brand.data.map((tweet) => {
      for (const metric in tweet.public_metrics) {
        tempSums[metric] += tweet.public_metrics[metric];
      }
    });

    for (const metric in tempSums) {
      if (metric !== "quote_count") total += tempSums[metric];
    }

    tempSums.total = total;

    const brand = {
      username: _brand.meta.username,
      sums: tempSums,
    };

    return brand;
  };

  const youTubeGetSums = (_brand) => {
    let total = 0;
    //Create array template
    const tempSums = new Object();
    for (const metric in _brand.videos[0].statistics) {
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

    const brand = {
      username: _brand.channelName,
      sums: tempSums,
    };

    return brand;
  };
  return (
    <>
      {socialMedia === "twitter" && (
        <table className="table">
          <thead>
            <tr>
              <th>Marka</th>
              <th>Beğeni</th>
              <th>Reply</th>
              <th>Retweet</th>
              <th>Toplam Etkileşim</th>
            </tr>
          </thead>
          <tbody>
            {twitterBrands.map((brand, index) => {
              return (
                <tr key={index}>
                  <td>{brand.username}</td>
                  <td>{brand.sums["like_count"]}</td>
                  <td>{brand.sums["reply_count"]}</td>
                  <td>{brand.sums["retweet_count"]}</td>
                  <td>{brand.sums["total"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {socialMedia === "youTube" && (
        <table className="table">
          <thead>
            <tr>
              <th>Marka</th>
              <th>Beğeni</th>
              <th>Yorum</th>
              <th>İzlenme</th>
              <th>Toplam Etkileşim</th>
            </tr>
          </thead>
          {youTubeBrands.map((brand, index) => {
            return (
              <tbody key={index}>
                <tr>
                  <td>{brand.username}</td>
                  <td>{brand.sums["likeCount"]}</td>
                  <td>{brand.sums["commentCount"]}</td>
                  <td>{brand.sums["viewCount"]}</td>
                  <td>{brand.sums["total"]}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      )}
    </>
  );
};

export default MultipleSearch;
