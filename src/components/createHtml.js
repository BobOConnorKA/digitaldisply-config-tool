// Create the html files for the mp4, static, and top-screen image.

function GenHtml(files, file) {
  if (files[file].name.includes("mp4")) {
    // console.log("found mp4");
    const indexFile =
      "<!doctype html>" +
      '<html lang="en">' +
      "<head>" +
      '<meta charset="utf-8">' +
      "<style>" +
      " body {" +
      " background-color:black;" +
      "margin: 0;" +
      "padding:0;" +
      "border:0;" +
      "}" +
      "img{" +
      "display: block;" +
      "width: 100vw;" +
      "height: auto;" +
      "}" +
      "</style>" +
      "</head>" +
      "<body>" +
      '<video width="100%" height="100%" autoplay loop muted>' +
      '<source src="' +
      files[file].name +
      '" type="video/mp4">' +
      "</video>" +
      "</body>" +
      "</html>";

    return indexFile;
  }

  if (files[file].name.includes("Static")) {
    // console.log("found static");
    const staticFile =
      "<!doctype html>" +
      '<html lang="en">' +
      "<head>" +
      '<meta charset="utf-8">' +
      "<style>" +
      " body {" +
      " background-color:black;" +
      "margin: 0;" +
      "padding:0;" +
      "border:0;" +
      "}" +
      "img{" +
      "display: block;" +
      "width: 100vw;" +
      "height: auto;" +
      "}" +
      "</style>" +
      "</head>" +
      "<body>" +
      '<img src="' +
      files[file].name +
      '"/>' +
      "</body>" +
      "</html>";

    return staticFile;
  }
}

function GenTopScrHtml(files, file, path) {
  // console.log("found top screen");
  const topScreenFile =
    "<!DOCTYPE html>" +
    '<html style="width:100%; height:100%; margin:0; padding: 0; overflow:hidden;">' +
    '<body style="width:100%; height:100%; margin:0; padding: 0; overflow:hidden;">' +
    '<img src="../' +
    path +
    files[file].name +
    '" style="height:100%; width:100%;" />' +
    "</body>" +
    "</html>";

  return topScreenFile;
}

export { GenHtml, GenTopScrHtml };
