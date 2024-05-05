import { SimpleSelfie } from "./Namespace";

export interface RefSimpleSelfie {
  captureImage(): Promise<SimpleSelfie.CapturedImage>;
}
