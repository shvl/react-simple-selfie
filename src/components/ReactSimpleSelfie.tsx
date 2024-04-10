import React, {
  useEffect,
  useRef,
  Children,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Selfie } from "simple-selfie";
import { RefSelfie } from "../interfaces/RefSelfie";
import { SimpleSelfie } from '../Namespace'

export const ReactSimpleSelfie = forwardRef(
  (
    {
      classes = [],
      styles = {},
      children,
      onFrameProcessed = () => {},
    }: {
      classes?: string[];
      styles?: React.CSSProperties;
      children?: React.ReactNode;
      onFrameProcessed?: (frame: SimpleSelfie.ProcessedFrame) => void;
    },
    ref: React.Ref<RefSelfie> 
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selfie, setSelfie] = React.useState<SimpleSelfie.Selfie | null>(null);
    useImperativeHandle(
      ref,
      () => ({
        captureImage(): Uint8ClampedArray{
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
        onFrameProcessed: onFrameProcessed,
      });

      selfieComponent.start();
      selfieComponent.startFaceDetection();
      setSelfie(selfieComponent);
      return () => {
        selfieComponent.stop();
      };
    }, [containerRef, onFrameProcessed]);

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
