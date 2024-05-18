import React, { useEffect } from "react";
import "./styles/app.css";
import SelfieBlurDetection from "./components/SelfieBlurDetection";
import SelfieAR from "./components/SelfieAR";
import SelfieAvatar from "./components/SelfieAvatar";
import { useRouter } from "./hooks/useRouter";

const pages = [
  { name: "selfie", title: "Selfie", component: <SelfieBlurDetection />},
  { name: "ar", title: "AR", component: <SelfieAR />},
  { name: "avatar", title: "Avatar", component: <SelfieAvatar />},
];

function App() {
  const { query, navigate } = useRouter();

  const onDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate(e.target.value);
  };

  useEffect(() => {
    const appName = query.get("app");
    const exists = pages.find((page) => page.name === appName);
    if (!appName && !exists) {
      navigate(pages[0].name);
    }
  }, [query, navigate]);

  const appName = query.get("app");
  const component = pages.find((page) => page.name === appName)?.component;

  return (
    <section className="container">
      <fieldset>
        <legend>Demo:</legend>
        {pages.map((page, i) => (
          <div key={i}>
            <input
              type="radio"
              id={`demo-${page.name}`}
              value={page.name}
              name="demo"
              checked={appName === page.name}
              onChange={onDemoChange}
            />
            <label htmlFor={`demo-${page.name}`}>{page.title}</label>
          </div>
        ))}
      </fieldset>

      {component}
    </section>
  );
}

export default App;
