declare namespace SimpleSelfie {
    export type Frame = import("simple-selfie/dist/types").Frame;
    export type Size = import("simple-selfie/dist/types").Size;
    export type ProcessedFrame =
      import("simple-selfie/dist/types").ProcessedFrame;
    export type Face = import("simple-selfie/dist/Face").Face;
    export type FaceDirection =
      import("simple-selfie/dist/FaceDirection").FaceDirection;
    export type Selfie = import("simple-selfie/dist/types").Selfie;
  }
  
  export type { SimpleSelfie };