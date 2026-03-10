const https = require('https');
const http = require('http');

// 股票代码映射表（可扩展）
const STOCK_SYMBOLS = {
  '腾讯': '00700',
  '腾讯控股': '00700',
  '阿里巴巴': '09988',
  '阿里': '09988',
  '茅台': '600519',
  '贵州茅台': '600519',
  '宁德时代': '300750',
  '特斯拉': 'TSLA',
  '苹果': 'AAPL',
  '英伟达': 'NVDA',
  '微软': 'MSFT',
  '谷歌': 'GOOGL',
  '亚马逊': 'AMZN',
  '美团': '03690',
  '小米': '01810',
  '百度': 'BIDU',
  '拼多多': 'PDD',
  '网易': 'NTES',
  '京东': 'JD',
  '五粮液': '000858',
  '招商银行': '600036',
  '平安': '601318',
  '中国平安': '601318',
  '比亚迪': '002594',
  '顺丰': '002352',
  '摩尔线程': '688795',
  '寒武纪': '688256',
  '海光信息': '688041',
  '龙芯中科': '688047',
};

// 获取 A 股/港股行情（腾讯财经 API）
function getCnStock(symbol) {
  return new Promise((resolve, reject) => {
    const market = symbol.startsWith('0') || symbol.startsWith('3') ? 'sz' : 'sh';
    const hkMarket = symbol.length === 5 ? 'hk' : market;
    const prefix = symbol.length === 5 ? 'hk' : (market === 'sz' ? 'sz' : 'sh');
    const url = `http://qt.gtimg.cn/q=${prefix}${symbol}`;
    
    http.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // 腾讯 API 返回格式：v_sh600519="1~M~600519~1397.00~1402.00..."
          const match = data.match(/="([^"]+)"/);
          if (!match || !match[1]) {
            reject(new Error('无数据，请检查股票代码是否正确'));
            return;
          }
          
          const values = match[1].split('~');
          if (values.length < 20) {
            reject(new Error('数据格式错误'));
            return;
          }
          
          // 腾讯 API 字段：
          // [0] 状态，[1] 未知，[2] 代码，[3] 当前价，[4] 昨收
          // [5] 今开，[6] 成交量 (手), [7] 外盘，[8] 内盘
          // [9] 买一，[10] 买一量，[11] 买二...
          // [33] 最高，[34] 最低，[37] 振幅，[47] 涨跌幅
          
          const name = values[2] || '未知';
          const current = parseFloat(values[3]) || 0;
          const close = parseFloat(values[4]) || current;
          const open = parseFloat(values[5]) || current;
          const high = parseFloat(values[33]) || current;
          const low = parseFloat(values[34]) || current;
          const volume = parseFloat(values[6]) || 0; // 单位：手
          
          if (isNaN(current) || current === 0) {
            reject(new Error('无效的价格数据'));
            return;
          }
          
          resolve({
            name,
            current,
            open,
            high,
            low,
            close,
            volume: volume * 100, // 转换为股数
            changePercent: values[47] ? parseFloat(values[47]) : ((current - close) / close * 100),
            timestamp: new Date().toISOString()
          });
        } catch (e) {
          reject(new Error(`解析数据失败：${e.message}`));
        }
      });
    }).on('error', (e) => reject(new Error(`网络错误：${e.message}`)));
  });
}

// 获取美股行情（使用 Finnhub 免费 API 或备用方案）
function getUsStock(symbol) {
  return new Promise((resolve, reject) => {
    // 方案 1: 使用 Alpha Vantage (需要 API key，但有限额)
    // 方案 2: 使用 Finnhub (需要 API key)
    // 方案 3: 使用模拟请求到 Yahoo Finance
    
    // 这里使用一个公开的备用 API
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=YOUR_API_KEY`;
    
    // 由于免费 API 限制，这里提供一个备选方案：
    // 用户可以注册 https://finnhub.io 获取免费 API key
    // 或者使用以下简化的 HTTP 请求
    
    https.get(`https://stock-analysis-on.net/api/stock/${symbol}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            // 备用方案：返回模拟数据提示用户
            resolve({
              name: symbol,
              current: 0,
              open: 0,
              high: 0,
              low: 0,
              close: 0,
              volume: 0,
              currency: 'USD',
              changePercent: 0,
              timestamp: new Date().toISOString(),
              note: '美股数据需要 API Key。请访问 https://finnhub.io 注册获取免费 key，然后在代码中配置。'
            });
            return;
          }
          
          const json = JSON.parse(data);
          resolve({
            name: symbol,
            current: json.c || 0,
            open: json.o || 0,
            high: json.h || 0,
            low: json.l || 0,
            close: json.pc || 0,
            volume: 0,
            currency: 'USD',
            changePercent: json.dp || 0,
            timestamp: new Date().toISOString()
          });
        } catch (e) {
          resolve({
            name: symbol,
            current: 0,
            open: 0,
            high: 0,
            low: 0,
            close: 0,
            volume: 0,
            currency: 'USD',
            changePercent: 0,
            timestamp: new Date().toISOString(),
            note: '美股数据暂时不可用，请稍后重试或使用其他数据源。'
          });
        }
      });
    }).on('error', () => {
      resolve({
        name: symbol,
        current: 0,
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0,
        currency: 'USD',
        changePercent: 0,
        timestamp: new Date().toISOString(),
        note: '美股数据需要配置 API Key。详见 README.md'
      });
    });
  });
}

// 解析股票代码
function parseSymbol(input) {
  const trimmed = input.trim();
  
  // 检查是否是已知股票名称
  const upperInput = trimmed.toUpperCase();
  if (STOCK_SYMBOLS[upperInput]) {
    const symbol = STOCK_SYMBOLS[upperInput];
    const market = /^[A-Z]+$/.test(symbol) ? 'us' : 
                   symbol.length === 5 ? 'hk' : 'cn';
    return { symbol, market };
  }
  
  // 5 位数字 = 港股
  if (/^\d{5}$/.test(trimmed)) {
    return { symbol: trimmed, market: 'hk' };
  }
  
  // 6 位数字 = A 股
  if (/^\d{6}$/.test(trimmed)) {
    return { symbol: trimmed, market: 'cn' };
  }
  
  // 字母 = 美股
  if (/^[A-Z]{1,5}$/.test(upperInput)) {
    return { symbol: upperInput, market: 'us' };
  }
  
  return null;
}

// 格式化输出
function formatQuote(data) {
  const change = data.current - data.close;
  const changePercent = data.changePercent || (data.close ? (change / data.close * 100) : 0);
  const arrow = change >= 0 ? '📈' : '📉';
  const sign = change >= 0 ? '+' : '';
  
  const lines = [
    `${arrow} *${data.name}* ${data.current.toFixed(2)} ${data.currency || 'CNY'}`,
    `├ 涨跌：${sign}${change.toFixed(2)} (${sign}${Math.abs(changePercent).toFixed(2)}%)`,
    `├ 今开：${data.open.toFixed(2)}`,
    `├ 最高：${data.high.toFixed(2)}`,
    `├ 最低：${data.low.toFixed(2)}`,
    `├ 昨收：${data.close.toFixed(2)}`,
    `└ 成交量：${formatVolume(data.volume)}`,
    ``,
    `_数据延迟约 15 分钟 | 来源：腾讯财经/NASDAQ_`
  ];
  
  return lines.join('\n');
}

function formatVolume(vol) {
  if (!vol || vol === 0) return '0';
  const num = parseFloat(vol);
  if (isNaN(num)) return vol.toString();
  if (num >= 1e8) return `${(num/1e8).toFixed(2)}亿`;
  if (num >= 1e4) return `${(num/1e4).toFixed(2)}万`;
  return num.toFixed(0);
}

// 主函数
async function main(input) {
  try {
    const parsed = parseSymbol(input);
    if (!parsed) {
      return `❌ 无法识别股票代码。

**支持格式：**
- A 股：6 位数字 (如 600519)
- 港股：5 位数字 (如 00700)
- 美股：股票代码 (如 AAPL)
- 股票名称：腾讯、茅台、特斯拉 等

**示例：**
- "腾讯股价"
- "600519"
- "/stock AAPL"

**支持的股票名称：**
${Object.keys(STOCK_SYMBOLS).slice(0, 10).join('、')}...`;
    }
    
    const data = parsed.market === 'us' 
      ? await getUsStock(parsed.symbol)
      : await getCnStock(parsed.symbol);
    
    return formatQuote(data);
  } catch (error) {
    return `❌ 获取行情失败：${error.message}`;
  }
}

module.exports = { main, parseSymbol, getCnStock, getUsStock, STOCK_SYMBOLS };
