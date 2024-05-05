import React from "react";
import { EyeBlurDetection } from "../interfaces/EyeBlurDetection";

export const EyeGrid = ({
  name,
  image,
  laplacian,
  noiseSuppressed,
  variance,
}: EyeBlurDetection) => {
  return (
    <>
      <h3>{name} eye</h3>
      <div className="grid grid_blur-detection">
        <div className="grid__title">
          <div className="grid__title-text">Eye</div>
        </div>
        <div className="grid__title">
          <div className="grid__title-text">Laplacian</div>
        </div>
        <div className="grid__title">
          <div className="grid__title-text">Noise</div>
        </div>
        <div className="grid__title">
          <div className="grid__title-text">Variance</div>
        </div>
        <div className="grid__value">
          <img
            className="blur-detection__cropped"
            src={image}
            alt={`${name} eye`}
          />
        </div>
        <div className="grid__value">
          <img
            className="blur-detection__laplacian"
            src={laplacian}
            alt={`${name} eye laplacian`}
          />
        </div>
        <div className="grid__value">
          <img
            className="blur-detection__suppressed"
            src={noiseSuppressed}
            alt={`${name} eye suppressed`}
          />
        </div>
        <div className="grid__value">{variance}</div>
      </div>
    </>
  );
};
