// url2png.js - URL 转二维码功能和分享弹窗

/**
 * 生成 QR 码并返回 Base64 格式的图像数据。
 * @param {string} url 要转换为 QR 码的 URL。
 * @param {number} size QR 码图像的尺寸（像素），默认为 256。
 * @returns {Promise<string>} 包含 Base64 图像数据的 Promise。
 */
async function generateQRCode(url, size = 256) {
    return new Promise((resolve, reject) => {
        try {
            // qrcode.js 会直接操作 DOM，我们创建一个临时 div 容器
            const tempDiv = document.createElement('div');
            tempDiv.style.display = 'none'; // 隐藏这个临时 div
            document.body.appendChild(tempDiv); // 附加到 DOM 以便 qrcode.js 操作

            if (typeof QRCode === 'undefined') {
                reject(new Error("QRCode library not found. 请确保在HTML中引入 qrcode.js。"));
                return;
            }

            // 使用 qrcode.js 生成二维码
            const qr = new QRCode(tempDiv, {
                text: url,
                width: size,
                height: size,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });

            // qrcode.js 默认会生成 canvas 或 table。
            // 延迟获取 Base64，确保 qrcode.js 完成渲染
            // qrcode.js v1.0.0 版本的 QRCode 对象没有直接提供获取 canvas 或 dataURL 的方法
            // 它通常会将 canvas 或 table 元素作为其第一个参数（DOM 元素）的子元素添加。
            // 所以我们需要在下一个事件循环周期中去查找它生成的 canvas。
            setTimeout(() => {
                const qrCanvas = tempDiv.querySelector('canvas');
                if (qrCanvas) {
                    const dataURL = qrCanvas.toDataURL('image/png');
                    document.body.removeChild(tempDiv); // 移除临时 div
                    resolve(dataURL);
                } else {
                    document.body.removeChild(tempDiv); // 移除临时 div
                    reject(new Error("Failed to generate QR Code canvas. qrcode.js might have generated a table."));
                }
            }, 50); // 短暂延迟，确保渲染完成

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 显示包含 QR 码和分享选项的弹窗。
 * @param {string} url 原始 URL。
 * @param {string} qrCodeDataUrl QR 码的 Base64 图像数据。
 */
function showShareModal(url, qrCodeDataUrl) {
    const modal = document.getElementById('shareModal');
    const qrCodeImageElement = document.getElementById('qrCodeImageInModal');
    const shareUrlInput = document.getElementById('shareUrlInput');
    const copyUrlBtn = document.getElementById('copyShareUrlBtn');
    const downloadQrBtn = document.getElementById('downloadQrBtn');
    const closeModalBtn = document.getElementById('closeShareModalBtn');

    if (!modal || !qrCodeImageElement || !shareUrlInput || !copyUrlBtn || !downloadQrBtn || !closeModalBtn) {
        console.error('分享弹窗所需的HTML元素未找到。');
        alert('分享功能初始化失败，请检查HTML结构。');
        return;
    }

    qrCodeImageElement.src = qrCodeDataUrl;
    shareUrlInput.value = url;

    // 清除之前的事件监听器，避免重复绑定
    const newCopyUrlBtn = copyUrlBtn.cloneNode(true);
    copyUrlBtn.parentNode.replaceChild(newCopyUrlBtn, copyUrlBtn);
    const newDownloadQrBtn = downloadQrBtn.cloneNode(true);
    downloadQrBtn.parentNode.replaceChild(newDownloadQrBtn, downloadQrBtn);
    const newCloseModalBtn = closeModalBtn.cloneNode(true);
    closeModalBtn.parentNode.replaceChild(newCloseModalBtn, closeModalBtn);

    // 复制 URL
    newCopyUrlBtn.addEventListener('click', () => {
        shareUrlInput.select();
        document.execCommand('copy');
        alert('链接已复制到剪贴板！');
    });

    // 下载 QR 码图片
    newDownloadQrBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = qrCodeDataUrl;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 关闭弹窗
    newCloseModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 点击弹窗外部关闭
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    modal.style.display = 'block'; // 显示弹窗
}

/**
 * 主要处理函数：将 URL 转换为 QR 码并显示分享弹窗。
 * @param {string} url 要转换的 URL。
 * @param {number} size QR 码图像的尺寸（像素）。
 */
async function convertUrlToQrAndShowShare(url, size = 256) {
    try {
        // 假设这里有一个加载指示器函数
        // showLoadingIndicator(true); // 如果有，显示加载中

        const qrCodeDataUrl = await generateQRCode(url, size);
        showShareModal(url, qrCodeDataUrl);

        // hideLoadingIndicator(false); // 如果有，隐藏加载中
    } catch (error) {
        console.error('转换或显示二维码失败:', error);
        alert('生成二维码失败: ' + error.message);
        // hideLoadingIndicator(false); // 如果有，隐藏加载中
    }
}

// 示例用法（假设在HTML中有一个输入框、一个按钮，并且HTML中已包含modal结构）
/*
document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput'); // 假设有一个ID为urlInput的输入框
    const convertAndShareBtn = document.getElementById('convertAndShareBtn'); // 假设有一个ID为convertAndShareBtn的按钮

    if (convertAndShareBtn && urlInput) {
        convertAndShareBtn.addEventListener('click', async () => {
            const url = urlInput.value;
            if (url) {
                await convertUrlToQrAndShowShare(url, 256); // 默认尺寸256
            } else {
                alert('请输入一个URL！');
            }
        });
    }
});
*/