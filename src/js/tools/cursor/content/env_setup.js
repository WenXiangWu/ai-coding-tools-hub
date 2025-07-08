/**
 * Cursor环境安装指南
 */
export default {
    title: '环境安装',
    content: `
        <h3>Cursor环境安装指南</h3>
        
        <h4>系统要求</h4>
        <ul>
            <li>操作系统：Windows 10/11, macOS 10.15+, Linux</li>
            <li>内存：最低4GB，推荐8GB以上</li>
            <li>硬盘空间：至少1GB可用空间</li>
            <li>网络：稳定的互联网连接</li>
        </ul>

        <h4>安装步骤</h4>
        <ol>
            <li>
                <strong>下载安装包</strong>
                <p>访问<a href="https://cursor.sh">Cursor官网</a>，下载适合你系统的安装包。</p>
            </li>
            <li>
                <strong>运行安装程序</strong>
                <ul>
                    <li>Windows: 运行.exe安装文件</li>
                    <li>macOS: 打开.dmg文件，将Cursor拖入Applications文件夹</li>
                    <li>Linux: 解压.tar.gz文件或使用.deb/.rpm包安装</li>
                </ul>
            </li>
            <li>
                <strong>初始配置</strong>
                <p>首次启动时，需要：</p>
                <ul>
                    <li>登录或注册Cursor账号</li>
                    <li>选择你喜欢的主题</li>
                    <li>配置AI模型选项</li>
                </ul>
            </li>
        </ol>

        <h4>常见问题</h4>
        <details>
            <summary>安装后无法启动</summary>
            <p>检查：</p>
            <ul>
                <li>系统是否满足最低要求</li>
                <li>是否有管理员权限</li>
                <li>防火墙设置是否允许Cursor访问网络</li>
            </ul>
        </details>

        <details>
            <summary>AI功能无法使用</summary>
            <p>确保：</p>
            <ul>
                <li>网络连接正常</li>
                <li>已正确登录账号</li>
                <li>如果使用代理，检查代理设置</li>
            </ul>
        </details>
    `
}; 