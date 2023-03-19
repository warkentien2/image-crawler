let uniqueId = 0;
const FILE_NAME = "open-tab-image";
const UNIQUE_IMAGE_CSS_SELECTOR = ".flex.justify-between.items-center>a>img";

async function downloadImage(imageSrc) {
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = `${FILE_NAME}_${uniqueId++}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const imagesToDownload = document.querySelectorAll(UNIQUE_IMAGE_CSS_SELECTOR);

if (imagesToDownload.length !== 0) {
  imagesToDownload.forEach((image) => {
    downloadImage(image.src);
  });
}
