# 猪栏菜：时序奖学金 · 浏览器前端原型

这是用于宝塔静态站点部署的浏览器游戏前端，而不是 Godot 导出包。

## 本地预览

在此目录执行：

```bash
python3 -m http.server 4173
```

浏览器打开 `http://127.0.0.1:4173`。使用 HTTP 服务而不是双击 `index.html`，以避免浏览器对模块脚本的本地文件限制。

## 宝塔部署

将本目录下的全部文件上传到站点根目录，保持 `public/assets/`、`src/` 和 `index.html` 的相对位置不变。站点不需要 PHP、数据库或 Node.js。

## 可替换资源

- `public/assets/campus-time-stage.png`：主舞台背景。
- `public/assets/judy-placeholder.png`：剧情角色占位立绘。
- `src/main.js` 顶部的 `ASSETS`：资源引用唯一入口。

本项目中的状态保存在浏览器 `localStorage` 键 `zhulancai-web-save-v1`。清除站点数据即可重置演示档。
