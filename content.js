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