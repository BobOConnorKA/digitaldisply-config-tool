import { useState, setState } from "react";
import { ShareServiceClient } from "@azure/storage-file-share";
import { GenHtml, GenTopScrHtml } from "./createHtml";
const JSZip = require("jszip");

// Dev storage account
var shareName = "merch";
var url = "https://km2gouploadfnc.file.core.windows.net/?sv=2019-12-12&ss=bfqt&srt=sco&sp=rwlacupx&se=2021-04-01T03:54:53Z&st=2021-01-31T20:54:53Z&spr=https&sig=n%2FzSUyIxdsQ3rvMaRx4n6s7HeE4mlUtcumX85NNZfKQ%3D";


//prod
// var shareName = "merchandiser";
// var url = "https://voyagerprod.file.core.windows.net/?sv=2020-02-10&ss=f&srt=sco&sp=rwlc&se=2021-07-01T09:07:28Z&st=2021-02-23T02:07:28Z&spr=https&sig=JJSo0h6I3HegcDgigAqPXXIEOGnkGX5DlfT%2BRH2i%2Bhc%3D";

var serviceClientWithSaS = new ShareServiceClient(url);

//React Hooks State 
const AddTask = () => {
  const [date, setDate] = useState("");
  const [ticket, setTicket] = useState("");
  const [directory, setDirectory] = useState("");
  // const [files, setFile] = useState("");

  return (
    <form className="add-form" >
      <div className="form-control">
        <label>Date:</label>
        <input
          name="date"
          type="text"
          placeholder="MMDDYYYY"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label>Jira Ticket Number:</label>
        <input
          name="ticket"
          type="text"
          placeholder="VGR-1234"
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label>Directory Name:</label>
        <input
          name="directory"
          type="text"
          placeholder="Enter Directory Name"
          value={directory}
          onChange={(e) => setDirectory(e.target.value)}
        />
      </div>
      <div className="form-control">
        <input
          type="button"
          value="Create Directory Path"
          className="btn btn-block"
           onClick={createBaseFolder}
        />
      </div>
    
      <div className="form-control">
        <input name="file" type="file" multiple onChange={createZip} />
      </div>
    </form>
  );

  // Create azure files directory path '/date/ticket/directory/'
  async function createBaseFolder(e) {
    console.log(`Path = /${date}/${ticket}/${directory}`);
   
    const serviceClientWithSaS = new ShareServiceClient(url);
    const shareClient = serviceClientWithSaS.getShareClient(shareName);
    const directoryClient = shareClient.getDirectoryClient(date);

    try {
      await directoryClient.create();
      await directoryClient.createSubdirectory(ticket);
      const directoryClient2 = directoryClient.getDirectoryClient(ticket);
      await directoryClient2.createSubdirectory(directory);
      console.log("success creating Azure directory path..");
      return "success on create directory path";
    } catch (err) {
      console.error(err);
    }
  }

  async function createZip(e) {
    console.log(`Path = /${date}/${ticket}/${directory}`);
    var zipname = directory;
    const zip = new JSZip();
    const files = e.target.files;

    var path = "" + date + "/" + ticket + "/" + directory + "/";

    try {
      for (let file = 0; file < files.length; file++) {
        // Look for the top-screen.
        if (files[file].name.includes("960")) {
          console.log("Found top-screen file...");
          const blobData = new Blob([GenTopScrHtml(files, file, path)]);
          await uploadTopScreen(
            "" + files[file].name.slice(0, -3) + "html",
            blobData
          );
          await uploadFile(files[file].name, files[file]);
        }

        // look for the video and create index.html.
        if (files[file].name.includes("mp4")) {
          console.log("Found mp4 file...");
          zip.file("index.html", GenHtml(files, file));
          const blobData = new Blob([GenHtml(files, file)]);
          await uploadFile("index.html", blobData);
          await uploadFile(files[file].name, files[file]);
        }
        // look for static file and create in-use.html
        if (files[file].name.includes("still" || "static")) {
          console.log("Found static file...");
          zip.file("in-use.html", GenHtml(files, file));

          const blobData = new Blob([GenHtml(files, file)]);
          await uploadFile("in-use.html", blobData);
          await uploadFile(files[file].name, files[file]);
        }

        // Zip file with the file name.
        zip.file(files[file].name, files[file]);

        console.log("OK.. add file(s) to zip.");
      }
    } catch (err) {
      console.log("ERROR generateAsync:", err);
    }
    try {
      //Create zip file with mp4 and static content.
      await zip.generateAsync({ type: "blob" }).then((content) => {
        uploadFile("" + zipname + ".zip", content);
      });
      console.log("OK.. generateAsync Zip success.  ");
    } catch (err) {
      console.log("ERROR in generateAsync:", err);
    }
  }

  async function uploadFile(filename1, imageData) {
    console.log("Entering upload file.");

    const shareClient = serviceClientWithSaS.getShareClient(shareName);
    const directoryClient = shareClient.getDirectoryClient(date);
    const ticketDir = directoryClient.getDirectoryClient(ticket);
    const zipFileDest = ticketDir.getDirectoryClient(directory);

    
    const content = imageData;
    const fileName = filename1;
    const fileClient = zipFileDest.getFileClient(fileName);
    await fileClient.create(content.size);

    console.log(`Blob size = ${content.size}`);

    const output = await fileClient.uploadData(content);

    return output;
  }

  async function uploadTopScreen(filename1, imageData) {
    const shareClient = serviceClientWithSaS.getShareClient(shareName);
    const directoryClient = shareClient.getDirectoryClient("en-US");

    const content = imageData;
    const fileName = filename1;
    const fileClient = directoryClient.getFileClient(fileName);
    await fileClient.create(content.size);

    console.log(`Blob size = ${content.size}`);

    const output = await fileClient.uploadData(content);

    return output;
  }
};

export default AddTask;
