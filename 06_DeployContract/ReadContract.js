// 声明只读合约的规则：
// 参数分别为合约地址`address`，合约ABI `abi`，Provider变量`provider`
// const contract = new ethers.Contract(`address`, `abi`, `provider`);

import { ethers } from "ethers";
import configTmp from'../config.ts';
// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
//const ALCHEMY_MAINNET_URL = 'https://mainnet.infura.io/v3/cb0438cfc8d6409fbb32af11c44ecc25';
const ALCHEMY_MAINNET_URL = configTmp.URL.INFURA_SEPOLIA_URL + configTmp.URL.key;
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
// WETH合约地址和ABI（IERC20接口）
const addressWETH = '0x65f3682954E2B92ee56E06C235dF744cF0010f7a';
const abiERC20 = [
    "constructor(string memory name_, string memory symbol_)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function mint(uint amount) external",
];
const contractWETH = new ethers.Contract(addressWETH, abiERC20, provider)


const main = async () => {
    // 1. 读取WETH合约的链上信息（WETH abi）
    const nameWETH = await contractWETH.name()
    const symbolWETH = await contractWETH.symbol()
    const totalSupplyWETH = await contractWETH.totalSupply()
    console.log("\n1. 读取WETH合约信息")
    console.log(`合约地址: ${addressWETH}`)
    console.log(`名称: ${nameWETH}`)
    console.log(`代号: ${symbolWETH}`)
    console.log(`总供给: ${totalSupplyWETH}`)

    console.log(`Sepolia1持仓: ${await contractWETH.balanceOf(configTmp.Sepolia1.WALLET_address)}\n`)
    console.log(`sepolia_test2持仓: ${await contractWETH.balanceOf(configTmp.sepolia_test2.WALLET1_address)}\n`)

    // 2. 读取DAI合约的链上信息（IERC20接口合约）
    console.log("\n3. 调用transfer()函数，给Sepolia1转账100代币")
    const wallet1 = new ethers.Wallet(configTmp.sepolia_test2.WALLET_PRIVATE, provider);
    const contractTmp = contractWETH.connect(wallet1);

    // let tx1= await contractTmp.mint(ethers.parseEther("1000000"))
    // console.log("等待交易上链")
    // await tx1.wait()

    const tx = await contractTmp.transfer(configTmp.Sepolia1.WALLET_address, ethers.parseUnits("100", 18))
    console.log("等待交易上链")
    await tx.wait()
    console.log(`Sepolia1持仓: ${await contractWETH.balanceOf(configTmp.Sepolia1.WALLET_address)}\n`)
    console.log(`sepolia_test2持仓: ${await contractWETH.balanceOf(configTmp.sepolia_test2.WALLET1_address)}\n`)

}

main()
