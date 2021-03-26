import QrcodeTerminal from 'qrcode-terminal'

/**
 * 扫描登录，显示二维码
 */

const onScan = async (qrcode, status) => {
    QrcodeTerminal.generate(qrcode, {
        small: true
    })
}

export default onScan