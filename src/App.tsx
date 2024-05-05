import React from "react";
import "./styles/app.css";
import SelfieBlurDetection from "./components/SelfieBlurDetection";
import SelfieAR from "./components/SelfieAR";

function App() {
  const [value, setValue] = React.useState("selfie");
  const onDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

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
      </fieldset>

      {
        value === "selfie" ? (
          <SelfieBlurDetection />
        ) : <SelfieAR />
      }
    </section>
  );
}

export default App;
