export default defineBackground(() => {
  const extensionId: string = browser.runtime.id;
  const guideUrl: string = browser.runtime.getURL('/guide/index.html');

  function processQuery(query: string): void {
    const processedQuery = query.trim();
    if (!processedQuery) {
      console.error('查詢字串不可為空');
      return;
    }
    browser.tabs.update({ url: `es://${encodeURIComponent(processedQuery)}` });
  }

  /**
   * 監聽訊息事件
   */
  browser.runtime.onMessage.addListener(({ action, query }) => {
    if (action === 'processQuery') {
      processQuery(query);
    }
  });

  /**
   * 監聽右鍵選單點擊事件
   */
  browser.contextMenus.onClicked.addListener(({ menuItemId, selectionText }) => {
    if (menuItemId === extensionId && !!selectionText) {
      processQuery(selectionText);
    }
  });

  /**
   * 安裝時建立右鍵選單
   */
  browser.runtime.onInstalled.addListener(({ reason }) => {
    browser.contextMenus.create({
      id: extensionId,
      title: '在電腦搜尋「%s」',
      contexts: ['selection'],
    });
    if (reason === browser.runtime.OnInstalledReason.INSTALL) {
      browser.tabs.create({ url: guideUrl });
    }
  });
});
