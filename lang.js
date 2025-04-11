// Language files
const languages = {
    en: {
        title: "SCE-CREATION",
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
        enableEnumExtension: "Enable Fixed Bonus Extension",
        enumValues: "Fixed Bonus Values",
        enumLabels: {
            friendshipAward: "Fixed Friendship Award",
            enthusiasmAward: "Fixed Enthusiasm Award",
            trainingAward: "Fixed Training Award",
            friendshipPoint: "Fixed Friendship Point",
            strikePoint: "Fixed Strike Point",
            speedBonus: "Fixed Speed Bonus",
            staminaBonus: "Fixed Stamina Bonus",
            powerBonus: "Fixed Power Bonus",
            willpowerBonus: "Fixed Willpower Bonus",
            witBonus: "Fixed Wit Bonus",
            spBonus: "Fixed SP Bonus"
        },
        typeOptions: {
            speed: "Speed",
            stamina: "Stamina",
            power: "Power",
            willpower: "Willpower",
            wit: "Wit"
        },
        contributors: "Contributors",
        gnuv3Text: `
1.The any data from SCE and this demo is For reference only.
2.Please read this license and obye this license when you using this demo or SCE.
3.This project not affiliated with Apple Inc.

4.The final interpretation right of this project belongs to OracleLoadstar.
`,
        // Error messages
        errorCalculatingV1: "Error calculating V1",
        errorCalculatingV2: "Error calculating V2",
        errorCalculatingV3: "Error calculating V3",
        errorCalculatingV4: "Error calculating V4",
        errorLoadingCard: "Error loading support card data",

        // Loading screen
        loadingScreen: "Loading...",
        loadingInitialize: "Initializing interface",
        loadingStyles: "Loading style files",
        loadingLanguages: "Loading language packs",
        loadingCalculator: "Loading calculation modules",
        skipLoading: "Skip",
        // Form validation
        cannotBeEmpty: " cannot be empty",
        mustBeValidNumber: " must be a valid number",
        // UI Text
        cardName: "Support Card Name",
        cardNamePlaceholder: "Enter support card name",
        shareButton: "Share",
        backToTop: "Back to top",
        saveCard: "Save Support Card",
        uploadCard: "Upload Support Card",
        notifications: {
            enableEnum: "Fixed bonus extension enabled",
            disableEnum: "Fixed bonus extension disabled",
            shareLinkCopied: "Share link copied to clipboard!",
            copyFailed: "Copy failed, please copy the link manually",
            copyError: "Error copying to clipboard:"
        },
        presetModal: {
            title: "Use Support Card Preset",
            searchPlaceholder: "Search support card name...",
            cardName: "Card Name",
            cardType: "Type",
            action: "Action",
            useButton: "Use",
            fetchingData: "Fetching preset data...",
            fetchSuccess: "Preset data fetched successfully",
            fetchError: "Failed to fetch preset data",
            applySuccess: "Preset applied",
            applyError: "Failed to apply preset",
            noData: "No matching data found"
        },

        // 应用管理
        appManagement: {
            title: "App Management",
            install: "Install as App",
            update: "Update App",
            clearCache: "Clear Cache",
            installSuccess: "Page saved, available offline",
            updateSuccess: "Page updated successfully",
            clearSuccess: "Cache cleared successfully",
            installError: "Failed to install app",
            updateError: "Failed to update app",
            clearError: "Failed to clear cache"
        }
    },
    zh: {
        title: "SCE-CREATION",
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
        willpowerBonus: "\u6839\u6027\u52A0\u6210",
        witBonus: "\u667A\u529B\u52A0\u6210",
        spBonus: "SP\u52A0\u6210",
        calculateV1: "\u8BA1\u7B97 V1",
        calculateV2: "\u8BA1\u7B97 V2",
        calculateV3: "\u8BA1\u7B97 V3",
        calculateV4: "\u8BA1\u7B97 V4",
        calculateV5: "\u8BA1\u7B97 V5",
        calculateAll: "\u8BA1\u7B97\u6240\u6709",
        calculationResults: "\u8BA1\u7B97\u7ED3\u679C",
        v1Value: "友情倍率",
        v2Value: "总友情倍率",
        v3Value: "V3评分",
        v4MainValue: "V4友情训练评分",
        v4FoldValue: "V4逛街训练评分",
        v4SpValue: "V4技能点获取评分",
        v5MainValue: "V5 \u4E3B\u8BC4\u4F30\u503C",
        v5FoldValue: "V5 \u6298\u53E0\u8BC4\u4F30\u503C",
        v5SpValue: "V5 SP \u8BC4\u4F30\u503C",
        evalV2InvalidType: "EvalV2: \u65E0\u6CD5\u8BC6\u522B\u7684type_static\u503C",
        evalV3InvalidType: "EvalV3: \u65E0\u6CD5\u8BC6\u522B\u7684type_static\u503C",
        evalV4InvalidType: "EvalV4: \u65E0\u6CD5\u8BC6\u522B\u7684type_static\u503C",
        evalV4InvalidType: "EvalV5: \u65E0\u6CD5\u8BC6\u522B\u7684type_static\u503C",
        gnuv3Title: "\u8BF7\u9605\u8BFB\u4EE5\u4E0B\u534F\u8BAE",
        agree: "\u540C\u610F",
        disagree: "\u4E0D\u540C\u610F",
        switchLanguage: "\u5207\u6362\u8BED\u8A00",
        enableEnumExtension: "启用固有加成",
        enumValues: "固有加成",
        enumLabels: {
            friendshipAward: "固有友情加成",
            enthusiasmAward: "固有干劲加成",
            trainingAward: "固有训练加成",
            friendshipPoint: "固有初期羁绊",
            strikePoint: "固有得意率",
            speedBonus: "固有速度加成",
            staminaBonus: "固有耐力加成",
            powerBonus: "固有力量加成",
            willpowerBonus: "固有根性加成",
            witBonus: "固有智力加成",
            spBonus: "固有SP加成"
        },
        typeOptions: {
            speed: "\u901f\u5ea6 ",
            stamina: "\u8010\u529b ",
            power: "\u529b\u91cf ",
            willpower: "\u6839\u6027 ",
            wit: "\u667A\u529B "
        },
        contributors: "\u8d21\u732e\u8005",
        gnuv3Text: `
1.SCE-CREATION（以下简称SCE）是基于SCE-Track进行再制作的网页应用。
2.\u672c\u9879\u76ee\u9075\u5faaGPL-3.0\u534f\u8bae\u5f00\u53d1\uff0c\u8bf7\u4ed4\u7ec6\u9605\u8bfb\uff0c\u4ee5\u514d\u5f71\u54cd\u5230\u4f60\u7684\u5408\u6cd5\u5229\u76ca\u3002
3.SCE的计算结果仅供参考。
4.SCE系列项目和本声明的最终解释权归OracleLoadstar所有。
5.SCE与Apple,Inc.无关。

*同意该声明时会同时启用Cookie
`,
        // 错误信息
        errorCalculatingV1: "计算友情倍率时发生错误",
        errorCalculatingV2: "计算总友情倍率时发生错误",
        errorCalculatingV3: "计算V3评分时发生错误",
        errorCalculatingV4: "计算V4评分时发生错误",
        errorLoadingCard: "加载支援卡数据时发生错误",

        // 加载界面
        loadingScreen: "加载中...",
        loadingInitialize: "初始化界面",
        loadingStyles: "加载样式文件",
        loadingLanguages: "加载语言包",
        loadingCalculator: "加载计算模块",
        skipLoading: "跳过",
        // 表单验证
        cannotBeEmpty: "不能为空",
        mustBeValidNumber: "必须是有效的数字",
        // UI Text
        cardName: "支援卡名称",
        cardNamePlaceholder: "请输入支援卡名称",
        shareButton: "分享",
        backToTop: "返回顶部",
        saveCard: "保存支援卡",
        uploadCard: "上传支援卡",
        notifications: {
            enableEnum: "已启用固有加成功能",
            disableEnum: "已禁用固有加成功能",
            shareLinkCopied: "分享链接已复制到剪贴板！",
            copyFailed: "复制失败，请手动复制链接",
            copyError: "复制到剪贴板失败:",

        presetModal: {
            title: "使用支援卡预设",
            searchPlaceholder: "搜索支援卡名称...",
            cardName: "支援卡名称",
            cardType: "类别",
            action: "操作",
            useButton: "使用",
            fetchingData: "正在获取预设数据...",
            fetchSuccess: "预设数据获取成功",
            fetchError: "获取预设数据失败",
            applySuccess: "已应用预设",
            applyError: "应用预设失败",
            noData: "没有找到匹配的数据"
        },

        },


        },
        // 应用管理
        appManagement: {
            title: "应用管理",
            install: "安装为应用",
            update: "更新应用",
            clearCache: "清理缓存",
            installSuccess: "网页已保存，可离线访问",
            updateSuccess: "网页更新成功",
            clearSuccess: "缓存清理成功",
            installError: "网页安装失败",
            updateError: "网页更新失败",
            clearError: "缓存清理失败"
        }
    };


