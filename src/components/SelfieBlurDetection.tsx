import React, { useCallback, useState, useRef } from "react";
import { ReactSimpleSelfie } from "../lib/ReactSimpleSelfie";
import overlay from "../images/overlay.svg";
import {
  FACE_DEVIATION,
  FACE_WIDTH,
  SELFIE_FRAME,
} from "../constants";
import { Processors } from "simple-selfie";
import { SimpleSelfie } from "../lib/Namespace";
import { RefSimpleSelfie } from "../lib/RefSimpleSelfie";
import { FacePosition } from "./FacePosition";
import { PictureModal } from "./PictureModal";
import { Loading } from "./Loading";
import { Frame } from "simple-selfie/dist/types";
import { EyeBlurDetection } from "../interfaces/EyeBlurDetection";

function SelfieBlurDetection() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [lookLeft, setLookLeft] = useState(false);
  const [lookRight, setLookRight] = useState(false);
  const [lookUp, setLookUp] = useState(false);
  const [lookDown, setLookDown] = useState(false);
  const [isPictureModalOpened, setIsPictureModalOpened] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");
  const [blurDetectionLeftEye, setBlurDetectionLeftEye] = useState<EyeBlurDetection>({} as EyeBlurDetection);
  const [blurDetectionRightEye, setBlurDetectionRightEye] = useState<EyeBlurDetection>({} as EyeBlurDetection);
  const [blurVariance, setBlurVariance] = useState(0);

  const parentRef = useRef<RefSimpleSelfie>();

  const closeModal = useCallback(() => {
    setIsPictureModalOpened(false);
  }, []);

  const captureImage = useCallback(async () => {
    if (!parentRef.current) {
      return;
    }

    const capturedImage = await parentRef.current.captureImage();
    if (!capturedImage.isFaceDetected()) {
      return alert("No face detected");
    }

    const face = capturedImage.getFace();
    const data = capturedImage.getImageData();

    const getEyeVariance = async (data: Uint8ClampedArray, eyeFrame: Frame, name: string): Promise<EyeBlurDetection> => {
      const cropped = await Processors.cropFrame(SELFIE_FRAME, eyeFrame, data);
      const croppedImage = await Processors.toImage(eyeFrame, cropped);
      const laplacian = await Processors.laplacian(eyeFrame, cropped, 1.2);
      const laplacianImage = await Processors.toImage(eyeFrame, laplacian);

      const THRERSHOLD = 60;

      const reluMiniProcessed = await Processors.pixelProcessor(eyeFrame, laplacian, (value) => value > THRERSHOLD ? value : 0);

      const suppresedNoizeLaplacian = await Processors.suppressNoise(eyeFrame, reluMiniProcessed, 5, THRERSHOLD);
      const suppresedNoizeLaplacianImage = await Processors.toImage(eyeFrame, suppresedNoizeLaplacian);
      const blurVarianceResult = await Processors.variance(suppresedNoizeLaplacian);
      const normalizedBlurVariance = (blurVarianceResult * eyeFrame.width) / eyeFrame.height;

      return {
        name,
        image: croppedImage,
        laplacian: laplacianImage,
        noiseSuppressed: suppresedNoizeLaplacianImage,
        variance: Math.round(normalizedBlurVariance)
      };
    };

    const leftEyeFrame = face.getLeftEyeFrame();
    const rightEyeFrame = face.getRightEyeFrame();

    const leftEyeVariance = await getEyeVariance(data, leftEyeFrame, 'left');
    const rightEyeVariance = await getEyeVariance(data, rightEyeFrame, 'right');

    setBlurDetectionLeftEye(leftEyeVariance);
    setBlurDetectionRightEye(rightEyeVariance);

    const mirrored = await Processors.mirror(SELFIE_FRAME, data);
    const image = await Processors.toImage(SELFIE_FRAME, mirrored);

    setCapturedImage(image);
    setIsPictureModalOpened(true);
    setBlurVariance(leftEyeVariance.variance + rightEyeVariance.variance);
  }, [parentRef]);

  const onFaceFrameProcessed = useCallback(
    (processed: SimpleSelfie.ProcessedFrame) => {
      if (!processed.isFaceDetected()) {
        return;
      }

      const face = processed.getFace();

      if (face) {
        const faceWidth = face.getWidth();

        const deviationFaceWidth = Math.abs(FACE_WIDTH - faceWidth);
        const deviationFacePosition = face.getFacePosiotion();
        const overlayVisible =
          deviationFaceWidth > FACE_DEVIATION ||
          deviationFacePosition > FACE_DEVIATION;
        setOverlayVisible(overlayVisible);
      }

      setLookLeft(face.direction.isLookLeft());
      setLookRight(face.direction.isLookRight());
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

      <div className="video-container" data-testid="video-container">
        <ReactSimpleSelfie
          ref={parentRef as React.LegacyRef<RefSimpleSelfie> | undefined}
          onFaceFrameProcessed={onFaceFrameProcessed}
          styles={{
            aspectRatio: "1",
            maxWidth: "560px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={["video-container__video"]}
          loadingComponent={<Loading />}
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
        showBlurDetection={true}
        blurDetectionLeftEye={blurDetectionLeftEye}
        blurDetectionRightEye={blurDetectionRightEye}
        blurVariance={blurVariance}
      ></PictureModal>
    </div>
  );
}

export default SelfieBlurDetection;
