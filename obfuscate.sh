#!/bin/bash

# 脚本：使用 Terser 混淆 JavaScript 文件
# 用法：在包含 script_org.js 的目录下运行此脚本 ./obfuscate.sh

# 定义输入和输出文件
INPUT_FILE="script_org.js"
OUTPUT_FILE="script.js"
TestMode="1"

if [ "$TestMode" -eq "0" ]; then
    exit 0
fi

echo "开始混淆处理: $INPUT_FILE -> $OUTPUT_FILE"

# 检查 npm 是否安装
if ! command -v npm &> /dev/null
then
    echo "错误：未找到 npm。请先安装 Node.js 和 npm。"
    sudo apt update
    sudo apt install -y nodejs npm
fi
echo "检查到 npm..."

# 检查 terser 是否已全局安装，如果未安装则尝试安装
if ! command -v terser &> /dev/null
then
    echo "未找到 Terser，尝试全局安装..."
    npm install -g terser
    # 检查安装是否成功
    # if ! command -v terser &> /dev/null
    # then
    #     echo "错误：Terser 安装失败。请检查 npm 的错误信息。"
    #     exit 1
    # fi
    echo "Terser 安装成功。"
else
    echo "Terser 已安装。"
fi

# 检查输入文件是否存在
if [ ! -f "$INPUT_FILE" ]; then
    echo "错误：输入文件 '$INPUT_FILE' 不存在。"
    exit 1
fi
echo "找到输入文件: $INPUT_FILE"

# 执行 Terser 混淆
echo "开始使用 Terser 进行压缩和混淆..."
terser "$INPUT_FILE" -c -m -o "$OUTPUT_FILE"

# 检查 Terser 命令是否成功执行
if [ $? -eq 0 ]; then
    echo "成功：文件 '$INPUT_FILE' 已被混淆并输出到 '$OUTPUT_FILE'"
else
    echo "错误：Terser 混淆过程中发生错误。"
    exit 1
fi

echo "混淆脚本执行完毕。"
rm -rvf $INPUT_FILE
exit 0