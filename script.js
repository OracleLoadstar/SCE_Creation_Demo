// UmaSCE Algorithm JavaScript Implementation
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
}

// Language files
const languages = {
    en: {
        title: "UmaSCE Algorithm Demo",
        parameterSettings: "Parameter Settings",
        type: "Type",
        friendshipStatic: "Friendship Static",
        friendshipAward: "Friendship Award",
        enthusiasmAward: "Enthusiasm Award",
        trainingAward: "Training Award",
        strikePoint: "Strike Point",
        friendshipPoint: "Friendship Point",
        speedBonus: "Speed Bonus",
        staminaBonus: "Stamina Bonus",
        powerBonus: "Power Bonus",
        willpowerBonus: "Willpower Bonus",
        witBonus: "Wit Bonus",
        spBonus: "SP Bonus",
        calculateV1: "Calculate V1",
        calculateV2: "Calculate V2",
        calculateV3: "Calculate V3",
        calculateV4: "Calculate V4",
        calculateAll: "Calculate All",
        calculationResults: "Calculation Results",
        v1Value: "V1 Value",
        v2Value: "V2 Value",
        v3Value: "V3 Value",
        v4MainValue: "V4 Main Value",
        v4FoldValue: "V4 Fold Value",
        v4SpValue: "V4 SP Value",
        evalV2InvalidType: "EvalV2: Invalid type_static value",
        evalV3InvalidType: "EvalV3: Invalid type_static value",
        evalV4InvalidType: "EvalV4: Invalid type_static value",
        gnuv3Title: "Please Read the Following Agreement",
        agree: "Agree",
        disagree: "Disagree",
        switchLanguage: "Switch Language",
        typeOptions: {
            speed: "Speed",
            stamina: "Stamina",
            power: "Power",
            willpower: "Willpower",
            wit: "Wit"
        },
        contributors: "Contributors",
        gnuv3Text: 
`GNU General Public License version 3

Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.

Preamble

The GNU General Public License is a free, protective license for software and other kinds of works. The licenses for most software and other practical works are designed to take away your freedom to share and change the works. By contrast, the GNU General Public License is intended to guarantee your freedom to share and change all versions of a program--to make sure it remains free software for all its users. We, the Free Software Foundation, use the GNU General Public License for most of our software; it applies also to any other work released this way by its authors. You can apply it to your programs, too.

When we speak of free software, we are referring to freedom, not price. Our General Public Licenses are designed to make sure that you have the freedom to distribute copies of free software (and charge for them if you wish), that you receive source code or can get it if you want it, that you can change the software or use pieces of it in new free programs, and that you know you can do these things.

To protect your rights, we need to prevent others from denying you these rights or asking you to surrender the rights. Therefore, you have certain responsibilities if you distribute copies of the software, or if you modify it: responsibilities to respect the freedom of everyone else.

For example, if you distribute copies of such a program, whether gratis or for a fee, you must pass on to the recipients the same freedoms that you received. You must make sure that they, too, receive or can get the source code. And you must show them these terms so they know their rights.`,
    },
    zh: {
        title: "UmaSCE \u7B97\u6CD5\u6F14\u793A",
        parameterSettings: "\u53C2\u6570\u8BBE\u7F6E",
        type: "\u7C7B\u578B",
        friendshipStatic: "\u56fa\u6709\u53cb\u60c5",
        friendshipAward: "\u53cb\u60c5\u52a0\u6210",
        enthusiasmAward: "\u5e72\u52b2\u52a0\u6210",
        trainingAward: "\u8bad\u7ec3\u52a0\u6210",
        strikePoint: "\u5f97\u610f\u7387",
        friendshipPoint: "\u521d\u671f\u7f81\u7eca",
        speedBonus: "\u901F\u5EA6\u52A0\u6210",
        staminaBonus: "\u8010\u529B\u52A0\u6210",
        powerBonus: "\u529B\u91CF\u52A0\u6210",
        willpowerBonus: "\u6839\u6027\u52a0\u6210",
        witBonus: "\u667A\u529B\u52A0\u6210",
        spBonus: "SP\u52A0\u6210",
        calculateV1: "\u8BA1\u7B97 V1",
        calculateV2: "\u8BA1\u7B97 V2",
        calculateV3: "\u8BA1\u7B97 V3",
        calculateV4: "\u8BA1\u7B97 V4",
        calculateAll: "\u8BA1\u7B97\u6240\u6709",
        calculationResults: "\u8BA1\u7B97\u7ED3\u679C",
        v1Value: "V1 \u8BC4\u4F30\u503C",
        v2Value: "V2 \u8BC4\u4F30\u503C",
        v3Value: "V3 \u8BC4\u4F30\u503C",
        v4MainValue: "V4 \u4E3B\u8BC4\u4F30\u503C",
        v4FoldValue: "V4 \u6298\u53E0\u8BC4\u4F30\u503C",
        v4SpValue: "V4 SP \u8BC4\u4F30\u503C",
        evalV2InvalidType: "EvalV2: \u65E0\u6CD5\u8BC6\u522B\u7684type_static\u503C",
        evalV3InvalidType: "EvalV3: \u65E0\u6CD5\u8BC6\u522B\u7684type_static\u503C",
        evalV4InvalidType: "EvalV4: \u65E0\u6CD5\u8BC6\u522B\u7684type_static\u503C",
        gnuv3Title: "\u8BF7\u9605\u8BFB\u4EE5\u4E0B\u534F\u8BAE",
        agree: "\u540C\u610F",
        disagree: "\u4E0D\u540C\u610F",
        switchLanguage: "\u5207\u6362\u8BED\u8A00",
        typeOptions: {
            speed: "\u901f\u5ea6 (0)",
            stamina: "\u8010\u529b (1)",
            power: "\u529b\u91cf (2)",
            willpower: "\u6839\u6027 (3)",
            wit: "\u667A\u529B (4)"
        },
        contributors: "\u8d21\u732e\u8005",
        gnuv3Text: 
`GNU通用公共许可证第3版

版权所有 (C) 2007 自由软件基金会 <http://fsf.org/>
任何人都可以复制和发布本许可证文档的完整副本，
但不允许对它进行任何修改。

序言

GNU通用公共许可证是一份针对软件和其他种类作品的自由的、公共的许可证。大多数软件和其他实用作品的许可证剥夺了您共享和修改这些作品的自由。相比之下，GNU通用公共许可证旨在保证您共享和修改自由软件的所有版本的自由——确保自由软件对其所有用户来说都是自由的。我们，自由软件基金会，将GNU通用公共许可证用于我们的大多数软件；它也适用于任何作者以这种方式发布的作品。您也可以将它用于您的程序。

当我们谈到自由软件时，我们指的是自由，而不是价格。我们的通用公共许可证旨在确保您有发布自由软件副本的自由（如果您愿意，也可以为此收费），确保您能收到源代码或者在您需要时可以获得它，确保您能修改软件或者在新的自由软件中使用它的片段，并且确保您知道您可以做这些事情。

为了保护您的权利，我们需要防止其他人否认您的这些权利或者要求您放弃这些权利。因此，如果您发布软件的副本，或者修改它，您就承担了某些责任：尊重他人自由的责任。

例如，如果您发布此类程序的副本，无论是免费还是收费，您必须将您获得的相同自由传递给接收者。您必须确保他们也能收到或获得源代码。并且您必须向他们展示这些条款，让他们知道他们的权利。`,
    }
};

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
    document.getElementById('calculate-all').textContent = i18n.calculateAll;
    document.querySelector('.card:nth-of-type(2) .card-header h2').textContent = i18n.calculationResults;
    document.querySelector('.result-group:nth-of-type(1) .result-label').textContent = i18n.v1Value + " (v1_ept):";
    document.querySelector('.result-group:nth-of-type(2) .result-label').textContent = i18n.v2Value + " (v2_ept):";
    document.querySelector('.result-group:nth-of-type(3) .result-label').textContent = i18n.v3Value + " (v3_ept):";
    document.querySelector('.result-group:nth-of-type(4) .result-label').textContent = i18n.v4MainValue + " (v4main_ept):";
    document.querySelector('.result-group:nth-of-type(5) .result-label').textContent = i18n.v4FoldValue + " (v4fold_ept):";
    document.querySelector('.result-group:nth-of-type(6) .result-label').textContent = i18n.v4SpValue + " (v4sp_ept):";

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
        } catch (error) {
            alert(i18n.errorCalculatingAll + ': ' + error.message);
        }
    });
    
    // Set default values
    document.getElementById('type_static').value = "0";
    document.getElementById('friendship_static').value = "0";
    document.getElementById('friendship_award').value = "30";
    document.getElementById('enthusiasm_award').value = "30";
    document.getElementById('training_award').value = "10";
    document.getElementById('strike_point').value = "100";
    document.getElementById('friendship_point').value = "35";
    document.getElementById('speed_bonus').value = "3";
    document.getElementById('stamina_bonus').value = "0";
    document.getElementById('power_bonus').value = "2";
    document.getElementById('willpower_bonus').value = "0";
    document.getElementById('wit_bonus').value = "0";
    document.getElementById('sp_bonus').value = "1";
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