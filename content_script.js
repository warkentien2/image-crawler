(() => {
  const gistUrl =
    "https://gist.github.com/warkentien2/665c9e86d99d93a9bf239f082df13184";
  const fileName = "image-crawler-css-selectors.txt";
  const apiUrl = `https://api.github.com/gists/${gistUrl.split("/").pop()}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const file = data.files[fileName];
      if (file) {
        return fetch(file.raw_url);
      } else {
        throw new Error(`File ${fileName} not found in Gist ${gistUrl}`);
      }
    })
    .then((response) => response.text())
    .then((cssSelectors) => {
      let uniqueId = 0;
      const FILE_NAME = "fetchedImg-";

      const downloadImage = async (imageSrc) => {
        const image = await fetch(imageSrc);
        const imageBlog = await image.blob();
        const imageURL = URL.createObjectURL(imageBlog);

        const link = document.createElement("a");
        link.href = imageURL;
        link.download = `${FILE_NAME}_${uniqueId++}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      const imagesToDownload = Array.from(
        document.querySelectorAll(cssSelectors)
      );

      const restartLocalStorage = () => {
        const newStorageItem = JSON.stringify({
          timestamp: new Date().getTime(),
          counter: 0,
        });
        localStorage.setItem("open-tab-image-crawler", newStorageItem);
      };

      let localStorageItem = localStorage.getItem("open-tab-image-crawler");
      if (localStorageItem) {
        const localStorageObject = JSON.parse(localStorageItem);
        const timestamp = localStorageObject.timestamp;
        const now = new Date().getTime();
        if (now - timestamp > 5 * 60 * 1000) {
          // timed out - restart localStorage item
          restartLocalStorage();
        } else {
          // increment counter
          uniqueId = localStorageObject.counter;
          const anotherStorageItem = JSON.stringify({
            timestamp: timestamp,
            counter: uniqueId + imagesToDownload.length,
          });
          localStorage.setItem("open-tab-image-crawler", anotherStorageItem);
        }
      } else {
        // first use - creating localStorage item
        restartLocalStorage();
      }

      if (imagesToDownload.length !== 0) {
        Promise.all(
          imagesToDownload.map((image) => {
            return downloadImage(image.src);
          })
        ).then(() => {
          window.top.close();
        });
      }
    })
    .catch((error) => console.error("Error:", error));
})();
