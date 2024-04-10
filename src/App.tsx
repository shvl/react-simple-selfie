import React, { useCallback, useState, useRef } from "react";
import "./styles/app.css";
import { ReactSimpleSelfie } from "./components/ReactSimpleSelfie";
import overlay from "./images/overlay.svg";
import {
  FACE_DEVIATION,
  FACE_FRAME,
  FACE_WIDTH,
  SELFIE_FRAME,
} from "./constants";
import { Processors } from "simple-selfie";
import { SimpleSelfie } from "./Namespace";
import { RefSelfie } from "./interfaces/RefSelfie";
import { FacePosition } from "./components/FacePosition";
import { PictureModal } from "./components/PictureModal";

function App() {
  const [lastFaceFrame, setLastFaceFrame] = useState<SimpleSelfie.Frame | null>(
    null
  );
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [lookLeft, setLookLeft] = useState(false);
  const [lookRight, setLookRight] = useState(false);
  const [lookUp, setLookUp] = useState(false);
  const [lookDown, setLookDown] = useState(false);
  const [isPictureModalOpened, setIsPictureModalOpened] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");
  const [edgeDetectionImage, setEdgeDetectionImage] = useState("");
  const [blurVariance, setBlurVariance] = useState(0);

  const parentRef = useRef<RefSelfie>();

  const closeModal = useCallback(() => {
    setIsPictureModalOpened(false);
  }, []);

  const captureImage = useCallback(async () => {
    if (!parentRef.current || !lastFaceFrame) {
      return;
    }

    const data = parentRef.current.captureImage();

    const image = await Processors.toImage(SELFIE_FRAME, data);
    const cropped = await Processors.cropFrame(
      SELFIE_FRAME,
      lastFaceFrame,
      data
    );
    const resized = await Processors.resizeFrame(
      lastFaceFrame,
      FACE_FRAME,
      cropped
    );
    const laplacian = await Processors.laplacian(FACE_FRAME, resized);
    const laplacianImage = await Processors.toImage(FACE_FRAME, laplacian);
    const blurVarianceResult = await Processors.variance(laplacian);

    setCapturedImage(image);
    setEdgeDetectionImage(laplacianImage);
    setIsPictureModalOpened(true);
    setBlurVariance(blurVarianceResult);
  }, [parentRef, lastFaceFrame]);

  const onFrameProcessed = useCallback(
    (result: SimpleSelfie.ProcessedFrame) => {
      const { face, faceFrame } = result;
      setLastFaceFrame(faceFrame);

      if (face) {
        const faceWidth = face.getWidth();

        const deviationFaceWidth = Math.abs(FACE_WIDTH - faceWidth);
        const deviationFacePosition = face.getFacePosiotion();
        const overlayVisible =
          deviationFaceWidth > FACE_DEVIATION ||
          deviationFacePosition > FACE_DEVIATION * 2;
        setOverlayVisible(overlayVisible);
      }

      setLookLeft(face.direction.isLookRight()); //mirroring camera
      setLookRight(face.direction.isLookLeft()); //mirroring camera
      setLookUp(face.direction.isLookUp());
      setLookDown(face.direction.isLookDown());
    },
    []
  );

  return (
    <div className="page-video">
      <FacePosition
        lookLeft={lookLeft}
        lookRight={lookRight}
        lookUp={lookUp}
        lookDown={lookDown}
      />

      <div className="video-container">
        <ReactSimpleSelfie
          ref={parentRef as React.LegacyRef<RefSelfie> | undefined}
          onFrameProcessed={onFrameProcessed}
          styles={{
            aspectRatio: "1",
            maxWidth: "560px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={overlay}
            className={`overlay ${overlayVisible ? "overlay_visible" : ""}`}
            alt="overlay"
          />
        </ReactSimpleSelfie>
      </div>
      <button className="capture-button" onClick={captureImage}>
        Capture a picture
      </button>
      <PictureModal
        isOpened={isPictureModalOpened}
        onClose={closeModal}
        capturedImage={capturedImage}
        edgeDetectionImage={edgeDetectionImage}
        blurVariance={blurVariance}
      ></PictureModal>
    </div>
  );
}

export default App;
