import json
from bs4 import BeautifulSoup
import re

def load_json_data(json_file):
    """加载JSON文件中的支援卡数据"""
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return {card['CardName']: card for card in data}
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Error loading JSON: {e}")
        return {}

def generate_js_data(json_data):
    """生成JavaScript数据文件"""
    js_content = """// 支援卡数据
const supportCardData = {
"""
    
    for card_name, card_info in json_data.items():
        js_content += f"""    "{card_name}": {{
        type: {card_info['type']},
        fs: {card_info['fs']},
        es: {card_info['es']},
        tr: {card_info['tr']},
        gat: {card_info['gat']},
        trap: {card_info['trap']},
        spd: {card_info['spd']},
        sta: {card_info['sta']},
        pow: {card_info['pow']},
        will: {card_info['will']},
        wit: {card_info['wit']},
        sp: {card_info['sp']},
        efs: {card_info['efs']},
        ees: {card_info['ees']},
        etr: {card_info['etr']},
        egat: {card_info['egat']},
        etrap: {card_info['etrap']},
        espd: {card_info['espd']},
        esta: {card_info['esta']},
        epow: {card_info['epow']},
        ewill: {card_info['ewill']},
        ewit: {card_info['ewit']},
        esp: {card_info['esp']}
    }},\n"""
    
    js_content += """};

// 生成链接URL的函数
function generateCardUrl(cardName) {
    const cardData = supportCardData[cardName];
    if (!cardData) return '';
    
    const baseUrl = 'https://sce.oload.dpdns.org/';
    const params = new URLSearchParams({
        card_name: cardName,
        type_static: cardData.type,
        friendship_award: cardData.fs,
        enthusiasm_award: cardData.es,
        training_award: cardData.tr,
        strike_point: cardData.gat,
        friendship_point: cardData.trap,
        speed_bonus: cardData.spd,
        stamina_bonus: cardData.sta,
        power_bonus: cardData.pow,
        willpower_bonus: cardData.will,
        wit_bonus: cardData.wit,
        sp_bonus: cardData.sp,
        enable_enum: false,
        enum_friendship_award: cardData.efs,
        enum_enthusiasm_award: cardData.ees,
        enum_training_award: cardData.etr,
        enum_friendship_point: cardData.egat,
        enum_strike_point: cardData.etrap,
        enum_speed_bonus: cardData.espd,
        enum_stamina_bonus: cardData.esta,
        enum_power_bonus: cardData.epow,
        enum_willpower_bonus: cardData.ewill,
        enum_wit_bonus: cardData.ewit,
        enum_sp_bonus: cardData.esp
    });
    
    return `${baseUrl}?${params.toString()}`;
}

// 修改链接点击事件的函数
function initializeCardLinks() {
    // 使用事件委托，处理所有卡片链接的点击
    document.querySelector('.CardSelect').addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        // 获取最近的tr元素
        const row = link.closest('tr');
        if (!row) return;
        
        // 获取日文卡名
        const jpNameCell = row.querySelector('td:nth-child(2)');
        if (!jpNameCell) return;
        
        const jpName = jpNameCell.textContent.trim();
        if (supportCardData[jpName]) {
            e.preventDefault();
            const url = generateCardUrl(jpName);
            if (url) {
                window.open(url, '_blank');
            }
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeCardLinks);
"""
    
    with open('card_data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

def process_html(html_file, json_data):
    """处理HTML文件"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    soup = BeautifulSoup(content, 'html.parser')
    
    # 检查并创建完整的HTML结构
    if not soup.html:
        new_html = BeautifulSoup('<!DOCTYPE html><html><head></head><body></body></html>', 'html.parser')
        new_html.body.append(soup)
        soup = new_html
    elif not soup.head:
        soup.html.insert(0, soup.new_tag('head'))
    
    # 添加JS文件引用
    script_tag = soup.new_tag('script')
    script_tag['src'] = 'card_data.js'
    soup.head.append(script_tag)

    # 找到所有支援卡行
    rows = soup.select('tr.divsort, tr[data-param1="SSR"]')
    
    for row in rows:
        # 移除关联角色的链接
        character_cell = row.select_one('td.visible-md.visible-sm.visible-lg a')
        if character_cell:
            character_cell.replace_with(character_cell.text)

        # 获取日文卡名以检查是否在json数据中
        jp_name_cell = row.select_one('td:nth-child(2) a')
        if jp_name_cell:
            jp_name = jp_name_cell.text.strip()
            # 如果卡片不在json数据中，移除整行
            if jp_name not in json_data:
                row.decompose()
            else:
                # 修改图标单元格中的所有链接
                icon_cell = row.select_one('td:first-child')
                if icon_cell:
                    for link in icon_cell.find_all('a'):
                        link['href'] = 'javascript:void(0);'
                        link['onclick'] = 'return false;'
                
                # 修改日文名和中文名的链接
                for name_link in row.select('td:nth-child(2) a, td:nth-child(3) a'):
                    name_link['href'] = 'javascript:void(0);'
                    name_link['onclick'] = 'return false;'

    # 保存修改后的HTML
    with open('filtered_' + html_file, 'w', encoding='utf-8') as f:
        f.write(str(soup))

if __name__ == "__main__":
    # 加载JSON数据
    json_data = load_json_data('1.json')
    
    # 生成JavaScript数据文件
    generate_js_data(json_data)
    
    # 处理HTML文件
    process_html('test.html', json_data)
    print("处理完成！新文件已保存为 filtered_test.html")