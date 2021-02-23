import Header from "./components/Header";
import AddInput from "./components/AddInput";
// import UploadZip from "./components/UploadZip";
import "./App.css";
import { useState } from "react";

function App() {
  
  const [input, setInput] = useState([
    {
      id: 1,
      date: "MMDDYYYY",
      ticknu: "vgr-1234",
      directory: "directory1",
    },
  ]);

  return (
    <div className="container">
      <Header />
      <AddInput />
      {/* <UploadZip /> */}
    </div>
  );
}

export default App;
