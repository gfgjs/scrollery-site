# scrollery-site

[Scrollery](https://scrollery.app) 官网静态源码。The static source of the Scrollery website.

## 形态

- **纯静态 h5**:HTML + 原生 CSS/JS,零依赖、零构建、零跟踪脚本、零第三方资源。
- **页面**:`index.html`(落地页)、`faq.html`、`privacy.html`、`404.html`(Cloudflare Pages 自动接管 404)。
- **双主题**(纸/墨,跟随系统 + 手动)与**中英双语**(跟随浏览器 + 手动):整页双语共存,按 `<html data-lang>` 显隐;偏好存 localStorage,由 `assets/boot.js` 在首帧前恢复(防 FOUC)。
- **严格 CSP**(`_headers`):`script-src 'self'; style-src 'self'`——页面内**不允许** inline `<script>` 与 `style=""` 属性(JSON-LD 数据块除外,不受执行限制)。
- **无后端**:展示、mailto 获客与静态分发均不需要;若将来需要表单/计数等,再按需以 Cloudflare Pages Functions 渐进补充。

## 资产再生

`assets/` 里的位图由 `assets-src/` 渲染生成(headless Edge 截图;GDI+ 方案在本机因脚本被降入 ConstrainedLanguage 不可用):

```powershell
# og 分享图 1200×630
& msedge --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
  --screenshot="assets\og.png" --window-size=1200,630 "file:///<abs>/assets-src/og.html"
# 图标(icon-512/192 透明角;apple-touch 满幅 C3402B 底)
#   --default-background-color=00000000 / C3402BFF + --window-size=512,512 / 192,192 / 180,180
```

界面截图来自应用主仓 `.screenshots/theme-matrix/`(capture 脚本产物,**示例图库合成内容**,页面上已标注),用 ffmpeg 转 webp:

```powershell
ffmpeg -i gallery-ink.png -frames:v 1 -c:v libwebp -quality 88 assets\shots\hero-gallery-ink.webp
```

## 部署

Cloudflare Pages(Git 集成,无构建步骤,输出目录 `/`),自定义域 `scrollery.app`。**push 到 `main` 即自动发布**。

## 文案纪律

- 对外宣称须与已实测能力对齐——性能表述用「数十万张」量级(可加「面向十万~百万张设计」);未落地能力只出现在「路线图」措辞中,不作为现有功能宣称。
- 不公开定价与商业模式细节;不承诺发布日期;商标不称 ®(FTO 在途)。
- 截图必须标注「示例图库」;应用主仓 `src-tauri/icons/` 目前是 Tauri 占位图,**禁止**用作品牌素材。

## 版权

本仓内容(品牌文案与标识)版权所有,**不**适用应用主仓的开源许可。应用核心源码见 [gfgjs/scrollery](https://github.com/gfgjs/scrollery)。
