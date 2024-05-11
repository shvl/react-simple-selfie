import React from "react";
import "./styles/app.css";
import SelfieBlurDetection from "./components/SelfieBlurDetection";
import SelfieAR from "./components/SelfieAR";
import SelfieAvatar from "./components/SelfieAvatar";

const getComponent = (value: string) => {
  switch (value) {
    case "selfie":
      return <SelfieBlurDetection />;
    case "ar":
      return <SelfieAR />;
    case "avatar":
      return <SelfieAvatar />;
    default:
      return null;
  }
};

function App() {
  const [value, setValue] = React.useState("selfie");
  const onDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const component = getComponent(value);

  return (
    <section className="container">
      <fieldset>
        <legend>Demo:</legend>
        <input
          type="radio"
          id="demo-selfie"
          value="selfie"
          name="demo"
          checked={value === "selfie"}
          onChange={onDemoChange}
        />
        <label htmlFor="demo-selfie">Selfie</label>
        <input
          type="radio"
          id="demo-ar"
          value="ar"
          name="demo"
          checked={value === "ar"}
          onChange={onDemoChange}
        />
        <label htmlFor="demo-ar">AR</label>
        <input
          type="radio"
          id="demo-avatar"
          value="avatar"
          name="demo"
          checked={value === "avatar"}
          onChange={onDemoChange}
        />
        <label htmlFor="demo-avatar">Avatar</label>
      </fieldset>

      {component}
    </section>
  );
}

export default App;
