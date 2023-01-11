import React from "react";

export default function contentScript() {
  console.log("misko");

  const bonkTweet = (e) => {
    e.stopPropagation();
    console.log("bonkkkk");
  };

  return (
    <div>
      <h1 className="text-xl text-green-500" onClick={bonkTweet}>
        Bonk tweet
      </h1>
    </div>
  );
}
