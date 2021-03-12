import { useState } from "react";
import { ShareServiceClient } from "@azure/storage-file-share";
import { GenHtml, GenTopScrHtml } from "./createHtml";
const JSZip = require("jszip");

// Dev storage account
// var shareName = "merch";
// var url =
//   "https://km2gouploadfnc.file.core.windows.net/?sv=2019-12-12&ss=bfqt&srt=sco&sp=rwlacupx&se=2021-04-01T03:54:53Z&st=2021-01-31T20:54:53Z&spr=https&sig=n%2FzSUyIxdsQ3rvMaRx4n6s7HeE4mlUtcumX85NNZfKQ%3D";

//prod
var shareName = "merchandiser";
var url =
  "https://voyagerprod.file.core.windows.net/?sv=2020-02-10&ss=f&srt=sco&sp=rwlc&se=2021-07-01T09:07:28Z&st=2021-02-23T02:07:28Z&spr=https&sig=JJSo0h6I3HegcDgigAqPXXIEOGnkGX5DlfT%2BRH2i%2Bhc%3D";

var serviceClientWithSaS = new ShareServiceClient(url);

//React state hooks
const AddTask = () => {
  const [date, setDate] = useState("");
  const [ticket, setTicket] = useState("");
  const [directory, setDirectory] = useState("");
  const [tsurl, setTsurl] = useState("");
  const [mp4url, setMp4url] = useState("");
  const [staticurl, setStaticurl] = useState("");
  const [zipurl, setZipURL] = useState("");
  const [zipinuseurl, setZipInUseURL] = useState("");

  // function Language() {
  //   const [laguages, setLanguage] = useState(0);

  //   function increment() {
  //     setSteps(prevState => prevState + 1);
  //   }
  // }

  return (
    <form className="add-form">
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
        <label>Jira Ticket #:</label>
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
          placeholder="2021HolidayContent"
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
      <form>
        <label>
          en-US
          <input
            className="form-control-check"
            type="checkbox"
            name="en-US"
            value="en-US"
            label="junk"
          />
        </label>
        <label>
          es-ES
          <input
            className="form-control-check"
            type="checkbox"
            name="es-ES"
            value="es-ES"
          />
          fr-FR
          <input
            className="form-control-check"
            type="checkbox"
            name="fr-FR"
            value="fr-FR"
          />
        </label>
        de-DE
        <input
          className="form-control-check"
          type="checkbox"
          name="de-DE"
          value="de-DE"
        />
      </form>

      <div className="form-control">
        <input
          name="file"
          type="file"
          multiple
          onChange={createZip}
          className="file file-block"
        />
      </div>

      <div className="form-control">
        <p>
          {tsurl.length > 0 && (
            // <li {...(tsurl ? { tsurl } : {})}>Preview TS = {tsurl}</li>
            <li>
              <a href={tsurl} target="_blank">
                Preview TopScreen = {tsurl}
              </a>
            </li>
          )}

          {staticurl.length > 0 && (
            <li>
              <a href={staticurl} target="_blank">
                Preview InUse = {staticurl}
              </a>
            </li>
          )}

          {mp4url.length > 0 && (
            <li>
              <a href={mp4url} target="_blank">
                Preview Video = {mp4url}
              </a>
            </li>
          )}

          {zipurl.length > 0 && (
            <li>
              <a href={zipurl} target="_blank">
                digitalDisplay = {zipurl}
              </a>
            </li>
          )}

          {zipinuseurl.length > 0 && (
            <li>
              <a href={zipinuseurl} target="_blank">
                digitalDisplayInUse = {zipinuseurl}
              </a>
            </li>
          )}
        </p>
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
      console.log("Success creating Azure directory path..");
    } catch (err) {
      console.error(err);
    }
  }

  async function createZip(e) {
    var zipName = `${directory}.zip`;
    const zip = new JSZip();
    const files = e.target.files;

    const path = `${date}/${ticket}/${directory}/`;
    const path1 = `./${date}/${ticket}/${directory}/`;

    try {
      for (let file = 0; file < files.length; file++) {
        // Look for the top-screen.
        if (files[file].name.includes("1120")) {
          console.log("Found top-screen file...");

          const blobData = new Blob([GenTopScrHtml(files, file, path)]);

          await uploadTopScreen(
            "" + files[file].name.slice(0, -3) + "html",
            blobData
          );

          uploadFile(files[file].name, files[file]);

          setTsurl(
            `http://kodakmomentsstage.kodakalaris.com/voyager/marcomm/v2/en-US/${files[
              file
            ].name.slice(0, -3)}html`
          );
          console.log(`this is the top-screen URL... ${tsurl}`);
        }

        // Find the MP4 Video and create index.html.
        if (files[file].name.includes("mp4")) {
          console.log("Found mp4 file...");
          zip.file("index.html", GenHtml(files, file));
          const blobData = new Blob([GenHtml(files, file)]);
          uploadFile("index.html", blobData);
          uploadFile(files[file].name, files[file]);
          setMp4url(
            `http://kodakmomentsstage.kodakalaris.com/voyager/${path}index.html`
          );
        }
        // Find the static file and create in-use.html, add it to the zip, and upload it all to the file share.
        if (files[file].name.includes("Static")) {
          console.log("Found static file...");
          zip.file("in-use.html", GenHtml(files, file));

          const blobData = new Blob([GenHtml(files, file)]);
          uploadFile("in-use.html", blobData);
          uploadFile(files[file].name, files[file]);
          setStaticurl(
            `http://kodakmomentsstage.kodakalaris.com/voyager/${path}in-use.html`
          );
          setZipInUseURL(
            `http://kodakmomentsstage.kodakalaris.com/voyager/${path}${zipName}?siteroot=in-use.html`
          );
        }

        // Add the files to Zip with the file name.
        zip.file(files[file].name, files[file]);

        console.log(`OK.. add ${files[file].name} file to zip.`);
      }
    } catch (err) {
      console.error("generateAsync:", err);
    }
    try {
      //Create zip file with mp4 and static content.
      await zip.generateAsync({ type: "blob" }).then((content) => {
        uploadFile(zipName, content);
      });
      setZipURL(
        `http://kodakmomentsstage.kodakalaris.com/voyager/${path}${zipName}`
      );

      console.log("OK.. generateAsync Zip success.  ");
    } catch (err) {
      console.error("generateAsync:", err);
    }
  }

  async function uploadFile(fileName, imageData) {
    console.log("Entering upload file.");

    const shareClient = serviceClientWithSaS.getShareClient(shareName);
    const directoryClient = shareClient.getDirectoryClient(date);
    const ticketDir = directoryClient.getDirectoryClient(ticket);
    const zipFileDest = ticketDir.getDirectoryClient(directory);

    //const fileName = fileName;
    const fileClient = zipFileDest.getFileClient(fileName);
    await fileClient.create(imageData.size);

    console.log(`Blob size = ${imageData.size}`);

    const output = await fileClient.uploadData(imageData);

    return output;
  }

  async function uploadTopScreen(fileName, imageData) {
    var language = ["en-US", "es-ES", "fr-FR", "de-DE"];

    for (var i = 0; i < language.length; i++) {
      console.log("this is the lang... " + language[i]);
      const shareClient = serviceClientWithSaS.getShareClient(shareName);
      const directoryClient = shareClient.getDirectoryClient("marcomm");
      const marcommVer = directoryClient.getDirectoryClient("v2");
      const languageDir = marcommVer.getDirectoryClient(language[i]);

      //  const fileName = fileName;
      const fileClient = languageDir.getFileClient(fileName);
      await fileClient.create(imageData.size);

      console.log(`Blob size = ${imageData.size}`);
      const output = await fileClient.uploadData(imageData);
    }

    // return output;
  }
};

export default AddTask;
