// 利用Wallet类发送ETH
// 由于playcode不支持ethers.Wallet.createRandom()函数，我们只能用VScode运行这一讲代码
import { ethers } from "ethers";
import configTmp from'../config.ts';
// 利用Alchemy的rpc节点连接以太坊测试网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
// const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';

// const ALCHEMY_GOERLI_URL = 'https://sepolia.infura.io/v3/cb0438cfc8d6409fbb32af11c44ecc25';

const ALCHEMY_GOERLI_URL = configTmp.URL.HOLESKY_URL;
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// // 利用私钥和provider创建wallet对象
const privateKey1 = configTmp.sepolia_test2.WALLET_PRIVATE
const wallet1 = new ethers.Wallet(privateKey1, provider)

const privateKey2 = configTmp.Sepolia1.WALLET_PRIVATE
//const privateKey2 = '0xd233dc6b2104a1acba05d63c01efc702986fe03da599dc0b2f21cc3854848889'
const wallet2 = new ethers.Wallet(privateKey2, provider)
// wallet2和wallet2_1是同一个钱包,因为私钥一样
//const wallet2_1 = new ethers.Wallet(privateKey2, provider)


// 从助记词创建wallet对象
// const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase)
// // 创建随机的wallet对象
// const wallet1 = ethers.Wallet.createRandom()
// const wallet1WithProvider = wallet1.connect(provider)
// 获取助记词从上面获取，生成的钱包地址是一样的
// const mnemonic = wallet1.mnemonic // 获取助记词


const main = async () => {

    // const wallet = ethers.Wallet.createRandom()
    // const wallet1WithProvider = wallet.connect(provider)
    // console.log(`钱包私钥: ${ wallet.privateKey}`)
    // return

    const wallet2Eth =  ethers.formatEther(await provider.getBalance(wallet2));
    if (wallet2Eth < 0.002) {
        console.log(`钱包1 ETH余额不足，请去水龙头领取一些测试网ETH,余额是：${wallet2Eth}`);
        return;
    }
    console.log(`钱包1: ${ethers.formatEther(await provider.getBalance(wallet1))} ETH`)
    console.log(`钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
    
    // 1. 获取钱包地址
    const address1 = await wallet1.getAddress()
    const address2 = await wallet2.getAddress() 
    
    console.log(`1. 获取钱包地址`);
    console.log(`钱包1地址: ${address1}`);
    console.log(`钱包2地址: ${address2}`);
    
    
    // // 2. 获取助记词
    // console.log(`\n2. 获取助记词`);
    // console.log(`钱包1助记词: ${wallet1.mnemonic.phrase}`);
    // // 注意：从private key生成的钱包没有助记词
    // console.log(`钱包2助记词: ${wallet2.mnemonic.phrase}`)

    // // 3. 获取私钥
    // console.log(`\n3. 获取私钥`);
    // console.log(`钱包1私钥: ${wallet1.privateKey}`)
    // console.log(`钱包2私钥: ${wallet2.privateKey}`)

    // 4. 获取链上发送交易次数    
    console.log(`\n4. 获取链上交易次数`);
    const txCount1 = await provider.getTransactionCount(wallet1)
    const txCount2 = await provider.getTransactionCount(wallet2)
    console.log(`钱包1发送交易次数: ${txCount1}`)
    console.log(`钱包2发送交易次数: ${txCount2}`)

    // 5. 发送ETH
    // 如果这个钱包没goerli测试网ETH了，去水龙头领一些，钱包地址: 0xe16C1623c1AA7D919cd2241d8b36d9E79C1Be2A2
    // 1. chainlink水龙头: https://faucets.chain.link/goerli
    // 2. paradigm水龙头: https://faucet.paradigm.xyz/
    console.log(`\n5. 发送ETH（测试网）`);
    // i. 打印交易前余额
    console.log(`i. 发送前余额`)
    console.log(`钱包1: ${ethers.formatEther(await provider.getBalance(wallet1))} ETH`)
    console.log(`钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
    // ii. 构造交易请求，参数：to为接收地址，value为ETH数额
    const tx = {
        to: address1,
        value: ethers.parseEther("0.01")
    }
    // iii. 发送交易，获得收据
    console.log(`\nii. 等待交易在区块链确认（需要几分钟）`)
    const receipt = await wallet2.sendTransaction(tx)
    await receipt.wait() // 等待链上确认交易
    console.log(receipt) // 打印交易详情
    // iv. 打印交易后余额
    console.log(`\niii. 发送后余额`)
    console.log(`钱包1: ${ethers.formatEther(await provider.getBalance(wallet1))} ETH`)
    console.log(`钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
}

main()
