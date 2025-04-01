// 应用管理相关功能
const lastUpdateEl = document.getElementById('last-update');
const cacheSizeEl = document.getElementById('cache-size');
const checkUpdateBtn = document.getElementById('check-update');
const clearDataBtn = document.getElementById('clear-data');
const exportDataBtn = document.getElementById('export-data');

// 更新缓存信息
async function updateCacheInfo() {
    try {
        // 获取最后更新时间
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            const lastUpdateTime = localStorage.getItem('lastUpdateTime') || new Date().toISOString();
            const date = new Date(lastUpdateTime);
            lastUpdateEl.textContent = date.toLocaleString();
        }

        // 获取缓存大小
        const cache = await caches.open('sce-cache-v1');
        const keys = await cache.keys();
        let totalSize = 0;

        for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }

        // 转换为合适的单位
        let size = totalSize;
        let unit = 'B';
        if (size > 1024) {
            size = size / 1024;
            unit = 'KB';
        }
        if (size > 1024) {
            size = size / 1024;
            unit = 'MB';
        }
        cacheSizeEl.textContent = `${size.toFixed(2)} ${unit}`;
    } catch (err) {
        console.error('Error updating cache info:', err);
    }
}

// 检查更新
checkUpdateBtn.addEventListener('click', async () => {
    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            await registration.update();
            localStorage.setItem('lastUpdateTime', new Date().toISOString());
            await updateCacheInfo();
            showNotification('应用已更新到最新版本', 'info');
        }
    } catch (err) {
        showNotification('检查更新失败', 'error');
    }
});

// 清除数据
clearDataBtn.addEventListener('click', async () => {
    try {
        // 清除所有缓存
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
        
        // 清除本地存储
        localStorage.clear();
        
        await updateCacheInfo();
        showNotification('数据已清除', 'info');
        
        // 重新加载页面以重新初始化
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (err) {
        showNotification('清除数据失败', 'error');
    }
});

// 导出数据
exportDataBtn.addEventListener('click', async () => {
    try {
        const data = {
            timestamp: new Date().toISOString(),
            localStorage: {},
            formData: getFormData()
        };

        // 收集本地存储数据
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data.localStorage[key] = localStorage.getItem(key);
        }

        // 创建下载
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sce-backup-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('数据导出成功', 'info');
    } catch (err) {
        showNotification('数据导出失败', 'error');
    }
});

// 获取表单数据
function getFormData() {
    return {
        card_name: document.getElementById('card_name').value,
        type_static: document.getElementById('type_static').value,
        friendship_award: document.getElementById('friendship_award').value,
        enthusiasm_award: document.getElementById('enthusiasm_award').value,
        training_award: document.getElementById('training_award').value,
        strike_point: document.getElementById('strike_point').value,
        friendship_point: document.getElementById('friendship_point').value,
        speed_bonus: document.getElementById('speed_bonus').value,
        stamina_bonus: document.getElementById('stamina_bonus').value,
        power_bonus: document.getElementById('power_bonus').value,
        willpower_bonus: document.getElementById('willpower_bonus').value,
        wit_bonus: document.getElementById('wit_bonus').value,
        sp_bonus: document.getElementById('sp_bonus').value,
        enable_enum: document.getElementById('enable_enum').checked,
        enum_friendship_award: document.getElementById('enum_friendship_award').value,
        enum_enthusiasm_award: document.getElementById('enum_enthusiasm_award').value,
        enum_training_award: document.getElementById('enum_training_award').value,
        enum_friendship_point: document.getElementById('enum_friendship_point').value,
        enum_strike_point: document.getElementById('enum_strike_point').value,
        enum_speed_bonus: document.getElementById('enum_speed_bonus').value,
        enum_stamina_bonus: document.getElementById('enum_stamina_bonus').value,
        enum_power_bonus: document.getElementById('enum_power_bonus').value,
        enum_willpower_bonus: document.getElementById('enum_willpower_bonus').value,
        enum_wit_bonus: document.getElementById('enum_wit_bonus').value,
        enum_sp_bonus: document.getElementById('enum_sp_bonus').value
    };
}

// 初始化应用管理
document.addEventListener('DOMContentLoaded', async () => {
    // ...existing code...
    
    // 初始化缓存信息
    await updateCacheInfo();
    
    // 每分钟更新一次缓存信息
    setInterval(updateCacheInfo, 60000);
});