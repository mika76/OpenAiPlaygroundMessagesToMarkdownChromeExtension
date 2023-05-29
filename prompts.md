# Playground Messages Export

Date: 29/03/2023 12:02:27

---

**SYSTEM:** sdfsdfdsf

---

**USER:** Could you help me write a small chrome addin which would pull out all of these playground messages into just plain markdown. Make sure you use the manifest 3 style extension.

---

**ASSISTANT:** Certainly! Here's a simple Chrome extension using Manifest V3 that extracts playground messages and converts them into plain Markdown.

First, create a new directory for your extension and add four files in it: `manifest.json`, `content.js`, `background.js`, and `icon.png`.

1. `manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "Playground Messages to Markdown",
  "version": "1.0",
  "description": "Extract playground messages and convert them into plain Markdown.",
  "icons": {
    "48": "icon.png"
  },
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "action": {
    "default_icon": "icon.png",
    "default_title": "Convert to Markdown"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["*://*/*"],
      "js": ["content.js"]
    }
  ]
}
```

2. `content.js`:

```javascript
function extractMessages() {
  const messages = document.querySelectorAll('.chat-message');
  let markdownText = '';

  messages.forEach(message => {
    const role = message.querySelector('.chat-message-role-text')?.innerText;
    const messageContent = message.querySelector('.text-input')?.value;
    if (role && messageContent) {
      markdownText += `**${role}:** ${messageContent}\n\n`;
    }
  });

  return markdownText;
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractAndConvert') {
    const markdownText = extractMessages();
    if (markdownText) {
      copyToClipboard(markdownText);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
  }
});
```

3. `background.js`:

```javascript
chrome.action.onClicked.addListener(async (tab) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });

  chrome.tabs.sendMessage(tab.id, { action: 'extractAndConvert' }, (response) => {
    if (response.success) {
      alert('Playground messages have been converted to Markdown and copied to the clipboard.');
    } else {
      alert('No messages found to convert.');
    }
  });
});
```

4. Download an icon for your extension, such as this [example icon](https://icons.iconarchive.com/icons/paomedia/small-n-flat/48/file-text-icon.png), and save it as `icon.png` in your extension directory.

After creating these files, follow these steps to load your extension in Chrome:

1. Open the Chrome browser and go to `chrome://extensions/`.
2. Toggle the "Developer mode" switch in the top right corner.
3. Click the "Load unpacked" button that appears and select the directory containing your extension files.

Now, you should see your new extension in the list of installed extensions. When you click on the extension icon, it will extract the playground messages from the current page, convert them to Markdown, and copy the result to the clipboard.

Please note that for this extension to work, the web page must have elements with the class names `chat-message`, `chat-message-role-text`, and `text-input`. You might need to adjust the code to target the correct elements on the specific website you're using.

---

**USER:** Uncaught SyntaxError: Identifier 'tab' has already been declared

---

**ASSISTANT:** Apologies for the oversight. I made a mistake in the `background.js` file. Here's the corrected version of the `background.js` file:

```javascript
chrome.action.onClicked.addListener(async () => {
  const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['content.js']
  });

  chrome.tabs.sendMessage(currentTab.id, { action: 'extractAndConvert' }, (response) => {
    if (response.success) {
      alert('Playground messages have been converted to Markdown and copied to the clipboard.');
    } else {
      alert('No messages found to convert.');
    }
  });
});
```

I've replaced `const [tab]` with `const [currentTab]` to avoid the redeclaration of the identifier 'tab'. This should resolve the error. Please use this updated `background.js` file for your extension.

---

**USER:** Error handling response: TypeError: Cannot read properties of undefined (reading 'success') at chrome-extension://bkajkkohidbiaefanfnkgcbhfofcamid/background.js:10:22

---

**ASSISTANT:** Apologies for the confusion. It seems I missed adding the `return true` statement in the `onMessage` listener in `content.js` to handle the asynchronous response. Here's the updated `content.js` file:

```javascript
function extractMessages() {
  const messages = document.querySelectorAll('.chat-message');
  let markdownText = '';

  messages.forEach(message => {
    const role = message.querySelector('.chat-message-role-text')?.innerText;
    const messageContent = message.querySelector('.text-input')?.value;
    if (role && messageContent) {
      markdownText += `**${role}:** ${messageContent}\n\n`;
    }
  });

  return markdownText;
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractAndConvert') {
    const markdownText = extractMessages();
    if (markdownText) {
      copyToClipboard(markdownText);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
    return true; // Add this line to handle the asynchronous response
  }
});
```

With this change, the error should be resolved. Please use this updated `content.js` file for your extension.

---

**USER:** Error handling response: TypeError: Cannot read properties of undefined (reading 'success') at chrome-extension://bkajkkohidbiaefanfnkgcbhfofcamid/background.js:10:22

---

**ASSISTANT:** I apologize for the confusion earlier. It seems that the issue is caused by the use of the `chrome.tabs.sendMessage` method. In Manifest V3, it is recommended to use the `chrome.scripting.executeScript` method with a function that returns a Promise. Here's the updated solution for both `content.js` and `background.js`.

1. Replace the `content.js` file with the following code:

```javascript
function extractMessages() {
  const messages = document.querySelectorAll('.chat-message');
  let markdownText = '';

  messages.forEach(message => {
    const role = message.querySelector('.chat-message-role-text')?.innerText;
    const messageContent = message.querySelector('.text-input')?.value;
    if (role && messageContent) {
      markdownText += `**${role}:** ${messageContent}\n\n`;
    }
  });

  return markdownText;
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

(async () => {
  if (window.extractAndConvert) return;

  window.extractAndConvert = true;

  const markdownText = extractMessages();
  if (markdownText) {
    copyToClipboard(markdownText);
    return { success: true };
  } else {
    return { success: false };
  }
})();
```

2. Replace the `background.js` file with the following code:

```javascript
chrome.action.onClicked.addListener(async (tab) => {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    const response = results[0].result;
    if (response.success) {
      alert('Playground messages have been converted to Markdown and copied to the clipboard.');
    } else {
      alert('No messages found to convert.');
    }
  } catch (error) {
    console.error('Error executing script:', error);
  }
});
```

With these changes, the extension should work correctly. The `content.js` script now returns a Promise with the result, and the `background.js` script waits for the result using the `await` keyword. This approach should resolve the error related to reading the 'success' property.

---

**USER:** rror executing script: ReferenceError: alert is not defined

---

**ASSISTANT:** I apologize for the oversight. The `alert()` function is not available in the background script. You can use the `chrome.notifications.create()` method instead to show a notification.

Here's the updated `background.js` file:

```javascript
chrome.action.onClicked.addListener(async (tab) => {
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
  }
});
```

In this updated `background.js` file, I replaced the `alert()` function with the `chrome.notifications.create()` method to show notifications. Make sure to add the `"notifications"` permission to your `manifest.json` file:

```json
{
  "permissions": [
    "activeTab",
    "scripting",
    "notifications"
  ]
}
```

With these changes, the extension will display a notification instead of an alert dialog.

---

**USER:** I now get the "no messages found to convert" - did you use the html I sent above?

---

**ASSISTANT:** Apologies for the confusion. I realize that I didn't use the provided HTML structure in my previous responses. Here's the updated `content.js` file that should work with the HTML you provided:

```javascript
function extractMessages() {
  const messages = document.querySelectorAll('.chat-pg-message');
  let markdownText = '';

  messages.forEach(message => {
    const role = message.querySelector('.chat-message-role-text')?.innerText;
    const messageContent = message.querySelector('.text-input')?.value;
    if (role && messageContent) {
      markdownText += `**${role}:** ${messageContent}\n\n`;
    }
  });

  return markdownText;
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

(async () => {
  if (window.extractAndConvert) return;

  window.extractAndConvert = true;

  const markdownText = extractMessages();
  if (markdownText) {
    copyToClipboard(markdownText);
    return { success: true };
  } else {
    return { success: false };
  }
})();
```

In this updated `content.js` file, I changed the query selector to target `.chat-pg-message` instead of `.chat-message`. This should now correctly work with the provided HTML structure.

Please replace the `content.js` file in your extension with this updated code, and it should work as expected.

---

**USER:** This works great. Can we add two more things?
1. the followng html holds where a user enters the system prompt. Could we place this also at the top of the exported markdown

```html
<div class="text-input-with-header chat-pg-instructions"><div class="text-input-header-subheading subheading">System</div><div class="text-input-header-wrapper overflow-wrapper text-input"><textarea aria-label="Input" class="text-input text-input-lg text-input-full text-input-header-buffer" placeholder="You are a helpful assistant."></textarea></div></div>
```

2. Could you put a markdown line between all the messages for some whitespace

---

**ASSISTANT:** Sure! Here's the updated `content.js` file with the requested changes:

```javascript
function extractSystemPrompt() {
  const systemPrompt = document.querySelector('.text-input-with-header.chat-pg-instructions .text-input')?.value;
  return systemPrompt ? `**System:** ${systemPrompt}\n\n---\n\n` : '';
}

function extractMessages() {
  const messages = document.querySelectorAll('.chat-pg-message');
  let markdownText = '';

  messages.forEach((message, index) => {
    const role = message.querySelector('.chat-message-role-text')?.innerText;
    const messageContent = message.querySelector('.text-input')?.value;
    if (role && messageContent) {
      markdownText += `**${role}:** ${messageContent}`;
      if (index < messages.length - 1) {
        markdownText += '\n\n---\n\n';
      }
    }
  });

  return markdownText;
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

(async () => {
  if (window.extractAndConvert) return;

  window.extractAndConvert = true;

  const systemPrompt = extractSystemPrompt();
  const markdownText = extractMessages();
  if (systemPrompt || markdownText) {
    copyToClipboard(systemPrompt + markdownText);
    return { success: true };
  } else {
    return { success: false };
  }
})();
```

In this updated `content.js` file, I added a function called `extractSystemPrompt()` to extract the system prompt from the provided HTML and included it at the top of the exported Markdown. I also added a Markdown line (---) between all messages for some whitespace.

Please replace the `content.js` file in your extension with this updated code, and it should work as requested.

---

**USER:** instead of a console error could we send an error notification?

---

**ASSISTANT:** Certainly! You can use the `chrome.notifications.create()` method to show an error notification as well. Here's the updated `background.js` file with an error notification:

```javascript
chrome.action.onClicked.addListener(async (tab) => {
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
```

In this updated `background.js` file, I added a `chrome.notifications.create()` method inside the `catch` block to show an error notification when an error occurs while executing the script.

Please replace the `background.js` file in your extension with this updated code, and it should show an error notification instead of a console error.

---

**USER:** Interesting - it works great when clicking once - but if I click again I get the following error "Error executing script: TypeError: Cannot read properties of null (reading 'success')" - I removed the try catch and it actually seems the executeScript does not work the second time. result is just null.

---

**ASSISTANT:** You're right. The issue occurs because the `content.js` script checks if `window.extractAndConvert` is already defined and returns if it is. The purpose of this check is to prevent the script from running multiple times, but it seems that it's causing the issue you described.

A better approach would be to remove the check for `window.extractAndConvert` and make sure the script is injected only once. Here's the updated `content.js` file:

```javascript
// Remove the window.extractAndConvert check in content.js
(async () => {
  const systemPrompt = extractSystemPrompt();
  const markdownText = extractMessages();
  if (systemPrompt || markdownText) {
    copyToClipboard(systemPrompt + markdownText);
    return { success: true };
  } else {
    return { success: false };
  }
})();
```

And here's the updated `background.js` file that ensures the script is only injected once:

```javascript
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
```

In the updated `background.js`, I added a `Set` called `executedScripts` to keep track of the tabs where the script has already been executed. Before executing the script, the `background.js` checks if the script has already been executed on the current tab and skips execution if it has.

Please replace the `content.js` and `background.js` files in your extension with these updated codes, and it should work as expected.

---

**USER:** I'm not sure the system part works - I get nothing even if I type something into the textbox

---

**ASSISTANT:** My apologies for that. Let's modify the `content.js` file to ensure that the system part is extracted correctly.

Please update the `content.js` file with the following code:

```javascript
function extractSystemPrompt() {
  const systemPromptElement = document.querySelector('.text-input-with-header.chat-pg-instructions textarea');
  if (systemPromptElement && systemPromptElement.value !== '') {
    return `**System:** ${systemPromptElement.value}\n\n---\n\n`;
  }
  return '';
}

function extractMessages() {
  const messages = document.querySelectorAll('.chat-pg-message');
  let markdownText = '';

  messages.forEach((message, index) => {
    const role = message.querySelector('.chat-message-role-text')?.innerText;
    const messageContent = message.querySelector('.text-input')?.value;
    if (role && messageContent) {
      markdownText += `**${role}:** ${messageContent}`;
      if (index < messages.length - 1) {
        markdownText += '\n\n---\n\n';
      }
    }
  });

  return markdownText;
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

(async () => {
  const systemPrompt = extractSystemPrompt();
  const markdownText = extractMessages();
  if (systemPrompt || markdownText) {
    copyToClipboard(systemPrompt + markdownText);
    return { success: true };
  } else {
    return { success: false };
  }
})();
```

In this updated `content.js` file, I changed the `querySelector` in the `extractSystemPrompt()` function to ensure it targets the correct `<textarea>` element.

Please replace the `content.js` file in your extension with this updated code, and the system prompt should be included in the exported Markdown as expected.

---

**USER:** SYSTEM is a role so it should be uppercase like the others. Could you also add a date, time and header at the top of the markdown

---

**ASSISTANT:** Sure! You can use the `Date` object to add the current date and time to the top of the Markdown. Here's the updated `content.js` file with the requested changes:

```javascript
function getCurrentDateTime() {
  const now = new Date();
  return now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
}

function extractSystemPrompt() {
  const systemPromptElement = document.querySelector('.text-input-with-header.chat-pg-instructions textarea');
  if (systemPromptElement && systemPromptElement.value !== '') {
    return `**SYSTEM:** ${systemPromptElement.value}\n\n---\n\n`;
  }
  return '';
}

function extractMessages() {
  const messages = document.querySelectorAll('.chat-pg-message');
  let markdownText = '';

  messages.forEach((message, index) => {
    const role = message.querySelector('.chat-message-role-text')?.innerText.toUpperCase();
    const messageContent = message.querySelector('.text-input')?.value;
    if (role && messageContent) {
      markdownText += `**${role}:** ${messageContent}`;
      if (index < messages.length - 1) {
        markdownText += '\n\n---\n\n';
      }
    }
  });

  return markdownText;
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

(async () => {
  const header = `# Playground Messages Export\n\nDate: ${getCurrentDateTime()}\n\n---\n\n`;
  const systemPrompt = extractSystemPrompt();
  const markdownText = extractMessages();
  if (systemPrompt || markdownText) {
    copyToClipboard(header + systemPrompt + markdownText);
    return { success: true };
  } else {
    return { success: false };
  }
})();
```

In this updated `content.js` file, I added a `getCurrentDateTime()` function to get the current date and time, and included it in a header at the top of the Markdown. I also changed the system role to uppercase in the `extractSystemPrompt()` function.

Please replace the `content.js` file in your extension with this updated code, and the generated Markdown should include the date, time, header, and an uppercase "SYSTEM" role as requested.

---

**USER:** I think this is great for ver 1 of the extension. Thanks a million. Great work!

---

**ASSISTANT:** You're welcome! I'm glad you found the extension helpful. If you have any more questions or need further assistance in the future, please don't hesitate to ask. Good luck with your project, and have a great day!

---

