# 🐙 OpenClaw Skills

> 本仓库存放由 OpenClaw AI 助手生成的技能 (Skills)

## 简介

这些技能 (Skills) 是为 OpenClaw 平台开发的扩展模块，每个技能都针对特定功能场景，可以增强 OpenClaw 的能力。

## 技能列表

### 📈 stock-quote - 实时股票行情

获取中国 A 股、港股、美股的实时行情数据。

**数据源**: 腾讯财经（免费，无需 API Key）

**使用方式**:
```bash
python3 skills/stock-quote/scripts/stock_quote.py 600519    # 茅台
python3 skills/stock-quote/scripts/stock_quote.py 00700    # 腾讯
python3 skills/stock-quote/scripts/stock_quote.py 600519 000001 700  # 批量查询
```

**支持市场**:
| 市场 | 代码示例 |
|------|----------|
| 上海A股 | 600519 |
| 深圳A股 | 000001 |
| 港股 | 00700 |

---

### 📰 finance-news - 财经新闻

获取东方财富网的实时财经新闻资讯。

**数据源**: 东方财富网（免费，无需 API Key）

**使用方式**:
```bash
# 默认股市要闻
python3 skills/finance-news/scripts/finance_news.py

# 指定频道
python3 skills/finance-news/scripts/finance_news.py 宏观经济
python3 skills/finance-news/scripts/finance_news.py 行业新闻
```

**支持频道**: 股市要闻、宏观经济、行业新闻、公司新闻、基金新闻、外汇、债券、期货、港股、美股

---

## 安装方式

### 方式一：直接使用 Python 脚本

每个技能的 `scripts/` 文件夹下都有独立的 Python 脚本，直接运行即可：

```bash
python3 skills/<skill-name>/scripts/<script>.py [参数]
```

### 方式二：安装为 OpenClaw 技能

```bash
# 具体安装命令请参考 OpenClaw 官方文档
openclaw skills install ./skills/<skill-name>
```

## 环境要求

- Python 3.7+
- 网络访问权限（用于获取实时数据）

## 注意事项

1. 所有数据仅供本人参考，不构成投资建议
2. 免费数据源可能有延迟或限制，请合理使用
3. 请遵守数据源的使用条款

## 后续计划

更多技能正在开发中...

- [ ] 天气预报
- [ ] 货币汇率
- [ ] 加密货币行情
- [ ] 限行尾号查询
- [ ] 更多...

## License

MIT
