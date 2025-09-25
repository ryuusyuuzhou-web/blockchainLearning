import { ethers } from "ethers";
import config from "../config.ts";
// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = config.URL.HOLESKY_URL_WSS;
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_URL);

// 合约地址
const addressUSDT = config.ERC20.HOLESKY_WETH;
// 交易所地址
const accountBinance = config.Sepolia1.WALLET_address
// 构建ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)",
  "function balanceOf(address) public view returns(uint)",
];
// 构建合约对象
const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);


(async () => {
  try {
    // 1. 读取币安热钱包USDT余额
    console.log("\n1. 读取币安热钱包USDT余额")
    const balanceUSDT = await contractUSDT.balanceOf(accountBinance)
    console.log(`USDT余额: ${ethers.formatUnits(balanceUSDT,6)}\n`)

    // 2. 创建过滤器，监听转移USDT进交易所
    console.log("\n2. 创建过滤器，监听USDT转进交易所")
    let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
    console.log("过滤器详情：")
    console.log(filterBinanceIn);
    contractUSDT.on(filterBinanceIn, (res) => {
      console.log('---------监听USDT进入交易所--------');
      console.log(
        `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
      )
    })

    // 3. 创建过滤器，监听交易所转出USDT
    let filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance);
    console.log("\n3. 创建过滤器，监听USDT转出交易所")
    console.log("过滤器详情：")
    console.log(filterToBinanceOut);
    contractUSDT.on(filterToBinanceOut, (res) => {
      console.log('---------监听USDT转出交易所--------');
      console.log(
        `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
      )
    }
    );
  } catch (e) {
    console.log(e);
  }
})()