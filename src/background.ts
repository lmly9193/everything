const extensionId: string = chrome.runtime.id;

function processQuery(query: string): void {
  const processedQuery = query.trim();
  if (!processedQuery) {
    console.error('查詢字串不可為空');
    return;
  }
  chrome.tabs.update({ url: `es://${encodeURIComponent(processedQuery)}` });
}

/**
 * 監聽訊息事件
 */
chrome.runtime.onMessage.addListener(({ action, query }) => {
  if (action === 'processQuery') {
    processQuery(query);
  }
});

/**
 * 監聽右鍵選單點擊事件
 */
chrome.contextMenus.onClicked.addListener(({ menuItemId, selectionText }) => {
  if (menuItemId === extensionId && !!selectionText) {
    processQuery(selectionText);
  }
});

/**
 * 安裝時建立右鍵選單
 */
chrome.runtime.onInstalled.addListener(({ reason }) => {
  chrome.contextMenus.create({
    id: extensionId,
    title: '在電腦搜尋「%s」',
    contexts: ['selection'],
  });
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: `chrome-extension://${extensionId}/index.html` });
  }
});
