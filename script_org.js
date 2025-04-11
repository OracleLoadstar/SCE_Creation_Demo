
// UmaSCE 算法实现
// 移除所有导入，使用 window 对象

// GNU 协议对话框显示状态
let isGnuv3DialogShown = false;

class UmaSCE_Main {
    constructor() {
        // 初始化属性
        this.type_static = 0;
        // Removed friendship_static initialization
        this.friendship_award = 0;
        this.enthusiasm_award = 0;
        this.training_award = 0;
        this.strike_point = 0;
        this.friendship_point = 0;
        this.speed_bonus = 0;
        this.stamina_bonus = 0;
        this.power_bonus = 0;
        this.willpower_bonus = 0;
        this.wit_bonus = 0;
        this.sp_bonus = 0;

        this.v1_ept = 0;
        this.v2_ept = 0;
        this.v3_ept = 0;
        this.v4main_ept = 0;
        this.v4fold_ept = 0;
        this.v4sp_ept = 0;

        this.unstrike_v1_ept = 0;
        this.is_notice = true;
    }

    // 从表单获取参数
    getParamsFromForm() {
        // 首先获取非枚举输入
        this.type_static = parseInt(document.getElementById('type_static').value);
        // Removed friendship_static since it's commented out in HTML
        this.friendship_award = parseInt(document.getElementById('friendship_award').value);
        this.enthusiasm_award = parseInt(document.getElementById('enthusiasm_award').value);
        this.training_award = parseInt(document.getElementById('training_award').value);
        this.strike_point = parseInt(document.getElementById('strike_point').value);
        this.friendship_point = parseInt(document.getElementById('friendship_point').value);
        this.speed_bonus = parseInt(document.getElementById('speed_bonus').value);
        this.stamina_bonus = parseInt(document.getElementById('stamina_bonus').value);
        this.power_bonus = parseInt(document.getElementById('power_bonus').value);
        this.willpower_bonus = parseInt(document.getElementById('willpower_bonus').value);
        this.wit_bonus = parseInt(document.getElementById('wit_bonus').value);
        this.sp_bonus = parseInt(document.getElementById('sp_bonus').value);

        // 如果启用了枚举拓展，将枚举值叠加到对应的非枚举值上
        if (document.getElementById('enable_enum').checked) {
            // 获取枚举值
            const enumValues = {
                friendship_award: parseInt(document.getElementById('enum_friendship_award').value || 0),
                enthusiasm_award: parseInt(document.getElementById('enum_enthusiasm_award').value || 0),
                training_award: parseInt(document.getElementById('enum_training_award').value || 0),
                friendship_point: parseInt(document.getElementById('enum_friendship_point').value || 0),
                strike_point: parseInt(document.getElementById('enum_strike_point').value || 0),
                speed_bonus: parseInt(document.getElementById('enum_speed_bonus').value || 0),
                stamina_bonus: parseInt(document.getElementById('enum_stamina_bonus').value || 0),
                power_bonus: parseInt(document.getElementById('enum_power_bonus').value || 0),
                willpower_bonus: parseInt(document.getElementById('enum_willpower_bonus').value || 0),
                wit_bonus: parseInt(document.getElementById('enum_wit_bonus').value || 0),
                sp_bonus: parseInt(document.getElementById('enum_sp_bonus').value || 0)
            };
            
            // 其他枚举值叠加到对应的非枚举值上
            this.enthusiasm_award += enumValues.enthusiasm_award;
            this.training_award += enumValues.training_award;
            this.strike_point += enumValues.strike_point;
            this.friendship_point += enumValues.friendship_point;
            this.speed_bonus += enumValues.speed_bonus;
            this.stamina_bonus += enumValues.stamina_bonus;
            this.power_bonus += enumValues.power_bonus;
            this.willpower_bonus += enumValues.willpower_bonus;
            this.wit_bonus += enumValues.wit_bonus;
            this.sp_bonus += enumValues.sp_bonus;
        }
    }

    // V1 算法实现
    evalV1() {
        this.v1_ept = (this.friendship_award * 0.01 + 1) *
            (this.enthusiasm_award * 0.002 + 1) *
            (this.training_award * 0.01 + 1);

        this.unstrike_v1_ept = (this.enthusiasm_award * 0.002 + 1) *
            (this.training_award * 0.01 + 1);

        return this.v1_ept;
    }

    // V2 算法实现
    evalV2() {
        let v2_bonus = 0;

        switch (this.type_static) {
            case 0: v2_bonus = this.speed_bonus; break;
            case 1: v2_bonus = this.stamina_bonus; break;
            case 2: v2_bonus = this.power_bonus; break;
            case 3: v2_bonus = this.willpower_bonus; break;
            case 4: v2_bonus = this.wit_bonus; break;
            default:
                if (this.is_notice) {
                    throw new Error(i18n.evalV2InvalidType);
                }
        }

        this.evalV1();
        this.v2_ept = this.v1_ept + 0.1 * this.v1_ept * v2_bonus;

        return this.v2_ept;
    }

    // V3 算法实现
    evalV3() {
        let v3_bonus = 0;

        switch (this.type_static) {
            case 0: v3_bonus = this.speed_bonus; break;
            case 1: v3_bonus = this.stamina_bonus; break;
            case 2: v3_bonus = this.power_bonus; break;
            case 3: v3_bonus = this.willpower_bonus; break;
            case 4: v3_bonus = this.wit_bonus; break;
            default:
                if (this.is_notice) {
                    throw new Error(i18n.evalV3InvalidType);
                }
        }

        this.evalV2();
        const strike_rate = (this.strike_point + 100) / (this.strike_point + 550);
        const unstrike_rate = 100 / (this.strike_point + 550);
        const strike_v2_ept = this.v1_ept + 0.1 * this.v1_ept * v3_bonus;
        const unstrike_v2_ept = this.unstrike_v1_ept + 0.1 * this.unstrike_v1_ept * v3_bonus;

        this.v3_ept = ((strike_rate * strike_v2_ept + (unstrike_rate * unstrike_v2_ept) * 4) - 0.909) * 10000;

        return this.v3_ept;
    }

    // V4 算法实现
    evalV4() {
        this.evalV2();
        const unstrike_v2_ept = this.unstrike_v1_ept + 0.1 * this.unstrike_v1_ept * this.sp_bonus;
        const strike_rate = (this.strike_point + 100) / (this.strike_point + 550);
        const unstrike_rate = 100 / (this.strike_point + 550);
        const failure_rate = ((80 - this.friendship_point) / 5) / 72;
        const failure_strike_rate = failure_rate * strike_rate;
        const success_strike_rate = strike_rate - failure_strike_rate;
        const failure_unstrike_rate = failure_rate * unstrike_rate;
        const success_unstrike_rate = unstrike_rate - failure_unstrike_rate;

        this.v4main_ept = Math.floor(((this.v2_ept * success_strike_rate) + (unstrike_v2_ept * failure_strike_rate) - strike_rate) * 10000);

        this.v4sp_ept = Math.floor(((failure_strike_rate + failure_unstrike_rate) *
            (this.unstrike_v1_ept + 0.1 * this.unstrike_v1_ept * this.sp_bonus) +
            (success_strike_rate + success_unstrike_rate) *
            (this.v1_ept + 0.1 * this.v1_ept * this.sp_bonus) - 
            (strike_rate + unstrike_rate)) * 10000);

        switch (this.type_static) {
            case 0:
                this.v4fold_ept = Math.floor(((unstrike_rate * (4 * this.unstrike_v1_ept +
                    0.1 * this.unstrike_v1_ept *
                    (this.stamina_bonus + this.power_bonus + this.willpower_bonus + this.wit_bonus)) -
                    4 * unstrike_rate) * 10000));
                break;
            case 1:
                this.v4fold_ept = Math.floor(((unstrike_rate * (4 * this.unstrike_v1_ept +
                    0.1 * this.unstrike_v1_ept *
                    (this.speed_bonus + this.power_bonus + this.willpower_bonus + this.wit_bonus)) -
                    4 * unstrike_rate) * 10000));
                break;
            case 2:
                this.v4fold_ept = Math.floor(((unstrike_rate * (4 * this.unstrike_v1_ept +
                    0.1 * this.unstrike_v1_ept *
                    (this.speed_bonus + this.stamina_bonus + this.willpower_bonus + this.wit_bonus)) -
                    4 * unstrike_rate) * 10000));
                break;
            case 3:
                this.v4fold_ept = Math.floor(((unstrike_rate * (4 * this.unstrike_v1_ept +
                    0.1 * this.unstrike_v1_ept *
                    (this.speed_bonus + this.stamina_bonus + this.power_bonus + this.wit_bonus)) -
                    4 * unstrike_rate) * 10000));
                break;
            case 4:
                this.v4fold_ept = Math.floor((unstrike_rate * (4 * this.unstrike_v1_ept +
                    0.1 * this.unstrike_v1_ept *
                    (this.speed_bonus + this.stamina_bonus + this.power_bonus + this.willpower_bonus)) -
                    4 * unstrike_rate) * 10000);
                break;
            default:
                if (this.is_notice) {
                    throw new Error(i18n.evalV4InvalidType);
                }
        }

        return {
            v4main_ept: this.v4main_ept,
            v4fold_ept: this.v4fold_ept,
            v4sp_ept: this.v4sp_ept
        };
    }

    // V5 算法实现（实验性）
    evalV5() {
        // 使用 window 对象访问 V5 计算器
        const v5calc = new window.UmaV5Calculator(); // Use window object
        const result = v5calc.calculate(this);
        this.v5main_ept = result.v5main_ept;
        this.v5fold_ept = result.v5fold_ept;
        this.v5sp_ept = result.v5sp_ept;
        return {
            v5main_ept: this.v5main_ept,
            v5fold_ept: this.v5fold_ept,
            v5sp_ept: this.v5sp_ept
        };
    }
}

// 获取系统语言并匹配支持的语言
function getSystemLanguage() {
    const userLanguage = navigator.language.toLowerCase();
    const supportedLanguages = Object.keys(languages);
    
    // 完全匹配
    if (supportedLanguages.includes(userLanguage)) {
        return userLanguage;
    }
    
    // 从语言代码匹配（例如 'zh-cn' 匹配 'zh'）
    const languageCode = userLanguage.split('-')[0];
    if (supportedLanguages.includes(languageCode)) {
        return languageCode;
    }
    
    // 默认返回英语
    return 'en';
}

// 初始化默认语言为系统语言
let currentLanguage = getSystemLanguage();

// 切换语言的函数
function switchLanguage(lang) {
    currentLanguage = lang;
    i18n = languages[lang];
    updateText();
}

// 国际化对象
let i18n = languages[currentLanguage];

// 修改 updateText 函数，确保语言切换按钮的图标正确更新
function updateText() {
    try {
        // 更新标题和 header
        document.title = i18n.title;
        const header = document.querySelector('.header-left h1');
        if (header) header.textContent = i18n.title;

        // 更新语言切换按钮（只显示图标）
        const langBtn = document.getElementById('language-toggle');
        if (langBtn) {
            langBtn.innerHTML = '<span class="material-icons">translate</span>';
        }

        // 更新贡献者卡片
        const contributorsTitle = document.querySelector('.contributors-title');
        if (contributorsTitle) {
            contributorsTitle.textContent = i18n.contributors;
        }

        // 更新所有文本内容
        const elements = {
            '.card-header h2': i18n.parameterSettings,
            '.calculation-results-title': i18n.calculationResults, // 添加计算结果标题
            'label[for="type_static"]': `${i18n.type}`,
            'label[for="friendship_static"]': `${i18n.friendshipStatic}`,
            'label[for="friendship_award"]': `${i18n.friendshipAward}`,
            'label[for="enthusiasm_award"]': `${i18n.enthusiasmAward}`,
            'label[for="training_award"]': `${i18n.trainingAward}`,
            'label[for="strike_point"]': `${i18n.strikePoint}`,
            'label[for="friendship_point"]': `${i18n.friendshipPoint}`,
            'label[for="speed_bonus"]': `${i18n.speedBonus}`,
            'label[for="stamina_bonus"]': `${i18n.staminaBonus}`,
            'label[for="power_bonus"]': `${i18n.powerBonus}`,
            'label[for="willpower_bonus"]': `${i18n.willpowerBonus}`,
            'label[for="wit_bonus"]': `${i18n.witBonus}`,
            'label[for="sp_bonus"]': `${i18n.spBonus}`,
            '#calculate-v1': i18n.calculateV1,
            '#calculate-v2': i18n.calculateV2,
            '#calculate-v3': i18n.calculateV3,
            '#calculate-v4': i18n.calculateV4,
            '#calculate-all': i18n.calculateAll,
            '.result-label.v1-label': `${i18n.v1Value}`,
            '.result-label.v2-label': `${i18n.v2Value}`,
            '.result-label.v3-label': `${i18n.v3Value}`,
            '.result-label.v4main-label': `${i18n.v4MainValue}😘`,
            '.result-label.v4fold-label': `${i18n.v4FoldValue}`,
            '.result-label.v4sp-label': `${i18n.v4SpValue}`,
            '.contributors-card .card-header h2': i18n.contributors // 添加贡献者卡片标题
        };

        for (const [selector, text] of Object.entries(elements)) {
            const element = document.querySelector(selector);
            if (element) element.textContent = text;
        }

        // 更新类型选项
        const typeSelect = document.getElementById('type_static');
        if (typeSelect) {
            const options = typeSelect.options;
            const typeTexts = [
                i18n.typeOptions.speed,
                i18n.typeOptions.stamina,
                i18n.typeOptions.power,
                i18n.typeOptions.willpower,
                i18n.typeOptions.wit
            ];
            typeTexts.forEach((text, index) => {
                if (options[index]) options[index].textContent = `${text} (${index})`;
            });
        }

        if (document.querySelector('.switch-label')) {
            document.querySelector('.switch-label').textContent = i18n.enableEnumExtension || '启用枚举拓展';
        }
        if (document.querySelector('#enum_card .card-header h2')) {
            document.querySelector('#enum_card .card-header h2').textContent = i18n.enumValues || 'Enum Values';
        }

        // 更新枚举输入框标签
        const enumLabels = document.querySelectorAll('[data-i18n^="enumLabels."]');
        enumLabels.forEach(label => {
            const key = label.getAttribute('data-i18n').split('.')[1];
            if (i18n.enumLabels && i18n.enumLabels[key]) {
                label.textContent = i18n.enumLabels[key];
            }
        });

        // 更新应用管理卡片文本
        // document.querySelector('.app-management-title').textContent = i18n.appManagement.title;
        // document.querySelector('#installApp .button-text').textContent = i18n.appManagement.install;
        // document.querySelector('#updateApp .button-text').textContent = i18n.appManagement.update;
        document.querySelector('#clearCache .button-text').textContent = i18n.appManagement.clearCache;
    } catch (error) {
        console.error('Error updating text:', error);
    }
}

// Initialize after page load
document.addEventListener('DOMContentLoaded', () => {
    // 确保语言文件已加载
    if (typeof languages === 'undefined') {
        console.error('Language file not loaded');
        return;
    }

    // 初始化语言
    currentLanguage = getSystemLanguage();
    i18n = languages[currentLanguage];
    

    // --- Service Worker 更新处理逻辑 ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'SW_UPDATED') {
                console.log('Received SW_UPDATED message from Service Worker.');
                // 显示更新通知
                showNotification(i18n.appUpdated || '应用已更新，将清除本地数据并刷新页面...', 'warning');

                // 延迟执行清理和刷新，给用户一点时间看到通知
                setTimeout(() => {
                    try {
                        console.log('Clearing localStorage due to update...');
                        localStorage.clear(); // 清除所有本地存储数据
                        console.log('localStorage cleared.');

                        console.log('Forcing page reload...');
                        location.reload(true); // 强制刷新页面
                    } catch (error) {
                        console.error('Error during update cleanup and reload:', error);
                        // 如果清理或刷新失败，尝试备用刷新
                        location.reload();
                    }
                }, 3000); // 延迟3秒执行
            }
        });

        // 初始注册 Service Worker (如果还没有注册逻辑的话)
        // 注意：如果已有注册逻辑，请确保此监听器在其之前或之后添加，只要能运行即可
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
                // 可以添加检查更新的逻辑，例如 registration.update();
            }).catch(error => {
                console.error('Service Worker registration failed:', error);
            });

    }
    // --- Service Worker 更新处理逻辑结束 ---


    // 加载动画相关代码
    const minLoadTime = 2000;
    const startTime = Date.now();
    
    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);

        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, remainingTime);

        // 更新页面文本
        updateText();
        
        // 显示GNU协议对话框（只在这里调用一次）
        showGnuv3Dialog();
    });

    // 绑定语言切换事件
    const langToggle = document.getElementById('language-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
            switchLanguage(newLanguage);
        });
    }

    // Show GNUv3 dialog
    showGnuv3Dialog();

    const umaSCE = new UmaSCE_Main();

    // Get result display elements
    const v1Result = document.getElementById('v1-result');
    const v2Result = document.getElementById('v2-result');
    const v3Result = document.getElementById('v3-result');
    const v4MainResult = document.getElementById('v4main-result');
    const v4FoldResult = document.getElementById('v4fold-result');
    const v4SpResult = document.getElementById('v4sp-result');
    /* ɾ��V5��ر���
    const v5MainResult = document.getElementById('v5main-result');
    const v5FoldResult = document.getElementById('v5fold-result');
    const v5SpResult = document.getElementById('v5sp-result');
    */

    // 添加参数验证函数
    function validateInputs() {
        const inputs = [
            { id: 'type_static', name: i18n.type },
            { id: 'friendship_award', name: i18n.friendshipAward },
            { id: 'enthusiasm_award', name: i18n.enthusiasmAward },
            { id: 'training_award', name: i18n.trainingAward },
            { id: 'strike_point', name: i18n.strikePoint },
            { id: 'friendship_point', name: i18n.friendshipPoint },
            { id: 'speed_bonus', name: i18n.speedBonus },
            { id: 'stamina_bonus', name: i18n.staminaBonus },
            { id: 'power_bonus', name: i18n.powerBonus },
            { id: 'willpower_bonus', name: i18n.willpowerBonus },
            { id: 'wit_bonus', name: i18n.witBonus },
            { id: 'sp_bonus', name: i18n.spBonus }
        ];

        // 验证基本输入框
        for (const input of inputs) {
            const element = document.getElementById(input.id);
            const value = element.value.trim();
            if (value === '') {
                showNotification(`${input.name}${i18n.cannotBeEmpty}`, 'error');
                element.focus();
                return false;
            }
            
            // 对数字输入框进行验证
            if (input.id !== 'type_static') {
                const numValue = Number(value);
                if (isNaN(numValue)) {
                    showNotification(`${input.name}${i18n.mustBeValidNumber}`, 'error');
                    element.focus();
                    return false;
                }
            }
        }

        // 如果启用了枚举拓展，验证枚举输入框
        if (document.getElementById('enable_enum').checked) {
            const enumInputs = [
                { id: 'enum_friendship_award', name: i18n.enumLabels.friendshipAward },
                { id: 'enum_enthusiasm_award', name: i18n.enumLabels.enthusiasmAward },
                { id: 'enum_training_award', name: i18n.enumLabels.trainingAward },
                { id: 'enum_friendship_point', name: i18n.enumLabels.friendshipPoint },
                { id: 'enum_strike_point', name: i18n.enumLabels.strikePoint },
                { id: 'enum_speed_bonus', name: i18n.enumLabels.speedBonus },
                { id: 'enum_stamina_bonus', name: i18n.enumLabels.staminaBonus },
                { id: 'enum_power_bonus', name: i18n.enumLabels.powerBonus },
                { id: 'enum_willpower_bonus', name: i18n.enumLabels.willpowerBonus },
                { id: 'enum_wit_bonus', name: i18n.enumLabels.witBonus },
                { id: 'enum_sp_bonus', name: i18n.enumLabels.spBonus }
            ];

            for (const input of enumInputs) {
                const element = document.getElementById(input.id);
                const value = element.value.trim();
                if (value === '') {
                    showNotification(`${input.name}${i18n.cannotBeEmpty}`, 'error');
                    element.focus();
                    return false;
                }
                
                const numValue = Number(value);
                if (isNaN(numValue)) {
                    showNotification(`${input.name}${i18n.mustBeValidNumber}`, 'error');
                    element.focus();
                    return false;
                }
            }
        }

        return true;
    }

    // 修改计算按钮的事件处理函数，添加验证
    document.getElementById('calculate-v1').addEventListener('click', () => {
        if (!validateInputs()) return;
        try {
            umaSCE.getParamsFromForm();
            const v1 = umaSCE.evalV1();
            v1Result.textContent = v1.toFixed(4);
        } catch (error) {
            showNotification(i18n.errorCalculatingV1 + ': ' + error.message, 'error');
        }
    });

    document.getElementById('calculate-v2').addEventListener('click', () => {
        if (!validateInputs()) return;
        try {
            umaSCE.getParamsFromForm();
            const v2 = umaSCE.evalV2();
            v2Result.textContent = v2.toFixed(4);
        } catch (error) {
            showNotification(i18n.errorCalculatingV2 + ': ' + error.message, 'error');
        }
    });

    document.getElementById('calculate-v3').addEventListener('click', () => {
        if (!validateInputs()) return;
        try {
            umaSCE.getParamsFromForm();
            const v3 = umaSCE.evalV3();
            v3Result.textContent = v3.toFixed(4);
        } catch (error) {
            showNotification(i18n.errorCalculatingV3 + ': ' + error.message, 'error');
        }
    });

    document.getElementById('calculate-v4').addEventListener('click', () => {
        if (!validateInputs()) return;
        try {
            umaSCE.getParamsFromForm();
            const v4 = umaSCE.evalV4();
            v4MainResult.textContent = parseFloat(v4.v4main_ept).toFixed(4);
            v4FoldResult.textContent = parseFloat(v4.v4fold_ept).toFixed(4);
            v4SpResult.textContent = parseFloat(v4.v4sp_ept).toFixed(4);
        } catch (error) {
            showNotification(i18n.errorCalculatingV4 + ': ' + error.message, 'error');
        }
    });

    document.getElementById('calculate-all').addEventListener('click', () => {
        if (!validateInputs()) return;
        try {
            umaSCE.getParamsFromForm();

            const v1 = umaSCE.evalV1();
            v1Result.textContent = v1.toFixed(4);

            const v2 = umaSCE.evalV2();
            v2Result.textContent = v2.toFixed(4);

            const v3 = umaSCE.evalV3();
            v3Result.textContent = v3.toFixed(4);

            const v4 = umaSCE.evalV4();
            v4MainResult.textContent = parseFloat(v4.v4main_ept).toFixed(4);
            v4FoldResult.textContent = parseFloat(v4.v4fold_ept).toFixed(4);
            v4SpResult.textContent = parseFloat(v4.v4sp_ept).toFixed(4);

            // 注释掉V5计算
            /*
            const v5 = umaSCE.evalV5();
            v5MainResult.textContent = v5.v5main_ept;
            v5FoldResult.textContent = v5.v5fold_ept;
            v5SpResult.textContent = v5.v5sp_ept;
            */
        } catch (error) {
            showNotification('计算出错: ' + error.message, 'error');
        }
    });
    
    // Set default values
    document.getElementById('type_static').value = "0";
    // document.getElementById('friendship_static').value = "0";
    document.getElementById('friendship_award').value = "0";
    document.getElementById('enthusiasm_award').value = "0";
    document.getElementById('training_award').value = "0";
    document.getElementById('strike_point').value = "0";
    document.getElementById('friendship_point').value = "0";
    document.getElementById('speed_bonus').value = "0";
    document.getElementById('stamina_bonus').value = "0";
    document.getElementById('power_bonus').value = "0";
    document.getElementById('willpower_bonus').value = "0";
    document.getElementById('wit_bonus').value = "0";
    document.getElementById('sp_bonus').value = "0";

    // 回到顶部按钮功能
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 保存支援卡按钮功能
    document.getElementById('saveCard').addEventListener('click', () => {
        if (!validateInputs()) return;
        // 获取所有表单数据
        const formData = {
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
            // 添加枚举相关数据
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

        // 创建Blob对象
        const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // 创建下载链接并触发下载
        const a = document.createElement('a');
        a.href = url;
        a.download = 'support_card.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 上传支援卡按钮功能
    document.getElementById('uploadCard').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // 更新表单数据
                    document.getElementById('card_name').value = data.card_name || '';
                    document.getElementById('type_static').value = data.type_static;
                    document.getElementById('friendship_award').value = data.friendship_award;
                    document.getElementById('enthusiasm_award').value = data.enthusiasm_award;
                    document.getElementById('training_award').value = data.training_award;
                    document.getElementById('strike_point').value = data.strike_point;
                    document.getElementById('friendship_point').value = data.friendship_point;
                    document.getElementById('speed_bonus').value = data.speed_bonus;
                    document.getElementById('stamina_bonus').value = data.stamina_bonus;
                    document.getElementById('power_bonus').value = data.power_bonus;
                    document.getElementById('willpower_bonus').value = data.willpower_bonus;
                    document.getElementById('wit_bonus').value = data.wit_bonus;
                    document.getElementById('sp_bonus').value = data.sp_bonus;

                    // 处理枚举开关状态
                    const enumCheckbox = document.getElementById('enable_enum');
                    if (data.enable_enum !== undefined) {
                        enumCheckbox.checked = data.enable_enum;
                        // 触发change事件以显示/隐藏枚举卡片
                        const event = new Event('change');
                        enumCheckbox.dispatchEvent(event);
                    }

                    // 更新枚举值
                    if (data.enum_friendship_award !== undefined) document.getElementById('enum_friendship_award').value = data.enum_friendship_award;
                    if (data.enum_enthusiasm_award !== undefined) document.getElementById('enum_enthusiasm_award').value = data.enum_enthusiasm_award;
                    if (data.enum_training_award !== undefined) document.getElementById('enum_training_award').value = data.enum_training_award;
                    if (data.enum_friendship_point !== undefined) document.getElementById('enum_friendship_point').value = data.enum_friendship_point;
                    if (data.enum_strike_point !== undefined) document.getElementById('enum_strike_point').value = data.enum_strike_point;
                    if (data.enum_speed_bonus !== undefined) document.getElementById('enum_speed_bonus').value = data.enum_speed_bonus;
                    if (data.enum_stamina_bonus !== undefined) document.getElementById('enum_stamina_bonus').value = data.enum_stamina_bonus;
                    if (data.enum_power_bonus !== undefined) document.getElementById('enum_power_bonus').value = data.enum_power_bonus;
                    if (data.enum_willpower_bonus !== undefined) document.getElementById('enum_willpower_bonus').value = data.enum_willpower_bonus;
                    if (data.enum_wit_bonus !== undefined) document.getElementById('enum_wit_bonus').value = data.enum_wit_bonus;
                    if (data.enum_sp_bonus !== undefined) document.getElementById('enum_sp_bonus').value = data.enum_sp_bonus;

                    // 自动计算结果
                    document.getElementById('calculate-all').click();
                } catch (error) {
                    showNotification(i18n.errorLoadingCard, 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    });

    // 加载资源列表
    const resources = [
        { name: i18n.loadingInitialize, time: 1000 },
        { name: i18n.loadingStyles, time: 500 },
        { name: i18n.loadingLanguages, time: 500 },
        { name: i18n.loadingCalculator, time: 1000 }
    ];

    // 加载动画相关代码
    const loadingText = document.getElementById('loading-text');
    const skipButton = document.getElementById('skip-loading');
    const loadingScreen = document.getElementById('loading-screen');
    const loadStartTime = Date.now();
    let currentResourceIndex = 0;
    let skipTimeout;

    // 更新加载提示文本
    async function updateLoadingText() {
        for (const resource of resources) {
            if (loadingScreen.classList.contains('hidden')) break;
            
            loadingText.textContent = `${i18n.loadingScreen} ${resource.name}`;
            await new Promise(resolve => setTimeout(resolve, resource.time));
            currentResourceIndex++;
        }
    }

    // 显示跳过按钮的定时器
    skipTimeout = setTimeout(() => {
        if (!loadingScreen.classList.contains('hidden')) {
            skipButton.style.display = 'block';
            skipButton.textContent = i18n.skipLoading; // 使用语言文件中的翻译
        }
    }, 3000);

    // 跳过按钮点击事件
    skipButton.addEventListener('click', () => {
        clearTimeout(skipTimeout);
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    });

    // 开始加载动画
    updateLoadingText();

    // 当所有资源加载完成或超过最小加载时间后自动隐藏加载界面
    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - loadStartTime;
        const totalResourceTime = resources.reduce((sum, r) => sum + r.time, 0);
        const remainingTime = Math.max(0, totalResourceTime - elapsedTime);

        setTimeout(() => {
            clearTimeout(skipTimeout);
            if (!loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, remainingTime);

        // 更新页面文本
        updateText();
        // 从URL获取参数
        loadParamsFromUrl();
        // 显示GNU协议对话框
        //showGnuv3Dialog();

    });
    async function pwainstall(){
        if (!deferredPrompt) {
            showNotification(i18n.appManagement.installSuccess, 'info');
            return;
        }
        
        try {
            const result = await deferredPrompt.prompt();
            if (result.outcome === 'accepted') {
                showNotification(i18n.appManagement.installSuccess, 'info');
                installButton.style.display = 'none';
            }
        } catch (err) {
            showNotification(i18n.appManagement.installSuccess, 'info');
        }
        
        deferredPrompt = null;
    
    }
    // 清理缓存功能
    async function clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
            showNotification('缓存已清理', 'success');
        } else {
            showNotification('此浏览器不支持缓存清理', 'error');
        }
    }

// 绑定清理缓存按钮事件
document.getElementById('clearCache').addEventListener('click', clearCache);
    // 分享功能相关函数
    function getUrlParameterString() {
        const params = {
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
            // 添加枚举值参数
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

        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        return `${window.location.origin}${window.location.pathname}?${queryString}`;
    }

    function loadParamsFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const inputs = [
            'card_name', 'type_static', 'friendship_award',
            'enthusiasm_award', 'training_award', 'strike_point', 'friendship_point',
            'speed_bonus', 'stamina_bonus', 'power_bonus', 'willpower_bonus',
            'wit_bonus', 'sp_bonus'
        ];

        // 处理非枚举字段
        inputs.forEach(id => {
            const value = urlParams.get(id);
            if (value !== null) {
                document.getElementById(id).value = value;
            }
        });

        // 处理枚举开关状态
        const enableEnum = urlParams.get('enable_enum');
        if (enableEnum !== null) {
            const enumCheckbox = document.getElementById('enable_enum');
            enumCheckbox.checked = enableEnum === 'true';
            // 触发change事件以显示/隐藏枚举卡片
            const event = new Event('change');
            enumCheckbox.dispatchEvent(event);
        }

        // 处理枚举值字段
        const enumInputs = [
            'enum_friendship_award', 'enum_enthusiasm_award', 'enum_training_award',
            'enum_friendship_point', 'enum_strike_point', 'enum_speed_bonus',
            'enum_stamina_bonus', 'enum_power_bonus', 'enum_willpower_bonus',
            'enum_wit_bonus', 'enum_sp_bonus'
        ];

        enumInputs.forEach(id => {
            const value = urlParams.get(id);
            if (value !== null) {
                document.getElementById(id).value = value;
            }
        });

        // 如果URL中有参数，自动计算所有结果
        if (urlParams.toString()) {
            document.getElementById('calculate-all').click();
        }
    }

    // 分享按钮点击事件
    document.getElementById('shareCard').addEventListener('click', async () => {
        const shareUrl = getUrlParameterString();
        const shareText = `${shareUrl}`;
        
        try {
            await navigator.clipboard.writeText(shareText);
            showNotification(i18n.notifications.shareLinkCopied, 'info');
        } catch (err) {
            console.error(i18n.notifications.copyError, err);
            showNotification(i18n.notifications.copyFailed, 'error');
        }
    });

    // 修改 showGnuv3Dialog 调用逻辑，确保只显示一次
    function showGnuv3Dialog() {
        if (isGnuv3DialogShown) return; // 防止重复显示
        isGnuv3DialogShown = true;

        const dialog = document.createElement('div');
        dialog.classList.add('gnuv3-dialog');

        const dialogContent = document.createElement('div');
        dialogContent.classList.add('gnuv3-dialog-content');

        const title = document.createElement('h2');
        title.classList.add('gnuv3-dialog-title');
        title.textContent = i18n.gnuv3Title;
        dialogContent.appendChild(title);

        const text = document.createElement('div');
        text.classList.add('gnuv3-dialog-text');
        text.textContent = i18n.gnuv3Text;
        dialogContent.appendChild(text);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('gnuv3-dialog-buttons');

        const disagreeButton = document.createElement('button');
        disagreeButton.textContent = i18n.disagree;
        disagreeButton.classList.add('button');
        disagreeButton.addEventListener('click', () => {
            window.close();
        });
        buttonContainer.appendChild(disagreeButton);

        const agreeButton = document.createElement('button');
        agreeButton.textContent = i18n.agree;
        agreeButton.classList.add('button', 'primary');
        agreeButton.addEventListener('click', () => {
            document.body.removeChild(dialog);
            pwainstall();
        });
        buttonContainer.appendChild(agreeButton);

        dialogContent.appendChild(buttonContainer);
        dialog.appendChild(dialogContent);
        document.body.appendChild(dialog);
    }

    // 更多按钮的点击事件
    const moreButton = document.getElementById('moreButton');
    const moreMenu = document.getElementById('moreMenu');
    const overlay = document.querySelector('.overlay');
        
    // 点击更多按钮时显示/隐藏下拉菜单和背景遮罩
    moreButton.addEventListener('click', (e) => {
        e.stopPropagation();
        moreMenu.classList.toggle('show');
        overlay.classList.toggle('show');
    });
        
    // 点击页面其他地方时关闭下拉菜单和背景遮罩
    document.addEventListener('click', (e) => {
        if (!moreMenu.contains(e.target) && !moreButton.contains(e.target)) {
            moreMenu.classList.remove('show');
            overlay.classList.remove('show');
        }
    });

    // 点击遮罩层时关闭菜单
    overlay.addEventListener('click', () => {
        moreMenu.classList.remove('show');
        overlay.classList.remove('show');
    });
        
    // 阻止下拉菜单内的点击事件冒泡
    moreMenu.addEventListener('click', (e) => {
        e.stopPropagation();
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

    // 添加 logo 点击事件处理
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('click', () => {
            // 如果正在执行动画，不做任何处理
            if (logoContainer.classList.contains('rotate-left') || 
                logoContainer.classList.contains('rotate-right')) {
                return;
            }
            
            // 随机选择旋转方向
            const direction = Math.random() < 0.5 ? 'rotate-left' : 'rotate-right';
            
            // 添加动画类
            logoContainer.classList.add(direction);
            
            // // 创建溅射图标
            // const splash = document.createElement('img');
            // splash.src = direction === 'rotate-left' ? 'image/SCEDif1.png' : 'image/SCEPlus1.png';
            // splash.className = `splash-icon ${direction === 'rotate-left' ? 'splash-left' : 'splash-right'}`;
            
            // // 设置初始位置
            // splash.style.left = '50%';
            // splash.style.top = '50%';
            
            // // 将溅射图标添加到logo容器
            // logoContainer.appendChild(splash);
            
            // // 动画结束后移除类和溅射图标
            // logoContainer.addEventListener('animationend', () => {
            //     logoContainer.classList.remove('rotate-left', 'rotate-right');
            // }, { once: true });
            
            // // 溅射动画结束后移除溅射图标
            // splash.addEventListener('animationend', () => {
            //     logoContainer.removeChild(splash);
            // }, { once: true });
        });
    }

    // 绑定枚举拓展开关事件
    document.getElementById('enable_enum').addEventListener('change', function(e) {
        const enumCard = document.getElementById('enum_card');
        if (e.target.checked) {
            enumCard.style.display = 'block';
            showNotification(i18n.notifications.enableEnum, 'info');
        } else {
            enumCard.style.display = 'none';
            showNotification(i18n.notifications.disableEnum, 'info');
        }
    });

    // 应用管理功能
    // const installApp = document.getElementById('installApp');
    // const updateApp = document.getElementById('updateApp');
    // const clearCache = document.getElementById('clearCache');

    // PWA 安装功能
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installApp.style.display = 'block';
    });

    // installApp.addEventListener('click', async () => {
    //     if (!deferredPrompt) {
    //         showNotification(i18n.appManagement.installSuccess, 'info');
    //         return;
    //     }
    //     deferredPrompt.prompt();
    //     const { outcome } = await deferredPrompt.userChoice;
    //     if (outcome === 'accepted') {
    //         showNotification(i18n.appManagement.installSuccess, 'info');
    //     } else {
    //         showNotification(i18n.appManagement.installSuccess, 'info');
    //     }
    //     deferredPrompt = null;
    // });

    // 更新应用功能
    // if ('serviceWorker' in navigator) {
    //     let newWorker;
    //     let refreshing = false;

    //     updateApp.addEventListener('click', () => {
    //         if (newWorker) {
    //             newWorker.postMessage({ type: 'SKIP_WAITING' });
    //             showNotification(i18n.appManagement.updateSuccess, 'info');
    //         } else {
    //             showNotification(i18n.appManagement.updateError, 'error');
    //         }
    //     });

    //     navigator.serviceWorker.addEventListener('controllerchange', () => {
    //         if (refreshing) return;
    //         refreshing = true;
    //         window.location.reload();
    //     });

    //     navigator.serviceWorker.ready.then((registration) => {
    //         registration.addEventListener('updatefound', () => {
    //             newWorker = registration.installing;
    //             newWorker.addEventListener('statechange', () => {
    //                 if (newWorker.state === 'installed') {
    //                     if (navigator.serviceWorker.controller) {
    //                         updateApp.style.display = 'block';
    //                     }
    //                 }
    //             });
    //         });
    //     });
    // }

    // 清理缓存功能
    // clearCache.addEventListener('click', async () => {
    //     if (!('caches' in window)) {
    //         showNotification(i18n.appManagement.clearError, 'error');
    //         return;
    //     }

    //     try {
    //         const cacheKeys = await caches.keys();
    //         await Promise.all(cacheKeys.map(key => caches.delete(key)));
    //         showNotification(i18n.appManagement.clearSuccess, 'info');
    //     } catch (err) {
    //         showNotification(i18n.appManagement.clearError, 'error');
    //     }
    // });
    // --- 使用预设功能代码开始 ---

    const usingNowCardButton = document.getElementById('usingnowcard');
    let presetDataCache = null; // 缓存预设数据

    // 类型映射
    const typeMap = {
        0: i18n.typeOptions.speed || 'Speed',
        1: i18n.typeOptions.stamina || 'Stamina',
        2: i18n.typeOptions.power || 'Power',
        3: i18n.typeOptions.willpower || 'Willpower',
        4: i18n.typeOptions.wit || 'Wit',
        '-1': 'Friend' // 假设 -1 是友人卡
    };

    // 显示加载指示器
    function showLoadingIndicator(show = true) {
        let indicator = document.getElementById('preset-loading-indicator');
        if (show) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'preset-loading-indicator';
                indicator.style.position = 'fixed';
                indicator.style.top = '50%';
                indicator.style.left = '50%';
                indicator.style.transform = 'translate(-50%, -50%)';
                indicator.style.padding = '20px';
                indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                indicator.style.color = 'white';
                indicator.style.borderRadius = '8px';
                indicator.textContent = i18n.loadingPresets || '正在加载预设...';
                indicator.style.zIndex = '1001'; // 确保在弹窗之上
                document.body.appendChild(indicator);
            }
            indicator.style.display = 'block';
        } else {
            if (indicator) {
                indicator.style.display = 'none';
            }
        }
    }

    // 获取预设数据
    async function fetchPresetData() {
        if (presetDataCache) {
            return presetDataCache;
        }
        showLoadingIndicator(true);
        try {
            // 注意：浏览器 fetch 无法直接设置代理，请确保网络环境允许访问
            const response = await fetch('https://sce-data-api.3290293702.workers.dev/getUmaSceData', {
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

    // 显示预设弹窗
    function showPresetModal(data) {
        closeModal(); // 关闭可能已存在的旧弹窗

        const modal = document.createElement('div');
        modal.id = 'preset-modal';
        modal.style.position = 'fixed';
        modal.style.left = '50%';
        modal.style.top = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.width = '80%';
        modal.style.maxWidth = '600px';
        modal.style.maxHeight = '80vh';
        modal.style.backgroundColor = 'white';
        modal.style.border = '1px solid #ccc';
        modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        modal.style.zIndex = '1000';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.borderRadius = '8px';
        modal.style.overflow = 'hidden'; // 防止内容溢出

        const header = document.createElement('div');
        header.style.padding = '15px';
        header.style.backgroundColor = '#f1f1f1';
        header.style.borderBottom = '1px solid #ddd';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';

        const title = document.createElement('h3');
        title.textContent = i18n.usePresetTitle || '使用支援卡预设';
        title.style.margin = '0';

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;'; // '×' symbol
        closeButton.style.border = 'none';
        closeButton.style.background = 'transparent';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = closeModal;

        header.appendChild(title);
        header.appendChild(closeButton);

        const searchContainer = document.createElement('div');
        searchContainer.style.padding = '10px 15px';
        searchContainer.style.borderBottom = '1px solid #ddd';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = i18n.searchPlaceholder || '搜索支援卡名称...';
        searchInput.style.width = '100%';
        searchInput.style.padding = '8px';
        searchInput.style.boxSizing = 'border-box';
        searchInput.oninput = () => filterTable(searchInput.value);
        searchContainer.appendChild(searchInput);

        const tableContainer = document.createElement('div');
        tableContainer.style.overflowY = 'auto'; // 使表格内容可滚动
        tableContainer.style.padding = '0 15px 15px 15px'; // 内边距
        tableContainer.style.flexGrow = '1'; // 占据剩余空间

        const table = document.createElement('table');
        table.id = 'preset-table';
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">${i18n.cardNameHeader || '支援卡名称'}</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">${i18n.cardTypeHeader || '类别'}</th>
                <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${i18n.useButtonHeader || '使用'}</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.forEach(card => {
            const row = tbody.insertRow();
            row.dataset.cardData = JSON.stringify(card); // 将卡片数据存储在行上

            const nameCell = row.insertCell();
            nameCell.textContent = card.CardName;
            nameCell.style.padding = '8px';
            nameCell.style.borderBottom = '1px solid #eee';

            const typeCell = row.insertCell();
            typeCell.textContent = typeMap[card.type] || card.type; // 使用映射转换类型
            typeCell.style.padding = '8px';
            typeCell.style.borderBottom = '1px solid #eee';

            const actionCell = row.insertCell();
            actionCell.style.textAlign = 'center';
            actionCell.style.padding = '8px';
            actionCell.style.borderBottom = '1px solid #eee';

            const useButton = document.createElement('button');
            useButton.textContent = i18n.useButtonText || '使用';
            useButton.classList.add('button', 'primary', 'small-button'); // 添加样式类
            useButton.style.padding = '4px 8px'; // 调整按钮大小
            useButton.style.fontSize = '12px';
            useButton.onclick = () => fillFormData(card);
            actionCell.appendChild(useButton);
        });
        table.appendChild(tbody);
        tableContainer.appendChild(table);

        modal.appendChild(header);
        modal.appendChild(searchContainer);
        modal.appendChild(tableContainer);

        document.body.appendChild(modal);
    }

    // 过滤表格
    function filterTable(searchTerm) {
        const table = document.getElementById('preset-table');
        if (!table) return;
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        const filter = searchTerm.toLowerCase();

        for (let i = 0; i < rows.length; i++) {
            const nameCell = rows[i].getElementsByTagName('td')[0];
            if (nameCell) {
                const name = nameCell.textContent || nameCell.innerText;
                if (name.toLowerCase().indexOf(filter) > -1) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        }
    }

    // 填充表单数据
    function fillFormData(cardData) {
        console.log('Filling form with card:', cardData.CardName);
        // 字段映射 (API字段 -> 表单ID)
        const fieldMap = {
            'CardName': 'card_name',
            'type': 'type_static',
            'fs': 'friendship_award', // API 'fs' 对应 'friendship_award'
            'es': 'enthusiasm_award',
            'tr': 'training_award',
            'gat': 'strike_point', // API 'gat' 对应 'strike_point'
            'trap': 'friendship_point', // API 'trap' 对应 'friendship_point'
            'spd': 'speed_bonus',
            'sta': 'stamina_bonus',
            'pow': 'power_bonus',
            'will': 'willpower_bonus',
            'wit': 'wit_bonus',
            'sp': 'sp_bonus',
            // 枚举字段映射 (如果需要填充枚举)
            'efs': 'enum_friendship_award',
            'ees': 'enum_enthusiasm_award',
            'etr': 'enum_training_award',
            'egat': 'enum_strike_point',
            'etrap': 'enum_friendship_point',
            'espd': 'enum_speed_bonus',
            'esta': 'enum_stamina_bonus',
            'epow': 'enum_power_bonus',
            'ewill': 'enum_willpower_bonus',
            'ewit': 'enum_wit_bonus',
            'esp': 'enum_sp_bonus'
        };

        let hasEnumValues = false;
        const enumFields = ['efs', 'ees', 'etr', 'egat', 'etrap', 'espd', 'esta', 'epow', 'ewill', 'ewit', 'esp'];

        // 检查是否存在非零的固有加成值
        for (const field of enumFields) {
            if (cardData[field] !== undefined && cardData[field] !== 0 && cardData[field] !== null) {
                hasEnumValues = true;
                break;
            }
        }

        // 填充所有字段（包括枚举和非枚举）
        for (const [apiField, formId] of Object.entries(fieldMap)) {
            const element = document.getElementById(formId);
            if (element && cardData[apiField] !== undefined) {
                // 特殊处理 card_name 和 type_static
                if (formId === 'card_name') {
                    element.value = cardData[apiField];
                } else if (formId === 'type_static') {
                    // 确保类型值在下拉选项中存在
                    const typeValue = cardData[apiField].toString();
                    if ([...element.options].some(opt => opt.value === typeValue)) {
                        element.value = typeValue;
                    } else {
                        console.warn(`Type value ${typeValue} not found in select options.`);
                        // 可以设置一个默认值或保持不变
                    }
                } else {
                    // 填充其他字段（包括枚举字段）
                    element.value = cardData[apiField];
                }
            } else if (element && formId.startsWith('enum_')) {
                 // 如果API数据中没有对应的枚举字段，则清空枚举输入框
                 element.value = 0;
            }
        }


        // 如果存在固有加成值，则启用枚举拓展并显示
        const enableEnumCheckbox = document.getElementById('enable_enum');
        const enumCard = document.getElementById('enum_card');
        if (enableEnumCheckbox && enumCard) {
            if (hasEnumValues) {
                enableEnumCheckbox.checked = true;
                enumCard.style.display = 'block';
            } else {
                 // 如果没有固有加成值，可以选择取消勾选并隐藏 (可选逻辑)
                 enableEnumCheckbox.checked = false;
                 enumCard.style.display = 'none';
                 // 清空所有枚举输入框的值
                 for (const [apiField, formId] of Object.entries(fieldMap)) {
                     if (formId.startsWith('enum_')) {
                         const element = document.getElementById(formId);
                         if (element) {
                             element.value = 0;
                         }
                     }
                 }
            }
        }

        showNotification(`${i18n.presetApplied || '已应用预设'}: ${cardData.CardName}`, 'success');
        closeModal();
    }

    // 关闭弹窗
    function closeModal() {
        const modal = document.getElementById('preset-modal');
        if (modal) {
            modal.remove();
        }
    }

    // 为“使用预设”按钮添加事件监听器
    if (usingNowCardButton) {
        usingNowCardButton.addEventListener('click', async () => {
            const data = await fetchPresetData();
            if (data) {
                showPresetModal(data);
            }
        });
    }

    // --- 使用预设功能代码结束 ---

});



// 注册 Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.error('ServiceWorker registration failed:', err);
            });
    });
}

// PWA 安装功能
// let deferredPrompt;
// // const installButton = document.getElementById('installApp');
// // const updateButton = document.getElementById('updateApp');
// const clearCacheButton = document.getElementById('clearCache');

// window.addEventListener('beforeinstallprompt', (e) => {
//     e.preventDefault();
//     deferredPrompt = e;
//     installButton.style.display = 'flex';
// });

// installButton.addEventListener('click', async () => {
//     if (!deferredPrompt) {
//         showNotification(i18n.appManagement.installError, 'error');
//         return;
//     }
    
//     try {
//         const result = await deferredPrompt.prompt();
//         if (result.outcome === 'accepted') {
//             showNotification(i18n.appManagement.installSuccess, 'info');
//             installButton.style.display = 'none';
//         }
//     } catch (err) {
//         showNotification(i18n.appManagement.installError, 'error');
//     }
    
//     deferredPrompt = null;
// });

// // 更新应用
// updateButton.addEventListener('click', async () => {
//     if (!('serviceWorker' in navigator)) {
//         showNotification(i18n.appManagement.updateError, 'error');
//         return;
//     }

//     try {
//         const registration = await navigator.serviceWorker.getRegistration();
//         if (registration) {
//             await registration.update();
//             showNotification(i18n.appManagement.updateSuccess, 'info');
//         }
//     } catch (err) {
//         showNotification(i18n.appManagement.updateError, 'error');
//     }
// });

// 清理缓存
// clearCacheButton.addEventListener('click', async () => {
//     if (!('caches' in window)) {
//         showNotification(i18n.appManagement.clearError, 'error');
//         return;
//     }

//     try {
//         const cacheKeys = await caches.keys();
//         await Promise.all(cacheKeys.map(key => caches.delete(key)));
//         showNotification(i18n.appManagement.clearSuccess, 'info');
//     } catch (err) {
//         showNotification(i18n.appManagement.clearError, 'error');
//     }

// });
