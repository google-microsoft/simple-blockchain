const CryptoJS = require('crypto-js');


/**
 * 区块的数据结构主要由以下几个字段：
 */
class Block {
    constructor(height, previousHash, timestamp, data, hash) {
        //height : 当前这个区块的高度（所谓的高度，就是这个区块被挖出来的顺序，第一个，第二个...）
        this.height = height;
        // previousHash: 前一个区块的hash（你可以简单认为hash就是一个类似身份证号的唯一识别码）
        this.previousHash = previousHash + '';
        // timestamp: 即当前时间戳（用来指明当前高度的区块被挖出的时间）
        this.timestamp = timestamp;
        //data: 区块除了上述区块头中的字段之外，在区块体中需要存放这一小段时间内该链上的事件/交易，这些事件/交易放在data字段中，当该区块被添加到区块链上之后，这些事件、交易就跟着区块被写入了区块链，从此具有了可追溯，不可篡改等特性
        this.data = data;
        // hash：即当前区块将所有的区块头和区块体的数据打包后，计算出的一个唯一识别码。
        this.hash = hash + ''
    }
}

class BlockChain {

    /**
     * 如果指定在历史BlockChain上继续增加区块，则从本地存储中取出；否则默认创建新的区块链
     * @param { string } historyChain
     */
    constructor(historyChain) {
        this.blocks = [this.getGenesisBlock()]
    }


    /**
     * 创建区块链起源块, 此块是硬编码（取比特币高度:642022)
     */
    getGenesisBlock() {
        return new Block(0, '0', 1595490064640, 'GenesisBlock', '0000000000000000000d87bedef9550a014af9a3af74b791d84d049cc3ca85f4')
    }

    /**
     * 根据信息计算hash值
     */
    calcuteHash(height, previousHash, timestamp, data) {
        return CryptoJS.SHA256(height + previousHash + timestamp + data) + ''
    }

    /**
     * 得到区块链中最后一个块节点
     */
    getLatestBlock() {
        return this.blocks[this.blocks.length - 1]
    }

    /**
     * 判断新加入的块是否合法
     * @param {Block} newBlock
     * @param {Block} previousBlock
     */
    isValidNewBlock(newBlock, previousBlock) {
        if (!(newBlock instanceof Block) || !(previousBlock instanceof Block)) {
            return false
        }

        // 判断height
        if (newBlock.height !== previousBlock.height + 1) {
            return false
        }

        // 判断hash值
        if (newBlock.previousHash !== previousBlock.hash) {
            return false
        }

        // 计算新块的hash值是否符合规则
        if (this.calcuteHash(newBlock.height, newBlock.previousHash, newBlock.timestamp, newBlock.data) !== newBlock.hash) {
            return false
        }

        return true
    }

    /**
     * 向区块链添加新节点
     * @param {Block} newBlock
     */
    addBlock(newBlock) {
        if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
            this.blocks.push(newBlock)
            return true
        }
        return false
    }


    //打印该区块链的所有区块
    printBlockChain() {
        console.table(this.blocks);
    }

    //打印该区块链的最新区块
    printLastBlock() {
        console.table(this.blocks[this.blocks.length - 1]);
    }
}

/*-------------------------------测试----------------------------------*/

//生成模拟的区块体交易数据
function generateBlockData() {
    const dataList = ['Zhangjie is cool', 'Pengxiaohua is cool', 'ChenZiqiang is cool', 'Fangguojun is cool', 'Lulina is beautiful', 'Maqicheng is cool', 'Wangchuanshuo is cool', 'Linshaoyuan is beautiful', 'Lulina is beautiful'];
    return dataList[Math.random() * dataList.length >> 0];
}

function generateBlock(previousBlock) {
    let blockData = generateBlockData();
    const nextHeight = previousBlock.height + 1;
    const nextTimeStamp = new Date().getTime();
    //暂时忽略MerkelRoot和Nonce
    const nextHash = CryptoJS.SHA256(nextHeight + previousBlock.hash + nextTimeStamp + blockData) + '';
    return new Block(nextHeight, previousBlock.hash, nextTimeStamp, blockData, nextHash);
}

function mockBlocks() {
    //实例化一个区块链
    const blockChain = new BlockChain('testNet');
    blockChain.printLastBlock();

    setInterval(() => {
        let newBlock = generateBlock(blockChain.getLatestBlock());
        blockChain.addBlock(newBlock);
        blockChain.printBlockChain();
    }, 2000);

}

//开启模拟区块
mockBlocks();
