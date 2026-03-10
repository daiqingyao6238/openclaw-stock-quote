#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
财经新闻获取脚本
数据源: 东方财富 (免费实时)
"""

import sys
import urllib.request
import json
import urllib.parse
from datetime import datetime

# 新闻频道配置
CHANNELS = {
    "宏观经济": {"code": "101", "name": "宏观"},
    "股市要闻": {"code": "102", "name": "股市"},
    "行业新闻": {"code": "103", "name": "行业"},
    "公司新闻": {"code": "104", "name": "公司"},
    "基金新闻": {"code": "106", "name": "基金"},
    "外汇新闻": {"code": "105", "name": "外汇"},
    "债券新闻": {"code": "107", "name": "债券"},
    "期货新闻": {"code": "108", "name": "期货"},
    "港股新闻": {"code": "109", "name": "港股"},
    "美股新闻": {"code": "110", "name": "美股"},
}


def get_news(channel="股市要闻", page=1, page_size=10):
    """
    获取财经新闻
    
    参数:
        channel: 新闻频道 (见 CHANNELS)
        page: 页码
        page_size: 每页数量
    
    返回:
        list: 新闻列表
    """
    channel_info = CHANNELS.get(channel)
    if not channel_info:
        return {"error": f"不支持的频道: {channel}，可用频道: {list(CHANNELS.keys())}"}
    
    code = channel_info["code"]
    url = f"https://newsapi.eastmoney.com/kuaixun/v1/getlist_{code}_ajaxResult_{page_size}_{page}_.html"
    
    try:
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://finance.eastmoney.com/'
            }
        )
        
        with urllib.request.urlopen(req, timeout=15) as response:
            data = response.read().decode('utf-8', errors='ignore')
        
        # 解析 JSONP 响应
        if not data.startswith('var ajaxResult='):
            return {"error": "数据格式错误"}
        
        json_str = data.replace('var ajaxResult=', '').strip()
        result = json.loads(json_str)
        
        if result.get("rc") != 1:
            return {"error": result.get("me", "获取失败")}
        
        news_list = result.get("LivesList", [])
        
        items = []
        for item in news_list:
            items.append({
                "title": item.get("title", ""),
                "digest": item.get("digest", ""),
                "time": item.get("showtime", ""),
                "url": item.get("url_w", ""),
                "source": "东方财富"
            })
        
        return {
            "channel": channel,
            "channel_name": channel_info["name"],
            "count": len(items),
            "news": items
        }
        
    except urllib.error.URLError as e:
        return {"error": f"网络错误: {str(e)}"}
    except Exception as e:
        return {"error": f"解析错误: {str(e)}"}


def get_stock_news(page=1, page_size=10):
    """获取股市要闻"""
    return get_news("股市要闻", page, page_size)


def get_macro_news(page=1, page_size=10):
    """获取宏观经济新闻"""
    return get_news("宏观经济", page, page_size)


def get_industry_news(page=1, page_size=10):
    """获取行业新闻"""
    return get_news("行业新闻", page, page_size)


def get_all_channels():
    """获取所有可用频道"""
    return list(CHANNELS.keys())


if __name__ == "__main__":
    # 命令行测试
    if len(sys.argv) > 1:
        channel = sys.argv[1]
        page = int(sys.argv[2]) if len(sys.argv) > 2 else 1
        size = int(sys.argv[3]) if len(sys.argv) > 3 else 10
        result = get_news(channel, page, size)
    else:
        # 默认股市要闻
        result = get_stock_news()
    
    print(json.dumps(result, ensure_ascii=False, indent=2))
