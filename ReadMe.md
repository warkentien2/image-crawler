# Image Crawler

> Download an image file from every open tab

**Scenario:** you're navigating through image galleries and opening the images you like on separate tabs. Later you decide to download all open images. This extension will save you manual trouble.

## How to use:

1. While browsing a gallery:
   - open a new tab with every image you wish to download
   - inspect your HTML and find a unique CSS selector that will always point to the desired image
   - save `selector` for later
   - **PRO TIP:** you can target multiple webpages/galleries, just separate CSS selectos with a comma
2. Save your progress with an extension like [OneTab](https://chrome.google.com/webstore/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall)
3. Open this extension's content_script:
   - update `UNIQUE_IMAGE_CSS_SELECTOR` with your desired `selector`
4. Open Chrome and navigate to `chrome://extensions`
5. Turn on the **Developer mode**
6. Click the "Load Unpacked" button and find this project's folder.
   - Click "select"
7. Finally, open all stored tabs saved on [OneTab](https://chrome.google.com/webstore/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall). Files will automatically download to your Downloads folder
8. Don't forget to turn off your extension (;
