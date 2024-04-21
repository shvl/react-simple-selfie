import { SimpleSelfie } from "../lib/Namespace";

export const WIDEO_WEIGHTS_PATH =
  process.env.NODE_ENV === "production"
    ? "./weights"
    : "./react-simple-selfie/weights";
export const FACE_WIDTH = 170;
export const FACE_DEVIATION = 45;
export const BLUR_THRESHOLD = 1100;
export const SELFIE_FRAME: SimpleSelfie.Frame = {
  x: 0,
  y: 0,
  width: 720,
  height: 560,
};
export const FACE_FRAME: SimpleSelfie.Frame = {
  x: 0,
  y: 0,
  width: 200,
  height: 200,
};
