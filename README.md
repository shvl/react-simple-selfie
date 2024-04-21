# react-simple-selfie

Demo: [https://shvl.github.io/react-simple-selfie](https://shvl.github.io/react-simple-selfie)

## Installation

```bash
npm install react-simple-selfie
```

## Usage
Here's a basic example of how to use the react-simple-selfie component in your application.

```jsx
import React, { useRef } from 'react';
import { Selfie } from 'react-simple-selfie';

function App() {
  const selfieRef = useRef(null);

  const captureImage = () => {
    if (selfieRef.current) {
      const image = selfieRef.current.capture();
      console.log(image);
    }
  };

  return (
    <div>
      <Selfie ref={selfieRef} />
      <button onClick={captureImage}>Capture</button>
    </div>
  );
}

export default App;
```

In this example, we're creating a Selfie component and a button. When the button is clicked, it calls the captureImage function which uses the capture method from the Selfie component to capture the current frame.