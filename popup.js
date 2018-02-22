function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, (tabs) => {
        var tab = tabs[0];
        var url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });

}

function changeBackgroundColor(color) {
    // var script = 'document.body.style.backgroundColor="' + color + '";';
    var script = `
    var commentText = [];
    var commentsObj = document.getElementsByClassName('comment-text-content');
    for (let i in commentsObj) {
        if (commentsObj.hasOwnProperty(i)){
            commentText.push(commentsObj[i].innerHTML)
            if (commentsObj[i].innerHTML.split('?').length > 1){    
                commentsObj[i].style.backgroundColor = 'red'
            } else {          
                commentsObj[i].style.backgroundColor = '${color}'
            }
        }
    }
    console.log(commentText)
    let wordCount = {}
    let allText = commentText.join(' ')
    allText.split(' ').forEach( word => wordCount[word] ? wordCount[word]++ : wordCount[word] = 1)
    console.log(wordCount)
    `

    chrome.tabs.executeScript({
        code: script
    });
}

function getSavedBackgroundColor(url, callback) {

    chrome.storage.sync.get(url, (items) => {
        callback(chrome.runtime.lastError ? null : items[url]);
    });
}

function saveBackgroundColor(url, color) {
    var items = {};
    items[url] = color;
    chrome.storage.sync.set(items);
}


document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabUrl((url) => {
        var dropdown = document.getElementById('dropdown');

        getSavedBackgroundColor(url, (savedColor) => {
            if (savedColor) {
                changeBackgroundColor(savedColor);
                dropdown.value = savedColor;
            }
        });

        dropdown.addEventListener('change', () => {
            changeBackgroundColor(dropdown.value);
            saveBackgroundColor(url, dropdown.value);
        });
    });
});