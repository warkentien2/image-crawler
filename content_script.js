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
      const downloadImage = async (imageSrc) => {
        const image = await fetch(imageSrc);
        const imageBlog = await image.blob();
        const imageURL = URL.createObjectURL(imageBlog);
        const imageName = imageSrc.match(/([\w_-]+\.(jpg|jpeg|webp|gif|png))/g)
          ? imageSrc.match(/([\w_-]+\.(jpg|jpeg|webp|gif|png))/g).pop()
          : imageURL.split("/").pop();
        const imageDomain =
          window.location.hostname
            .split(".")
            .filter((w) => w.length > 4)
            .pop() || "miscellaneous";

        return new Promise((resolve) => {
          chrome.runtime.sendMessage(
            {
              action: "downloadImage",
              imageURL: imageURL,
              fileName: `${imageDomain}/${imageName}`,
            },
            (response) => {
              if (response.success) {
                console.log("Download started with ID:", response.downloadId);
              } else {
                console.error(response.errorMessage);
              }
              resolve();
            }
          );
        });
      };

      const imagesToDownload = Array.from(
        document.querySelectorAll(cssSelectors)
      );

      if (imagesToDownload.length !== 0) {
        Promise.all(
          imagesToDownload.map((image) => {
            return downloadImage(image.src);
          })
        ).then(() => {
          chrome.runtime.sendMessage({ action: "closeTab" });
        });
      }
    })
    .catch((error) => console.error("Error:", error));
})();
