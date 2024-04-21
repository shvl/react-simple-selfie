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

export const ReactSimpleSelfie = forwardRef(
  (
    {
      classes = [],
      styles = {},
      children,
      onFaceFrameProcessed = () => {},
    }: {
      classes?: string[];
      styles?: React.CSSProperties;
      children?: React.ReactNode;
      onFaceFrameProcessed?: (frame: SimpleSelfie.ProcessedFrame) => void;
    },
    ref: React.Ref<RefSimpleSelfie>
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selfie, setSelfie] = React.useState<SimpleSelfie.Selfie | null>(
      null
    );
    useImperativeHandle(
      ref,
      () => ({
        captureImage(): Uint8ClampedArray {
          if (!selfie) {
            return new Uint8ClampedArray();
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
      });

      selfieComponent.start();
      selfieComponent.startFaceDetection();
      setSelfie(selfieComponent);
      return () => {
        selfieComponent.stop();
      };
    }, [containerRef, onFaceFrameProcessed]);

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
        {children && Children.map(children, (child) => <>{child}</>)}
      </div>
    );
  }
);
