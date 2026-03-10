# 📈 stock-quote - 实时股市行情技能

## 功能特性

- ✅ **A 股支持** - 上交所、深交所全部股票
- ✅ **港股支持** - 港交所全部股票
- ⚠️ **美股支持** - 需要配置 API Key（见下方说明）
- 📊 **实时行情** - 当前价、涨跌、今开、最高、最低、成交量
- 🎯 **智能识别** - 支持股票代码和常用股票名称

## 快速开始

### 安装

技能已位于：`~/.openclaw/workspace/skills/stock-quote`

在 OpenClaw 中注册技能（具体命令参考 OpenClaw 文档）：

```bash
openclaw skills install ~/.openclaw/workspace/skills/stock-quote
```

### 使用方法

直接在聊天中发送：

```
腾讯股价
600519
AAPL
贵州茅台行情
/stock 00700
```

### 支持格式

| 市场 | 格式 | 示例 |
|------|------|------|
| A 股 | 6 位数字 | 600519, 000001, 300750 |
| 港股 | 5 位数字 | 00700, 09988, 03690 |
| 美股 | 股票代码 | AAPL, TSLA, GOOGL |
| 名称 | 中文名称 | 腾讯、茅台、特斯拉 |

### 内置股票名称

```
腾讯、腾讯控股、阿里巴巴、阿里、茅台、贵州茅台、
宁德时代、特斯拉、苹果、英伟达、微软、谷歌、
亚马逊、美团、小米、百度、拼多多、网易、京东、
五粮液、招商银行、平安、中国平安、比亚迪、顺丰
```

## 美股 API 配置（可选）

由于免费美股数据源有限，如需完整美股支持：

### 方案 1: Finnhub（推荐）

1. 访问 https://finnhub.io 注册免费账号
2. 获取 API Key
3. 编辑 `index.js`，将 `YOUR_API_KEY` 替换为你的 key

### 方案 2: Alpha Vantage

1. 访问 https://www.alphavantage.co 注册
2. 获取免费 API Key（每分钟 5 次请求）
3. 修改代码使用 Alpha Vantage API

## 数据来源

- **A 股/港股**: 腾讯财经 API (http://qt.gtimg.cn)
- **美股**: Finnhub / Alpha Vantage（需配置）

## 注意事项

- ⚠️ 免费数据源可能有 15 分钟延迟
- ⚠️ API 有速率限制，请勿频繁请求
- ⚠️ 网络问题可能导致暂时无法获取数据

## 测试

```bash
cd ~/.openclaw/workspace/skills/stock-quote
node test.js
```

## 扩展股票名称

编辑 `index.js` 中的 `STOCK_SYMBOLS` 对象：

```javascript
const STOCK_SYMBOLS = {
  '腾讯': '00700',
  '你的股票名': '股票代码',
  // ...
};
```

## 故障排除

### 收不到数据

1. 检查网络连接
2. 确认股票代码正确
3. 查看 OpenClaw 日志：`openclaw logs --follow`

### 美股数据不可用

配置 Finnhub API Key 或暂时使用 A 股/港股功能。

## License

MIT
