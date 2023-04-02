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

      const restartStorage = () => {
        const newStorageItem = {
          timestamp: new Date().getTime(),
          counter: 0,
        };
        chrome.storage.local.set({ "open-tab-image-crawler": newStorageItem });
      };

      chrome.storage.local.get("open-tab-image-crawler", (result) => {
        let storageObject = result["open-tab-image-crawler"];
        if (storageObject) {
          const timestamp = storageObject.timestamp;
          const now = new Date().getTime();
          if (now - timestamp > 5 * 60 * 1000) {
            // timed out - restart storage item
            restartStorage();
          } else {
            // increment counter
            uniqueId = storageObject.counter;
            const anotherStorageItem = {
              timestamp: timestamp,
              counter: uniqueId + imagesToDownload.length,
            };
            chrome.storage.local.set({
              "open-tab-image-crawler": anotherStorageItem,
            });
          }
        } else {
          // first use - creating storage item
          restartStorage();
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
      });
    })
    .catch((error) => console.error("Error:", error));
})();
