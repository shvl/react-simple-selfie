import React, { useCallback, useState, useRef } from "react";
import { ReactSimpleSelfie } from "../lib/ReactSimpleSelfie";
import { SELFIE_FRAME } from "../constants";
import { Processors } from "simple-selfie";
import { SimpleSelfie } from "../lib/Namespace";
import { RefSimpleSelfie } from "../lib/RefSimpleSelfie";
import { FacePosition } from "./FacePosition";
import { PictureModal } from "./PictureModal";
import { Loading } from "./Loading";
import { EyeBlurDetection } from "../interfaces/EyeBlurDetection";
import { Face } from "simple-selfie/dist/types";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import dogModel from "../images/dog.glb";
import * as dogMouth from "../constants/dogMouth";

function SelfieAvatar() {
  const [lookLeft, setLookLeft] = useState(false);
  const [lookRight, setLookRight] = useState(false);
  const [lookUp, setLookUp] = useState(false);
  const [lookDown, setLookDown] = useState(false);
  const [isPictureModalOpened, setIsPictureModalOpened] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");

  const parentRef = useRef<RefSimpleSelfie>();

  const onSelfie = useCallback((selfie: SimpleSelfie.Selfie) => {
    const canvas = selfie.outputCanvas;
    if (!canvas) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background, 0, 5);
    const camera = new THREE.PerspectiveCamera(
      75,
      SELFIE_FRAME.width / SELFIE_FRAME.height,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(SELFIE_FRAME.width, SELFIE_FRAME.height);

    const light = new THREE.AmbientLight(0x909090);
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);

    scene.add(light);
    scene.add(dirLight);
    let dog: any;

    const loader = new GLTFLoader();

    loader.load(
      dogModel,
      function (gltf: any) {
        dog = gltf.scene;
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    camera.position.z = 0.4;
    let oldRotation = { x: 0, y: 0, z: 0 };
    let olsScale = 1;
    const ROTATION_THRESHOLD = 2;
    const SCALE_THRESHOLD = 0.02;

    selfie.setOnResize(() => {
      const height = Math.min(
        selfie.getContainer().getBoundingClientRect().width,
        selfie.getContainer().getBoundingClientRect().height
      );
      const width = Math.floor(height * (SELFIE_FRAME.width / SELFIE_FRAME.height));
      canvas.width = width;
      canvas.height = height;
      renderer.setSize(width, height);
      camera.aspect = SELFIE_FRAME.width / SELFIE_FRAME.height;
      camera.updateProjectionMatrix();
    });

    selfie.setOnFrameProcessedCallback(
      (_ctx: CanvasRenderingContext2D | null, face: Face | null) => {
        if (!face || !dog) {
          return;
        }
        const rotation = face.direction.getRotation();
        const mouthHeight = Math.min(face.getMouthHeight(), 40);
        const openedMouthFactor = mouthHeight / 40;
        const nose = face.getNose();

        if (
          Math.abs(rotation.x - oldRotation.x) +
            Math.abs(rotation.y - oldRotation.y) +
            Math.abs(rotation.z - oldRotation.z) >
          ROTATION_THRESHOLD
        ) {
          dog.rotation.x = (-rotation.x * Math.PI) / 180;
          dog.rotation.y = (rotation.y * Math.PI) / 180;
          dog.rotation.z = (rotation.z * Math.PI) / 180;
          oldRotation = rotation;
        }

        dog.position.x = -(SELFIE_FRAME.width / 2 - nose.x) / 2000;
        dog.position.y = (SELFIE_FRAME.height / 2 - nose.y) / 2000;
        const scale = (face.getWidth() / 120);
        if (Math.abs(scale - olsScale) > SCALE_THRESHOLD) {
          dog.scale.set(scale, scale, scale);
          olsScale = scale;
        }

        const vertex = new THREE.Vector3();
        for (let j = 0; j < dog.children[0].children.length; j++) {
          const positionAttribute =
            dog.children[0].children[j].geometry.attributes.position;
          for (let i = 0; i < positionAttribute.count; i++) {
            const c = dogMouth.closed[j][i];
            const o = dogMouth.opened[j][i];

            vertex.fromBufferAttribute(positionAttribute, i);

            vertex.x = c.x + (o.x - c.x) * openedMouthFactor;
            vertex.y = c.y + (o.y - c.y) * openedMouthFactor;
            vertex.z = c.z + (o.z - c.z) * openedMouthFactor;

            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
          }
          positionAttribute.needsUpdate = true;
        }

        renderer.render(scene, camera);
      }
    );
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
    const mirrored = await Processors.mirror(SELFIE_FRAME, data);
    const image = await Processors.toImage(SELFIE_FRAME, mirrored);

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
          faceDetectionInterval={10}
          onSelfie={onSelfie}
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

export default SelfieAvatar;
