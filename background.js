chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ focusMode: false, sitios: [] });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return;

    chrome.storage.local.get(['focusMode', 'sitios'], (data) => {
        if (!data.focusMode) return;

        const url = new URL(tab.url);
        const hostname = url.hostname.replace('www.', '');

        if (data.sitios && data.sitios.includes(hostname)) {
            const bloqueado = encodeURIComponent(hostname);
            chrome.tabs.update(tabId, {
                url: chrome.runtime.getURL(`block.html?site=${bloqueado}`)
            });
        }
    });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.openPopup) {
        chrome.windows.create({
            url: chrome.runtime.getURL('popup.html'),
            type: 'popup',
            width: 400,
            height: 500
        });
    }
});
