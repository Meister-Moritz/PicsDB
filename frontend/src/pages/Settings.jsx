import ControlPannel from "./components/ControlPannel";
import CreateTag from "./components/CreateTag";
import CreateTagCat from "./components/CreateTagCat";
import Upload from "./components/Upload";

export default function Settings() {
  
  return (
    <>
    <ControlPannel title={"Settings"}/>
    <div className="content content-grid settings">
      <h1>Settings</h1>
      <CreateTagCat/>
      <CreateTag/>
      <Upload/>
    </div>

    </>
);
}