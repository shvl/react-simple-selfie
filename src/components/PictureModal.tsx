import React, { useCallback, useMemo } from "react";
import { BLUR_THRESHOLD } from "../constants";
import { EyeBlurDetection } from "../interfaces/EyeBlurDetection";
import { EyeGrid } from "./EyeGrid";

export const PictureModal = ({
  isOpened,
  onClose,
  capturedImage,
  blurDetectionLeftEye,
  blurDetectionRightEye,
  blurVariance,
}: {
  isOpened: boolean;
  onClose: () => void;
  capturedImage: string;
  blurDetectionLeftEye: EyeBlurDetection;
  blurDetectionRightEye: EyeBlurDetection;
  blurVariance: number;
}) => {
  const isBlurred = useMemo(
    () => blurVariance < BLUR_THRESHOLD,
    [blurVariance]
  );
  const download = useCallback(() => {
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `captured-image-${Date.now()}.png`;
    link.click();
  }, [capturedImage]);

  return (
    <dialog className="captured-image-modal" open={isOpened}>
      <article>
        <header>
          <button
            className="captured-image-modal__close"
            aria-label="Close"
            rel="prev"
            onClick={onClose}
          ></button>
          <p>
            <strong>Captured image</strong>
          </p>
        </header>
        <div className="result">
          <div className="result-image">
            <img
              src={capturedImage}
              className="result-image__image"
              alt="selfie"
            />
            <p className={`result-image__blurred ${ isBlurred ? 'result-image__blurred_blurred' : ''}`}>
              {isBlurred ? "Blurred" : "Not blurred: "}{" "}
              {Math.round(blurVariance)}
            </p>
            <div>
              <button className="download" onClick={download}>
                Download
              </button>
            </div>
          </div>
          <div className="result-image">
            <details>
              <summary>Blur detection</summary>
              <EyeGrid {...blurDetectionLeftEye} />
              <EyeGrid {...blurDetectionRightEye} />
            </details>
          </div>
        </div>
      </article>
    </dialog>
  );
};
