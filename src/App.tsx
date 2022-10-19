import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Layout from "./components/Layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Layout>
        <p className="text-3xl">This is Vite =+ RE</p>
      </Layout>
    </div>
  );
}

export default App;
