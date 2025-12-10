import ControlPannel from "./components/ControlPannel";
import CreateTag from "./components/CreateTag";
import Upload from "./components/Upload";

export default function Settings() {
  
  return (
    <>
    <ControlPannel title={"Settings"}/>
    <div className="content content-grid">
      <h1>Settings</h1>
      <CreateTag/>
      <Upload/>
    </div>

    </>
);
}