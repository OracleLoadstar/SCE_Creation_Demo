// 变量定义
const serverselector = document.getElementById('server');
const servervaule = document.getElementById('server').value;
const rememberTabCheckbox = document.getElementById('remember-tab');
var jpserver = true;
const langselector = document.getElementById('language');
var _lang_ = "zh_CN"; // 用于存储当前语言标识符

// 页面加载时检查本地存储
window.addEventListener('load', () => {
    // const rememberTab = localStorage.getItem('rememberTab');
    // if (rememberTab === 'true') {
    //     rememberTabCheckbox.checked = true;
    //     showNotification('Welcome back!', 'info');
    //     // TODO: Add logic to open the last remembered tab
    // }
    console.log("Start load");

    // 从语言选择器获取初始语言
    const initialLang = document.getElementById('language').value;
    _lang_ = initialLang; // 在加载时更新全局语言变量 _lang_
    updatetext(_lang_); // 根据初始语言更新所有文本内容
    onRouteChange(); // 触发路由变化以根据哈希和语言设置初始标题
});

// 监听复选框的变化
// rememberTabCheckbox.addEventListener('change', () => {
//     if (rememberTabCheckbox.checked) {
//         localStorage.setItem('rememberTab', 'true');
//     } else {
//         localStorage.removeItem('rememberTab');
//     }
// });

// 监听服务器变化
serverselector.addEventListener('change', () => {
    if (servervaule == "JP") {
        jpserver = true;
    }
});

// 通知系统
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // 设置初始状态为隐藏
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';

    const icon = document.createElement('span');
    icon.className = 'material-icons notification-icon';
    icon.textContent = type === 'error' ? 'error' : (type === 'error' ? 'error' : 'info');

    const content = document.createElement('div');
    content.className = 'notification-content';
    content.textContent = message;

    const progress = document.createElement('div');
    progress.className = 'notification-progress';

    notification.appendChild(icon);
    notification.appendChild(content);
    notification.appendChild(progress);

    // 添加到容器前，移动已有的通知
    const notifications = container.getElementsByClassName('notification');
    Array.from(notifications).forEach(notif => {
        notif.classList.add('move-down');
    });

    // 添加新通知到容器
    container.insertBefore(notification, container.firstChild);

    // 触发进入动画
    requestAnimationFrame(() => {
        notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';

        // 启动进度条动画
        requestAnimationFrame(() => {
            progress.classList.add('running');
        });
    });

    // 设置移除通知的超时
    const removeNotification = () => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';

        notification.addEventListener('transitionend', () => {
            if (container.contains(notification)) {
                container.removeChild(notification);
                // 恢复其他通知的位置
                const remainingNotifications = container.getElementsByClassName('notification');
                Array.from(remainingNotifications).forEach(notif => {
                    notif.classList.remove('move-down');
                });
            }
        }, { once: true });
    };

    // 3秒后移除通知
    const timeout = setTimeout(removeNotification, 3000);

    // 鼠标悬停时暂停进度条和移除计时器
    notification.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        progress.style.animationPlayState = 'paused';
    });

    // 鼠标离开时恢复进度条和重新设置移除计时器
    notification.addEventListener('mouseleave', () => {
        progress.style.animationPlayState = 'running';
        setTimeout(removeNotification, 3000);
    });
}

// 语言更新
langselector.addEventListener('change', (event) => {
    _lang_ = event.target.value; // 更新全局语言变量
    updatetext(_lang_); // 更新所有文本内容
    // 更新文本后，根据当前路由和新语言更新标题
    const currentPageId = get_page_id(); // 正确获取当前页面ID
    if (currentPageId !== "Not Found") {
        updatetitle(_lang_, currentPageId); // 使用新语言和当前页面更新标题
    } else {
        // 处理未找到当前页面的情况（例如，404页面）
        updatetitle(_lang_, '404'); // 假设404页面也需要更新标题
    }
});

// 根据语言和页面更新文档标题的函数
function updatetitle(_nowlang_, _nowpage_) {
    let langObject;
    // 假设语言对象（如 zh_cn, ja_jp, en_us）在 lang.js 或其他地方全局可用
    if (_nowlang_ === "zh-CN") {
        langObject = zh_cn;
    } else if (_nowlang_ === "ja-JP") {
        // 需要确保 ja_jp 在 lang.js 或其他地方已定义
        langObject = typeof ja_jp !== 'undefined' ? ja_jp : null; // 安全检查对象是否存在
        if (!langObject) {
            console.error("日语语言数据未加载");
            // showNotification("日语语言数据未加载","error"); // 如果缺少语言数据则通知
        }
    } else if (_nowlang_ === "en-US") {
        // 需要确保 en_us 在 lang.js 或其他地方已定义
        langObject = typeof en_us !== 'undefined' ? en_us : null; // 安全检查对象是否存在
        if (!langObject) {
            console.error("英语语言数据未加载");
            // showNotification("英语语言数据未加载","error"); // 如果缺少语言数据则通知
        }
    } else {
        // 如果语言未知或缺少数据，默认为中文
        langObject = zh_cn;
        console.error("未知语言或语言数据未加载: " + _nowlang_); // 通知未知语言
        // showNotification("未知语言或语言数据未加载: " + _nowlang_, "error");
    }

    if (langObject) {
        if (_nowpage_ === "home") {
            document.title = langObject.title;
        } else if (_nowpage_ === "cardlist") {
            document.title = "Oload - " + langObject.cardlist;
        } else if (_nowpage_ === "about") {
            document.title = "Oload - " + langObject.about;
        } else if (_nowpage_ === "404") { // 明确处理 404 页面标题
            document.title = langObject._404;
        }
        // 这里没有 else 分支，如果页面 ID 不是 home, cardlist, about 或 404，标题将不会改变。
    }
}

// 根据语言更新文本内容的函数
function updatetext(_nowlang_ = "zh-CN") {
    let langObject;
    if (_nowlang_ === "zh-CN") {
        langObject = zh_cn;
        showNotification("语言已切换至中文", "info");
    } else if (_nowlang_ === "ja-JP") {
        langObject = typeof ja_jp !== 'undefined' ? ja_jp : null;
        if (!langObject) {
            console.error("日语语言数据未加载");
            showNotification("日语语言数据未加载", "error");
            return;
        };
        showNotification("语言已切换至日语", "info");

    } else if (_nowlang_ === "en-US") {
        langObject = typeof en_us !== 'undefined' ? en_us : null;
        if (!langObject) {
            console.error("英语语言数据未加载");
            showNotification("英语语言数据未加载", "error");
            return;
        }
        showNotification("语言已切换至英语", "info");
    } else {
        langObject = zh_cn;
        console.error("未知语言或语言数据未加载: " + _nowlang_);
        showNotification("未知语言或语言数据未加载: " + _nowlang_, "error");
    }

    if (langObject) {
        // 更新元素的 textContent
        const elementsToUpdate = [
            { id: 'title_a', key: 'title' },
            { id: 'title_b', key: 'title' },
            { id: 'home', key: 'home' },
            { id: 'cardlist', key: 'cardlist' },
            { id: 'infocontent', key: 'infocontent' },
            { id: 'infocontent1', key: 'infocontent1' },
            { id: 'setting', key: 'setting' },
            { id: 'theme', key: 'theme' },
            { id: 'light', key: 'light' },
            { id: 'dark', key: 'dark' },
            { id: 'themefsystem', key: 'themefsystem' }
        ];

        elementsToUpdate.forEach(item => {
            const element = document.getElementById(item.id);
            if (element && langObject && langObject[item.key]) { // 检查元素和键是否存在
                element.textContent = langObject[item.key];
            } else if (element) {
                console.warn(`语言键 "${item.key}" 在语言 "${_nowlang_}" 中未找到`);
                // 可选：如果缺少键，设置默认文本或清空内容
                // element.textContent = '';
            } else {
                console.warn(`未找到 ID 为 "${item.id}" 的元素`);
            }
        });
    }
};

// 导航栏
window.addEventListener('hashchange', onRouteChange);

function onRouteChange() {
    const hash = location.hash.replace('#', '') || 'home';
    // 获取所有作为页面的 main 元素
    const pages = document.querySelectorAll('main');
    let pageFound = false;

    pages.forEach(page => {
        if (page.id === hash) {
            // 根据当前的 _lang_ 选择正确的语言对象
            let currentLangObject;
            if (_lang_ === "zh-CN") {
                currentLangObject = zh_cn;
            } else if (_lang_ === "ja-JP") {
                currentLangObject = typeof ja_jp !== 'undefined' ? ja_jp : null;
            } else if (_lang_ === "en-US") {
                currentLangObject = typeof en_us !== 'undefined' ? en_us : null;
            } else {
                currentLangObject = zh_cn; // 默认
                console.error("未知语言或语言数据未加载: " + _lang_);
            }

            if (currentLangObject) {
                updatetitle(_lang_, page.id); // 使用当前语言和页面ID调用 updatetitle
            } else {
                console.error(`语言数据不可用于更新标题: ${_lang_}`);
                showNotification(`语言数据不可用于更新标题: ${_lang_}`, "error");
            }


            // 如果元素的 ID 与 hash 匹配，则显示该元素
            page.style.display = ''; // 或者您希望的显示方式
            pageFound = true;
        } else {
            // 否则，隐藏该元素
            page.style.display = 'none';
        }
    });

    // 检查是否找到了对应的页面
    if (!pageFound) { // 使用标志而不是重新查询 DOM
        pages.forEach(page => {
            if (page.id === '404') {
                // 为 404 页面标题选择正确的语言对象
                let currentLangObject;
                if (_lang_ === "zh-CN") {
                    currentLangObject = zh_cn;
                } else if (_lang_ === "ja-JP") {
                    currentLangObject = typeof ja_jp !== 'undefined' ? ja_jp : null;
                } else if (_lang_ === "en-US") {
                    currentLangObject = typeof en_us !== 'undefined' ? en_us : null;
                } else {
                    currentLangObject = zh_cn; // 默认
                    console.error("未知语言或语言数据未加载: " + _lang_);
                }

                if (currentLangObject) {
                    updatetitle(_lang_, '404'); // 更新 404 页面标题
                } else {
                    console.error(`语言数据不可用于更新 404 标题: ${_lang_}`);
                }

                page.style.display = '';
            } else {
                page.style.display = 'none';
            }
        })
        console.error('页面未找到:', hash);
        // 您可以在这里添加逻辑来处理页面未找到的情况，
        // 例如显示一个 404 页面或者重定向到首页
        // 例如: location.hash = '#home';
    }
};

// 返回函数，返回pageid
// 使用 for...of 循环的修正实现
function get_page_id() {
    const hash = location.hash.replace('#', '') || 'home';
    const pages = document.querySelectorAll('main');
    for (const page of pages) { // 使用 for...of 循环
        if (page.id === hash) {
            return page.id; // 正确返回 ID 并退出函数
        }
    }
    console.error("无法获取id");
    return "Not Found";
}

// 获取预设数据
async function fetchPresetData() {
    if (presetDataCache) {
        return presetDataCache;
    }
    showLoadingIndicator(true);
    try {
        const response = await fetch('https://sce_data.apicloud.ip-ddns.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        presetDataCache = data;
        return data;
    } catch (error) {
        console.error('Error fetching preset data:', error);
        showNotification(i18n.errorFetchingPresets || '获取预设数据失败', 'error');
        return null;
    } finally {
        showLoadingIndicator(false);
    }
}


// 获取搜索输入框和表格元素
const searchInput = document.getElementById('search-input');
const cardTable = document.getElementById('CardSelectTr'); // 获取表格元素

// 监听搜索输入框的输入事件
searchInput.addEventListener('input', function() {
    const searchText = this.value.toLowerCase(); // 获取搜索文本并转换为小写
    const rows = cardTable.querySelectorAll('tbody tr'); // 获取所有表格行（排除表头）

    rows.forEach(row => {
        // 获取“卡名”和“中文名”列的文本内容
        const cardName = row.cells[1].textContent.toLowerCase(); // 假设卡名在第二列
        const chineseName = row.cells[2].textContent.toLowerCase(); // 假设中文名在第三列

        // 检查是否包含搜索文本
        if (cardName.includes(searchText) || chineseName.includes(searchText)) {
            row.style.display = ''; // 显示匹配的行
        } else {
            row.style.display = 'none'; // 隐藏不匹配的行
        }
    });
});

// 获取主题选择的单选按钮元素
const themeRadios = document.querySelectorAll('input[name="theme"]');

// 应用主题的函数
function applyTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark'); // 保存暗色模式设置
    } else if (theme === 'light') {
        showNotification('亮色模式暂时不可用，已强制切换为暗色模式', 'error');
        body.classList.remove('light-mode'); // 强制切换为暗色模式
        document.getElementById('dark').checked = true; // 选中暗色模式单选按钮
        localStorage.setItem('theme', 'dark'); // 保存暗色模式设置
    } else if (theme === 'system') {
        // 根据系统偏好设置应用主题
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
             showNotification('亮色模式暂时不可用，已强制切换为暗色模式', 'error');
             body.classList.remove('light-mode'); // 强制切换为暗色模式
             document.getElementById('dark').checked = true; // 选中暗色模式单选按钮
             localStorage.setItem('theme', 'dark'); // 保存暗色模式设置
        } else {
            body.classList.remove('light-mode'); // 系统是暗色模式，应用暗色模式
            localStorage.setItem('theme', 'system'); // 保存跟随系统设置
        }
    }
}

// 页面加载时应用保存的主题或系统主题
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== 'light') { // 如果有保存的主题且不是亮色模式
        applyTheme(savedTheme);
        // 更新单选按钮的选中状态
        themeRadios.forEach(radio => {
            if (radio.value === savedTheme) {
                radio.checked = true;
            }
        });
    } else { // 如果没有保存的主题或保存的是亮色模式
        applyTheme('system'); // 默认应用系统主题（会触发强制暗色逻辑如果系统是亮色）
    }

    // 监听系统主题偏好设置的变化
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        // 如果当前主题设置为“跟随系统”，则更新主题
        if (document.getElementById('themefsystem').checked) {
            if (e.matches) {
                 showNotification('亮色模式暂时不可用，已强制切换为暗色模式', 'error');
                 document.body.classList.remove('light-mode'); // 强制切换为暗色模式
                 document.getElementById('dark').checked = true; // 选中暗色模式单选按钮
                 localStorage.setItem('theme', 'dark'); // 保存暗色模式设置
            } else {
                document.body.classList.remove('light-mode'); // 系统是暗色模式，应用暗色模式
                localStorage.setItem('theme', 'system'); // 保存跟随系统设置
            }
        }
    });
});


// 监听主题选择单选按钮的变化
themeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        const selectedTheme = this.value;
        applyTheme(selectedTheme);
    });
});
