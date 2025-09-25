// 检索事件的方法：
// const transferEvents = await contract.queryFilter("事件名", [起始区块高度，结束区块高度])
// 其中起始区块高度和结束区块高度为选填参数。

import { ethers } from "ethers";
import configTmp from'../config.ts';
// playcode免费版不能安装ethers，用这条命令，需要从网络上import包（把上面这行注释掉）
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = configTmp.URL.HOLESKY_URL;
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// WETH ABI，只包含我们关心的Transfer事件
const abiWETH = [
    "event Transfer(address indexed from, address indexed to, uint256  value)"
];

// 测试网合约地址
const addressWETH = '0x65f3682954E2B92ee56E06C235dF744cF0010f7a'
// 声明合约实例
const contract = new ethers.Contract(addressWETH, abiWETH, provider)

const main = async () => {

    // 获取过去10个区块内的Transfer事件
    console.log("\n1. 获取过去10个区块内的Transfer事件，并打印出1个");
    // 得到当前block
    const block = await provider.getBlockNumber()
    console.log(`当前区块高度: ${block}`);
    console.log(`打印事件详情:`);
    const transferEvents = await contract.queryFilter('Transfer', block - 1000, block)
    // 打印第1个Transfer事件
    console.log(transferEvents.length)

    // 解析Transfer事件的数据（变量在args中）
    console.log("\n2. 解析事件：")
    for (let i = 0; i < transferEvents.length; i++) {
        const amount = transferEvents[i].args["value"];
        console.log(`地址 ${transferEvents[i].args["from"]} 转账${amount} WETH 到地址 ${transferEvents[i].args["to"]}`)
    }
}

main()
