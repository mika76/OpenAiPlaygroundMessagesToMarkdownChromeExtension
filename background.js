// Keep track of the executed scripts in background.js
const executedScripts = new Set();

chrome.action.onClicked.addListener(async (tab) => {
    // Check if the script has already been executed on this tab
    if (executedScripts.has(tab.id)) {
        return;
    }
    executedScripts.add(tab.id);

    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });

        const response = results[0].result;
        const notificationOptions = {
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Playground Messages to Markdown'
        };

        if (response.success) {
            notificationOptions.message = 'Playground messages have been converted to Markdown and copied to the clipboard.';
        } else {
            notificationOptions.message = 'No messages found to convert.';
        }

        chrome.notifications.create(notificationOptions);
    } catch (error) {
        console.error('Error executing script:', error);
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Playground Messages to Markdown - Error',
            message: 'An error occurred while executing the script. Please try again.'
        });
    }
});