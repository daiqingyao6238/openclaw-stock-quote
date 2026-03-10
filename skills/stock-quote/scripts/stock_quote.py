#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
股票实时行情获取脚本
数据源: 腾讯财经 (免费实时)
"""

import sys
import urllib.request
import json

def get_stock_quote(stock_code):
    """
    获取股票实时行情
    
    参数:
        stock_code: 股票代码，如 'sh600519' (上海) 或 'sz000001' (深圳)
    
    返回:
        dict: 股票行情数据
    """
    # 确保代码格式正确
    if not stock_code.startswith(('sh', 'sz', 'hk')):
        # 自动判断市场
        if stock_code.startswith('6'):
            stock_code = 'sh' + stock_code
        elif stock_code.startswith(('0', '3')):
            stock_code = 'sz' + stock_code
        else:
            # 可能是港股，补充0到5位
            stock_code = 'hk' + stock_code.zfill(5)
    
    url = f"https://qt.gtimg.cn/q={stock_code}"
    
    try:
        # 设置请求头模拟浏览器
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://finance.qq.com/'
            }
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read().decode('gbk', errors='ignore')
            
        if not data or data == 'null':
            return {"error": "未找到股票数据"}
        
        # 解析返回数据
        # 格式: v_sh600519="0~平安银行~000001~12.50~12.30~12.55~12.30~..."
        if '=' not in data:
            return {"error": "数据解析失败"}
        
        parts = data.split('=')
        if len(parts) < 2:
            return {"error": "数据格式错误"}
        
        quote_data = parts[1].strip().strip('"').split('~')
        
        if len(quote_data) < 10:
            return {"error": "数据不完整"}
        
        # 字段说明 (腾讯接口):
        # 0: 未知, 1: 股票名称, 2: 股票代码, 3: 当前价格, 4: 昨收, 5: 今日开盘
        # 6: 成交量(手), 7: 最高, 8: 最低, ...
        
        result = {
            "name": quote_data[1] if quote_data[1] else stock_code,
            "code": quote_data[2] if quote_data[2] else stock_code,
            "current_price": float(quote_data[3]) if quote_data[3] else None,
            "yesterday_close": float(quote_data[4]) if quote_data[4] else None,
            "open": float(quote_data[5]) if quote_data[5] else None,
            "volume": int(float(quote_data[6])) if quote_data[6] else None,
            "high": float(quote_data[33]) if len(quote_data) > 33 and quote_data[33] else None,
            "low": float(quote_data[34]) if len(quote_data) > 34 and quote_data[34] else None,
        }
        
        # 计算涨跌幅
        if result["current_price"] and result["yesterday_close"]:
            change = result["current_price"] - result["yesterday_close"]
            pct_change = (change / result["yesterday_close"]) * 100
            result["change"] = round(change, 2)
            result["pct_change"] = round(pct_change, 2)
        
        return result
        
    except urllib.error.URLError as e:
        return {"error": f"网络错误: {str(e)}"}
    except Exception as e:
        return {"error": f"解析错误: {str(e)}"}


def normalize_code(stock_code):
    """标准化股票代码格式"""
    code = stock_code.strip().lower()
    if not code.startswith(('sh', 'sz', 'hk')):
        # 自动判断市场
        if code.startswith('6'):
            code = 'sh' + code
        elif code.startswith(('0', '3')):
            code = 'sz' + code
        elif len(code) <= 5 and code.isdigit():
            code = 'hk' + code.zfill(5)  # 港股5位代码
    return code


def get_multiple_stocks(stock_codes):
    """批量获取多只股票行情"""
    if not stock_codes:
        return []
    
    # 标准化代码格式
    normalized_codes = [normalize_code(c) for c in stock_codes]
    
    # 构建批量查询 URL (用逗号分隔)
    codes_param = ','.join(normalized_codes)
    url = f"https://qt.gtimg.cn/q={codes_param}"
    
    try:
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://finance.qq.com/'
            }
        )
        
        with urllib.request.urlopen(req, timeout=15) as response:
            data = response.read().decode('gbk', errors='ignore')
        
        results = []
        # 按股票分割数据
        for item in data.split(';'):
            if '=' in item and item.strip():
                parts = item.split('=')
                code = parts[0].split('_')[-1] if '_' in parts[0] else parts[0]
                quote_data = parts[1].strip().strip('"').split('~')
                
                if len(quote_data) > 34:
                    result = {
                        "name": quote_data[1] if quote_data[1] else code,
                        "code": quote_data[2] if quote_data[2] else code,
                        "current_price": float(quote_data[3]) if quote_data[3] else None,
                        "yesterday_close": float(quote_data[4]) if quote_data[4] else None,
                        "open": float(quote_data[5]) if quote_data[5] else None,
                        "volume": int(float(quote_data[6])) if quote_data[6] else None,
                        "high": float(quote_data[33]) if quote_data[33] else None,
                        "low": float(quote_data[34]) if quote_data[34] else None,
                    }
                    
                    if result["current_price"] and result["yesterday_close"]:
                        change = result["current_price"] - result["yesterday_close"]
                        pct_change = (change / result["yesterday_close"]) * 100
                        result["change"] = round(change, 2)
                        result["pct_change"] = round(pct_change, 2)
                    
                    results.append(result)
        
        return results
        
    except Exception as e:
        return [{"error": str(e)}]


if __name__ == "__main__":
    # 命令行测试
    if len(sys.argv) > 1:
        codes = sys.argv[1:]
        if len(codes) == 1:
            result = get_stock_quote(codes[0])
        else:
            result = get_multiple_stocks(codes)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        # 默认测试茅台
        result = get_stock_quote('600519')
        print(json.dumps(result, ensure_ascii=False, indent=2))
