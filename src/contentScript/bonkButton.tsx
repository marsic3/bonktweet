import React, { FC } from "react";

const contentScript: FC<{ tweet: HTMLElement }> = ({ tweet }) => {
  // console.log(tweet);
  return (
    <div>
      <h1 className="text-xl text-green-500">Prknooo</h1>
    </div>
  );
};

export default contentScript;
