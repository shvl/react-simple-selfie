import React from "react";
import facePosition from "../images/face-position.svg";

export const FacePosition = ({
  lookUp,
  lookRight,
  lookDown,
  lookLeft,
}: {
  lookUp: boolean;
  lookRight: boolean;
  lookDown: boolean;
  lookLeft: boolean;
}) => {
  return (
    <div className="face-position">
    <img
      src={facePosition}
      className={`face-position__direction face-position__direction_up ${
        lookUp ? "face-position__direction_visible" : ""
      }`}
      alt="face-position"
    />
    <img
      src={facePosition}
      className={`face-position__direction face-position__direction_right ${
        lookRight ? "face-position__direction_visible" : ""
      }`}
      alt="face-position"
    />
    <img
      src={facePosition}
      className={`face-position__direction face-position__direction_down ${
        lookDown ? "face-position__direction_visible" : ""
      }`}
      alt="face-position"
    />
    <img
      src={facePosition}
      className={`face-position__direction face-position__direction_left ${
        lookLeft ? "face-position__direction_visible" : ""
      }`}
      alt="face-position"
    />
  </div>
  );
};