---
name: finance-news
description: 获取财经新闻资讯。使用场景：(1) 用户询问今日财经新闻 (2) 获取股市要闻、宏观经济、行业动态 (3) 查询特定财经频道的新闻。不需要API密钥，免费实时数据。
---

# 财经新闻获取

使用 `scripts/finance_news.py` 脚本获取免费财经新闻。

## 数据源

- **来源**: 东方财富网 (newsapi.eastmoney.com)
- **特点**: 免费、无需API钥匙、实时更新

## 使用方式

### 获取股市要闻 (默认)

```bash
python3 scripts/finance_news.py
```

### 获取指定频道新闻

```bash
python3 scripts/finance_news.py 宏观经济
python3 scripts/finance_news.py 股市要闻
python3 scripts/finance_news.py 行业新闻
```

### 指定页码和数量

```bash
python3 scripts/finance_news.py 股市要闻 2 10  # 第2页，每页10条
```

## 支持的新闻频道

| 频道代码 | 说明 |
|----------|------|
| 宏观经济 | 宏观政策、经济数据 |
| 股市要闻 | A股、基金、券商动态 |
| 行业新闻 | 各行业最新资讯 |
| 公司新闻 | 上市公司公告 |
| 基金新闻 | 基金行业动态 |
| 外汇新闻 | 外汇市场 |
| 债券新闻 | 债券市场 |
| 期货新闻 | 期货行情 |
| 港股新闻 | 港股动态 |
| 美股新闻 | 美股资讯 |

## 返回字段说明

| 字段 | 说明 |
|------|------|
| channel | 新闻频道 |
| count | 新闻数量 |
| news[].title | 新闻标题 |
| news[].digest | 新闻摘要 |
| news[].time | 发布时间 |
| news[].url | 原文链接 |
| news[].source | 来源 |

## 示例输出

```json
{
  "channel": "股市要闻",
  "count": 10,
  "news": [
    {
      "title": "A股三大指数收涨 创业板指涨超3%",
      "digest": "沪指涨0.65%，深证成指涨2.04%，创业板指涨3.04%",
      "time": "2026-03-10 15:00:41",
      "url": "http://finance.eastmoney.com/a/...",
      "source": "东方财富"
    }
  ]
}
```

## 注意事项

1. 数据来源为东方财富网，仅供参考
2. 部分新闻可能包含外部链接，需要进一步访问获取详情
3. 新闻更新频率较快，具体以实际获取为准
