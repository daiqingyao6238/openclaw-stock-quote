const { main } = require('./index');

async function test() {
  console.log('=== 测试茅台 (600519) ===');
  try {
    const result1 = await main('600519');
    console.log(result1);
  } catch (e) {
    console.log(`错误：${e.message}`);
  }
  
  console.log('\n=== 测试腾讯 (00700) ===');
  try {
    const result2 = await main('00700');
    console.log(result2);
  } catch (e) {
    console.log(`错误：${e.message}`);
  }
  
  console.log('\n=== 测试苹果 (AAPL) ===');
  try {
    const result3 = await main('AAPL');
    console.log(result3);
  } catch (e) {
    console.log(`错误：${e.message}`);
  }
  
  console.log('\n=== 测试股票名称 (腾讯) ===');
  try {
    const result4 = await main('腾讯');
    console.log(result4);
  } catch (e) {
    console.log(`错误：${e.message}`);
  }
  
  console.log('\n=== 测试无效输入 ===');
  try {
    const result5 = await main('invalid');
    console.log(result5);
  } catch (e) {
    console.log(`错误：${e.message}`);
  }
}

test().catch(console.error);
