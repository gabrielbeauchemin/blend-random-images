import React from "react";
import "./App.css";
import html2canvas from "html2canvas";

function App() {
  return (
    <>
      <div className="App">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="Inputs">
            <div style={{ display: "flex" }}>
              <label htmlFor="images">Select files&nbsp;&nbsp;</label>
              <input
                type="file"
                id="images"
                name="files"
                onChange={(e) => {
                  if (e.target.files)
                    loadImagesSelection(e.target.files.length);
                }}
                multiple
              />
            </div>
            <div style={{ display: "flex", paddingBottom: "10px" }}>
              <label htmlFor="quantity">
                Number of random images at the time&nbsp;&nbsp;
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max="50"
              />
            </div>
            <input
              type="submit"
              value="Generate random image"
              className="Generate"
              onClick={generateRandomImg}
            />
          </div>

          <br />
        </form>
        <br />
        <div id="imgsContainer">
          <img width="800px" height="600px" alt="" />
        </div>
        <br/>
        <button className='downloadImg' onClick={downloadImg}> Download Image </button>
      </div>
    </>
  );
}

function createEmptyImgs(nbrImg: number) {
  let imgsContainer = document.getElementById("imgsContainer");
  if (imgsContainer) imgsContainer.innerHTML = "";
  for (let i = 0; i < nbrImg; i++) {
    var img = document.createElement("img");
    img.setAttribute("id", `target${i}`);
    img.style.visibility = "hidden";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.right = "0";
    img.style.bottom = "0";
    imgsContainer?.appendChild(img);
  }

  let inputQuantity = document.getElementById("quantity") as HTMLInputElement;
  if (inputQuantity) {
    inputQuantity.value = Math.ceil(nbrImg / 2).toString();
    inputQuantity.setAttribute("max", nbrImg.toString());
  }
}

function loadImagesSelection(nbrImgs: number) {
  createEmptyImgs(nbrImgs);

  var inputImgs = document.getElementById("images") as HTMLInputElement;
  let imgs = document
    .getElementById("imgsContainer")
    ?.getElementsByTagName("img");
  if (imgs) {
    for (let i = 0; i < imgs.length; i++) {
      let fr = new FileReader();

      fr.onload = function (e) {
        if (imgs) {
          (imgs[i] as any).src = (e.target as any).result;
        }
      };

      if (inputImgs.files && inputImgs.files.length > i)
        fr.readAsDataURL(inputImgs.files[i]);
    }
  }
}

function generateRandomImg() {
  let imgs = document
    .getElementById("imgsContainer")
    ?.getElementsByTagName("img");
  if (imgs) {
    for (let i = 0; i < imgs.length; i++) {
      let img = imgs[i] as HTMLImageElement;
      img.style.visibility = "hidden";
    }
  }

  let nbrRandomImg = (document.getElementById("quantity") as HTMLInputElement)
    .value;
  let randomIndexToMakeVisible = getRandoms(
    parseInt(nbrRandomImg),
    0,
    (imgs?.length || 1) - 1
  );
  randomIndexToMakeVisible.forEach((i) => {
    if (imgs) {
      imgs[i].style.visibility = "visible";
      imgs[i].style.opacity = (100.0 / parseInt(nbrRandomImg)).toString() + "%";
    }
  });
}

function getRandoms(quantity: number, min: number, max: number): number[] {
  let randoms: number[] = [];
  while (randoms.length < quantity) {
    let random = getRandom(min, max);
    if (!randoms.includes(random)) {
      randoms.push(random);
    }
  }
  return randoms;
}
function getRandom(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function downloadImg() {
  html2canvas(document.querySelector("#imgsContainer") as HTMLElement).then(
    (canvas) => {
      downloadCanvas(canvas, "generatedImage.png")
    }
  );
}

function downloadCanvas(canvas : HTMLCanvasElement, filename: string) {
  /// create an "off-screen" anchor tag
  var lnk = document.createElement('a'), e;

  /// the key here is to set the download attribute of the a tag
  lnk.download = filename;

  /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers
  lnk.href = canvas.toDataURL("image/png;base64");

  /// create a "fake" click-event to trigger the download
  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window,
                     0, 0, 0, 0, 0, false, false, false,
                     false, 0, null);

    lnk.dispatchEvent(e);
  } else{
    lnk.click();
  }
}

export default App;
