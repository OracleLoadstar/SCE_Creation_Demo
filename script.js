// 变量定义
const serverselector = document.getElementById('server');
const servervaule = document.getElementById('server').textContent;
const rememberTabCheckbox = document.getElementById('remember-tab');
var jpserver=true;
// 页面加载时检查本地存储
window.addEventListener('load', () => {
    const rememberTab = localStorage.getItem('rememberTab');
    if (rememberTab === 'true') {
        rememberTabCheckbox.checked = true;
        // TODO: Add logic to open the last remembered tab
    }
});

// 监听复选框的变化
rememberTabCheckbox.addEventListener('change', () => {
    if (rememberTabCheckbox.checked) {
        localStorage.setItem('rememberTab', 'true');
    } else {
        localStorage.removeItem('rememberTab');
    }
});

// 监听服务器变化
serverselector.addEventListener('change', () =>{
    if (servervaule == "JP"){
        jpserver=true;
    }
});

function update_text(){
    if
};