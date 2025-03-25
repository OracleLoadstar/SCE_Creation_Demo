// UmaSCE 算法实现
// 移除所有导入，使用 window 对象
class UmaSCE_Main {
    constructor() {
        // 初始化属性
        this.type_static = 0;
        this.friendship_static = 0;
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
        this.type_static = parseInt(document.getElementById('type_static').value);
        this.friendship_static = parseInt(document.getElementById('friendship_static').value);
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
    }

    // V1 算法实现
    evalV1() {
        this.v1_ept = (this.friendship_award * 0.01 + 1) *
            (this.friendship_static * 0.01 + 1) *
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
            'label[for="type_static"]': `${i18n.type} (type_static)`,
            'label[for="friendship_static"]': `${i18n.friendshipStatic} (friendship_static)`,
            'label[for="friendship_award"]': `${i18n.friendshipAward} (friendship_award)`,
            'label[for="enthusiasm_award"]': `${i18n.enthusiasmAward} (enthusiasm_award)`,
            'label[for="training_award"]': `${i18n.trainingAward} (training_award)`,
            'label[for="strike_point"]': `${i18n.strikePoint} (strike_point)`,
            'label[for="friendship_point"]': `${i18n.friendshipPoint} (friendship_point)`,
            'label[for="speed_bonus"]': `${i18n.speedBonus} (speed_bonus)`,
            'label[for="stamina_bonus"]': `${i18n.staminaBonus} (stamina_bonus)`,
            'label[for="power_bonus"]': `${i18n.powerBonus} (power_bonus)`,
            'label[for="willpower_bonus"]': `${i18n.willpowerBonus} (willpower_bonus)`,
            'label[for="wit_bonus"]': `${i18n.witBonus} (wit_bonus)`,
            'label[for="sp_bonus"]': `${i18n.spBonus} (sp_bonus)`,
            '#calculate-v1': i18n.calculateV1,
            '#calculate-v2': i18n.calculateV2,
            '#calculate-v3': i18n.calculateV3,
            '#calculate-v4': i18n.calculateV4,
            '#calculate-all': i18n.calculateAll,
            '.result-label.v1-label': `${i18n.v1Value} (v1_ept):`,
            '.result-label.v2-label': `${i18n.v2Value} (v2_ept):`,
            '.result-label.v3-label': `${i18n.v3Value} (v3_ept):`,
            '.result-label.v4main-label': `${i18n.v4MainValue} (v4main_ept):`,
            '.result-label.v4fold-label': `${i18n.v4FoldValue} (v4fold_ept):`,
            '.result-label.v4sp-label': `${i18n.v4SpValue} (v4sp_ept):`,
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
            { id: 'friendship_static', name: i18n.friendshipStatic },
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

        for (const input of inputs) {
            const element = document.getElementById(input.id);
            const value = element.value.trim();
            if (value === '') {
                alert(`${input.name}${i18n.cannotBeEmpty}`);
                element.focus();
                return false;
            }
            
            // 对数字输入框进行验证
            if (input.id !== 'type_static') {
                const numValue = Number(value);
                if (isNaN(numValue)) {
                    alert(`${input.name}${i18n.mustBeValidNumber}`);
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
            alert(i18n.errorCalculatingV1 + ': ' + error.message);
        }
    });

    document.getElementById('calculate-v2').addEventListener('click', () => {
        if (!validateInputs()) return;
        try {
            umaSCE.getParamsFromForm();
            const v2 = umaSCE.evalV2();
            v2Result.textContent = v2.toFixed(4);
        } catch (error) {
            alert(i18n.errorCalculatingV2 + ': ' + error.message);
        }
    });

    document.getElementById('calculate-v3').addEventListener('click', () => {
        if (!validateInputs()) return;
        try {
            umaSCE.getParamsFromForm();
            const v3 = umaSCE.evalV3();
            v3Result.textContent = v3.toFixed(4);
        } catch (error) {
            alert(i18n.errorCalculatingV3 + ': ' + error.message);
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
            alert(i18n.errorCalculatingV4 + ': ' + error.message);
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
            alert('Error calculating: ' + error.message);
        }
    });
    
    // Set default values
    document.getElementById('type_static').value = "0";
    document.getElementById('friendship_static').value = "0";
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
            friendship_static: document.getElementById('friendship_static').value,
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
            sp_bonus: document.getElementById('sp_bonus').value
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
                    document.getElementById('friendship_static').value = data.friendship_static;
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
                } catch (error) {
                    alert(i18n.errorLoadingCard);
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
        
        // 显示GNU协议对话框
        showGnuv3Dialog();
    });
});

// 修改 showGnuv3Dialog 调用逻辑，确保只显示一次
let isGnuv3DialogShown = false;

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
    });
    buttonContainer.appendChild(agreeButton);

    dialogContent.appendChild(buttonContainer);
    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);
}

// 更多按钮的点击事件
const moreButton = document.getElementById('moreButton');
const moreMenu = document.getElementById('moreMenu');

// 点击更多按钮时显示/隐藏下拉菜单
moreButton.addEventListener('click', (e) => {
    e.stopPropagation();
    moreMenu.classList.toggle('show');
});

// 点击页面其他地方时关闭下拉菜单
document.addEventListener('click', (e) => {
    if (!moreMenu.contains(e.target) && !moreButton.contains(e.target)) {
        moreMenu.classList.remove('show');
    }
});

// 阻止下拉菜单内的点击事件冒泡
moreMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});