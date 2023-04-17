chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "closeTab") {
    chrome.tabs.remove(sender.tab.id);
    return;
  }

  if (request.action === "downloadImage") {
    const { imageURL, fileName } = request;

    // Download the image and save it to the custom folder
    chrome.downloads.download(
      {
        url: imageURL,
        filename: fileName,
        saveAs: false,
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          sendResponse({
            success: false,
            errorMessage: chrome.runtime.lastError.message,
          });
        } else {
          sendResponse({
            success: true,
            downloadId: downloadId,
          });
        }
      }
    );

    // Important: Return true to indicate that the response will be sent asynchronously
    return true;
  }
});
