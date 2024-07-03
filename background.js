function processQuery(query) {
  return new Promise((resolve) => {
    const url = `es://${query}`;
    chrome.tabs.update({ url: url }, () => {
      resolve(`查詢結果 ${query}`);
    });
  });
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "EverythingSearch",
    title: "在電腦搜尋「%s」",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "EverythingSearch") {
    const query = encodeURIComponent(info.selectionText);
    const url = `es://${query}`;
    chrome.tabs.update({ url: url });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processQuery") {
    const query = request.query;
    const url = `es://${query}`;
    chrome.tabs.update({ url: url });
    sendResponse({ result: `查詢結果 ${query}` });
  }
});
