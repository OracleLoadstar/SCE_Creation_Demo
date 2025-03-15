// UmaSCE Algorithm JavaScript Implementation
// Remove imports and use window object
// ...existing code...
class UmaSCE_Main {
    constructor() {
        // Initialize properties
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

    // Get parameters from form
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

    // EvalV1 algorithm implementation
    evalV1() {
        this.v1_ept = (this.friendship_award * 0.01 + 1) *
            (this.friendship_static * 0.01 + 1) *
            (this.enthusiasm_award * 0.002 + 1) *
            (this.training_award * 0.01 + 1);

        this.unstrike_v1_ept = (this.enthusiasm_award * 0.002 + 1) *
            (this.training_award * 0.01 + 1);

        return this.v1_ept;
    }

    // EvalV2 algorithm implementation
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

    // EvalV3 algorithm implementation
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

    // EvalV4 algorithm implementation
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

    // EvalV5 algorithm implementation
    evalV5() {
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
    
    // 检查完整匹配
    if (supportedLanguages.includes(userLanguage)) {
        return userLanguage;
    }
    
    // 检查语言代码匹配（例如 'zh-cn' 匹配 'zh'）
    const languageCode = userLanguage.split('-')[0];
    if (supportedLanguages.includes(languageCode)) {
        return languageCode;
    }
    
    // 默认返回英语
    return 'en';
}

// 初始化默认语言为系统语言
let currentLanguage = getSystemLanguage();

// Function to switch language
function switchLanguage(lang) {
    currentLanguage = lang;
    i18n = languages[lang];
    updateText();
    document.getElementById('language-toggle').textContent = i18n.switchLanguage;
}

// Internationalization object
let i18n = languages[currentLanguage];

// Function to update text content based on selected language
function updateText() {
    document.title = i18n.title;
    document.querySelector('.app-bar h1').textContent = i18n.title;
    document.querySelector('#language-toggle').textContent = i18n.switchLanguage;
    document.querySelector('.card-header h2').textContent = i18n.parameterSettings;
    document.querySelector('label[for="type_static"]').textContent = i18n.type + " (type_static)";
    document.querySelector('label[for="friendship_static"]').textContent = i18n.friendshipStatic + " (friendship_static)";
    document.querySelector('label[for="friendship_award"]').textContent = i18n.friendshipAward + " (friendship_award)";
    document.querySelector('label[for="enthusiasm_award"]').textContent = i18n.enthusiasmAward + " (enthusiasm_award)";
    document.querySelector('label[for="training_award"]').textContent = i18n.trainingAward + " (training_award)";
    document.querySelector('label[for="strike_point"]').textContent = i18n.strikePoint + " (strike_point)";
    document.querySelector('label[for="friendship_point"]').textContent = i18n.friendshipPoint + " (friendship_point)";
    document.querySelector('label[for="speed_bonus"]').textContent = i18n.speedBonus + " (speed_bonus)";
    document.querySelector('label[for="stamina_bonus"]').textContent = i18n.staminaBonus + " (stamina_bonus)";
    document.querySelector('label[for="power_bonus"]').textContent = i18n.powerBonus + " (power_bonus)";
    document.querySelector('label[for="willpower_bonus"]').textContent = i18n.willpowerBonus + " (willpower_bonus)";
    document.querySelector('label[for="wit_bonus"]').textContent = i18n.witBonus + " (wit_bonus)";
    document.querySelector('label[for="sp_bonus"]').textContent = i18n.spBonus + " (sp_bonus)";
    document.getElementById('calculate-v1').textContent = i18n.calculateV1;
    document.getElementById('calculate-v2').textContent = i18n.calculateV2;
    document.getElementById('calculate-v3').textContent = i18n.calculateV3;
    document.getElementById('calculate-v4').textContent = i18n.calculateV4;
    //document.getElementById('calculate-v5').textContent = i18n.calculateV5;
    document.getElementById('calculate-all').textContent = i18n.calculateAll;
    document.querySelector('.card:nth-of-type(2) .card-header h2').textContent = i18n.calculationResults;
    document.querySelector('.result-group:nth-of-type(1) .result-label').textContent = i18n.v1Value + " (v1_ept):";
    document.querySelector('.result-group:nth-of-type(2) .result-label').textContent = i18n.v2Value + " (v2_ept):";
    document.querySelector('.result-group:nth-of-type(3) .result-label').textContent = i18n.v3Value + " (v3_ept):";
    document.querySelector('.result-group:nth-of-type(4) .result-label').textContent = i18n.v4MainValue + " (v4main_ept):";
    document.querySelector('.result-group:nth-of-type(5) .result-label').textContent = i18n.v4FoldValue + " (v4fold_ept):";
    document.querySelector('.result-group:nth-of-type(6) .result-label').textContent = i18n.v4SpValue + " (v4sp_ept):";
    
    // 删除V5相关元素的更新
    /* 
    document.querySelector('.result-group:nth-of-type(7) .result-label').textContent = i18n.v5MainValue + " (v5main_ept):";
    document.querySelector('.result-group:nth-of-type(8) .result-label').textContent = i18n.v5FoldValue + " (v5fold_ept):";
    document.querySelector('.result-group:nth-of-type(9) .result-label').textContent = i18n.v5SPValue + " (v5sp_ept):";
    */

    const gnuv3Title = document.querySelector('.gnuv3-dialog-title');
    if (gnuv3Title) {
        gnuv3Title.textContent = i18n.gnuv3Title;
    }
    const agreeButton = document.querySelector('.gnuv3-dialog-buttons button:nth-child(1)');
    if (agreeButton) {
        agreeButton.textContent = i18n.agree;
    }
    const disagreeButton = document.querySelector('.gnuv3-dialog-buttons button:nth-child(2)');
    if (disagreeButton) {
        disagreeButton.textContent = i18n.disagree;
    }

    // 更新类型选择选项
    const typeSelect = document.getElementById('type_static');
    const options = typeSelect.options;
    options[0].textContent = i18n.typeOptions.speed;
    options[1].textContent = i18n.typeOptions.stamina;
    options[2].textContent = i18n.typeOptions.power;
    options[3].textContent = i18n.typeOptions.willpower;
    options[4].textContent = i18n.typeOptions.wit;

    // 更新贡献者选择选项
    document.querySelector('.card:nth-of-type(3) .card-header h2').textContent = i18n.contributors;
}

// Initialize after page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language
    switchLanguage(currentLanguage);

    // Add language toggle event listener
    document.getElementById('language-toggle').addEventListener('click', () => {
        const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
        switchLanguage(newLanguage);
    });

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
    /* 删除V5相关变量
    const v5MainResult = document.getElementById('v5main-result');
    const v5FoldResult = document.getElementById('v5fold-result');
    const v5SpResult = document.getElementById('v5sp-result');
    */

    // Calculate V1 button click event
    document.getElementById('calculate-v1').addEventListener('click', () => {
        try {
            umaSCE.getParamsFromForm();
            const v1 = umaSCE.evalV1();
            v1Result.textContent = v1.toFixed(4);
        } catch (error) {
            alert(i18n.errorCalculatingV1 + ': ' + error.message);
        }
    });

    // Calculate V2 button click event
    document.getElementById('calculate-v2').addEventListener('click', () => {
        try {
            umaSCE.getParamsFromForm();
            const v2 = umaSCE.evalV2();
            v2Result.textContent = v2.toFixed(4);
        } catch (error) {
            alert(i18n.errorCalculatingV2 + ': ' + error.message);
        }
    });

    // Calculate V3 button click event
    document.getElementById('calculate-v3').addEventListener('click', () => {
        try {
            umaSCE.getParamsFromForm();
            const v3 = umaSCE.evalV3();
            v3Result.textContent = v3.toFixed(4);
        } catch (error) {
            alert(i18n.errorCalculatingV3 + ': ' + error.message);
        }
    });

    // Calculate V4 button click event
    document.getElementById('calculate-v4').addEventListener('click', () => {
        try {
            umaSCE.getParamsFromForm();
            const v4 = umaSCE.evalV4();
            v4MainResult.textContent = v4.v4main_ept;
            v4FoldResult.textContent = v4.v4fold_ept;
            v4SpResult.textContent = v4.v4sp_ept;
        } catch (error) {
            alert(i18n.errorCalculatingV4 + ': ' + error.message);
        }
    });

    // Calculate All button click event
    document.getElementById('calculate-all').addEventListener('click', () => {
        try {
            umaSCE.getParamsFromForm();

            const v1 = umaSCE.evalV1();
            v1Result.textContent = v1.toFixed(4);

            const v2 = umaSCE.evalV2();
            v2Result.textContent = v2.toFixed(4);

            const v3 = umaSCE.evalV3();
            v3Result.textContent = v3.toFixed(4);

            const v4 = umaSCE.evalV4();
            v4MainResult.textContent = v4.v4main_ept;
            v4FoldResult.textContent = v4.v4fold_ept;
            v4SpResult.textContent = v4.v4sp_ept;

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
});

function showGnuv3Dialog() {
    const dialog = document.createElement('div');
    dialog.classList.add('gnuv3-dialog');

    const dialogContent = document.createElement('div');
    dialogContent.classList.add('gnuv3-dialog-content');

    const title = document.createElement('h2');
    title.classList.add('gnuv3-dialog-title');
    title.textContent = i18n.gnuv3Title;
    dialogContent.appendChild(title);

    const text = document.createElement('div');
    text.classList.add('gnuv3-dialog-text')
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