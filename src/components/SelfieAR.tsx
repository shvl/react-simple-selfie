import React, { useCallback, useState, useRef, useEffect } from "react";
import { ReactSimpleSelfie } from "../lib/ReactSimpleSelfie";
import glasses from "../images/glasses.svg";
import { SELFIE_FRAME } from "../constants";
import { Processors } from "simple-selfie";
import { SimpleSelfie } from "../lib/Namespace";
import { RefSimpleSelfie } from "../lib/RefSimpleSelfie";
import { FacePosition } from "./FacePosition";
import { PictureModal } from "./PictureModal";
import { Loading } from "./Loading";
import { EyeBlurDetection } from "../interfaces/EyeBlurDetection";
import { Face } from "simple-selfie/dist/types";

function SelfieAR() {
  const [lookLeft, setLookLeft] = useState(false);
  const [lookRight, setLookRight] = useState(false);
  const [lookUp, setLookUp] = useState(false);
  const [lookDown, setLookDown] = useState(false);
  const [isPictureModalOpened, setIsPictureModalOpened] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");
  const [glassesImage, setGlassesImage] = useState<HTMLImageElement | null>(
    null
  );

  const parentRef = useRef<RefSimpleSelfie>();

  useEffect(() => {
    const image = new Image();
    image.src = glasses;
    image.onload = () => {
      setGlassesImage(image);
    };
    image.onerror = (err) => {
      console.error("Failed to load glasses image");
    }
  }, []);

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

    const data = capturedImage.getImageData();
    const image = await Processors.toImage(SELFIE_FRAME, data);

    setCapturedImage(image);
    setIsPictureModalOpened(true);
  }, [parentRef]);

  const onFaceFrameProcessed = useCallback(
    (processed: SimpleSelfie.ProcessedFrame) => {
      if (!processed.isFaceDetected()) {
        return;
      }

      const face = processed.getFace();

      setLookLeft(face.direction.isLookLeft());
      setLookRight(face.direction.isLookRight());
      setLookUp(face.direction.isLookUp());
      setLookDown(face.direction.isLookDown());
    },
    []
  );

  const onFrameProcessed = useCallback(
    (ctx: CanvasRenderingContext2D | null, face: Face | null) => {
      if (!face || !glassesImage || !ctx) {
        return;
      }
      const betweenEyes = face.getBetweenEyes();
      const faceWidth = face.getWidth() * 1.2;
      const rotation = face.direction.getRotation();
      const scaleFactor = faceWidth / glassesImage.width;
      const height = glassesImage.height * scaleFactor;
      const width = glassesImage.width * scaleFactor;

      ctx.save();
      ctx.setTransform(
        new DOMMatrix()
          .translateSelf(betweenEyes.x, betweenEyes.y)
          .rotateSelf(rotation.x, rotation.y, rotation.z)
      );
      ctx.drawImage(glassesImage, -width / 2, -height / 2, width, height);
      ctx.restore();
    },
    [glassesImage]
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
          onFrameProcessed={onFrameProcessed}
          styles={{
            aspectRatio: "1",
            maxWidth: "560px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={["video-container__video"]}
          loadingComponent={<Loading />}
          faceDetectionInterval={10}
        ></ReactSimpleSelfie>
      </div>
      <button className="capture-button" onClick={captureImage}>
        Capture a picture
      </button>
      <PictureModal
        isOpened={isPictureModalOpened}
        onClose={closeModal}
        capturedImage={capturedImage}
        showBlurDetection={false}
        blurDetectionLeftEye={{} as EyeBlurDetection}
        blurDetectionRightEye={{} as EyeBlurDetection}
        blurVariance={0}
      ></PictureModal>
    </div>
  );
}

export default SelfieAR;
