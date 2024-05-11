import React, {
  useEffect,
  useRef,
  Children,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Selfie } from "simple-selfie";
import { RefSimpleSelfie } from "./RefSimpleSelfie";
import { SimpleSelfie } from "./Namespace";
import { CapturedImage } from "simple-selfie/dist/CapturedImage";
import { Face, ProcessedFrame } from "simple-selfie/dist/types";

export const ReactSimpleSelfie = forwardRef(
  (
    {
      classes = [],
      styles = {},
      children,
      onFaceFrameProcessed,
      onFrameProcessed,
      loadingComponent,
      faceDetectionInterval,
      onSelfie,
    }: {
      classes?: string[];
      styles?: React.CSSProperties;
      children?: React.ReactNode;
      onFaceFrameProcessed?: (frame: ProcessedFrame) => void;
      onFrameProcessed?: (frameData: CanvasRenderingContext2D | null, face: Face | null) => void;
      loadingComponent?: React.ReactNode;
      faceDetectionInterval?: number;
      onSelfie?: (selfie: SimpleSelfie.Selfie) => void;
    },
    ref: React.Ref<RefSimpleSelfie>
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selfie, setSelfie] = React.useState<SimpleSelfie.Selfie | null>(
      null
    );
    const [loading, setLoading] = React.useState(true);

    useImperativeHandle(
      ref,
      () => ({
        captureImage(): Promise<SimpleSelfie.CapturedImage> {
          if (!selfie) {
            return Promise.resolve(new CapturedImage(null, undefined));
          }

          return selfie.captureImage();
        },
      }),
      [selfie]
    );

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }
      const selfieComponent = new Selfie({
        container: containerRef.current,
        onFaceFrameProcessed: onFaceFrameProcessed,
        onFrameProcessed: onFrameProcessed,
        onLoaded: () => setLoading(false),
        faceDetectionInterval: faceDetectionInterval,
      });

      if (onSelfie){
        onSelfie(selfieComponent);
      }

      selfieComponent.start();
      selfieComponent.startFaceDetection();
      setSelfie(selfieComponent);
      return () => {
        selfieComponent.stop();
      };
    }, [containerRef, onFaceFrameProcessed, onFrameProcessed, faceDetectionInterval, onSelfie]);

    return (
      <div
        className={classes.join(" ")}
        style={{
          width: "720px",
          height: "560px",
          overflow: "hidden",
          ...styles,
        }}
        ref={containerRef}
      >
        {
          loading && loadingComponent ? (
            <>{loadingComponent}</>
          ) : null
        }
        {children && Children.map(children, (child) => <>{child}</>)}
      </div>
    );
  }
);
