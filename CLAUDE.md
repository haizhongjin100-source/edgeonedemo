# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

海中金的个人主页，包含个人信息展示和 AI 数字分身聊天功能。目标访客为学校老师、同学和筛选实习的 HR。

## 常用命令

```bash
# 安装依赖
npm install

# 启动服务器（开发/生产）
npm start

# 访问地址
# http://localhost:3000/index.html
```

## 架构

```
├── index.html      # 前端页面（HTML + CSS + JS 一体）
├── server.js       # Node.js 后端，代理 DeepSeek API
├── .env            # 环境变量（DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL）
└── 头像.jpg        # 头像图片
```

### 前端 (index.html)
- 单文件包含 HTML/CSS/JS
- 粗描边漫画线稿风（3px #1a2a4e 描边 + 4px 偏移阴影），ZCOOL KuaiLe 手写字体
- 左侧个人信息区（可点击标签弹出模态框）
- 右侧聊天面板

### 后端 (server.js)
- Express 服务器，端口 3000
- `/api/chat` POST 路由代理 DeepSeek API
- `SYSTEM_PROMPT` 常量定义数字分身人设

## 设计偏好

- 风格：明亮动漫风，蓝白配色，粗边框 + 偏移阴影
- 不要科幻风、不要可爱风
- 动画要精致但不过度

## 数字分身知识要点

- 身份：江汉大学本科生，柔性电子学专业（2025年开始）
- 学校资源：柔性电子教育部重点实验室
- 兴趣：五月天（高中精神支持）、无畏契约（烟位/控场位）、周易/玄学
- 名字「海中金」来自纳音五行，寓意"海底金子，待发掘的价值"

## 会话记忆约定

- 完成重要任务后，ClaCode 会主动提议更新此文件
- 用户确认后，将对话要点压缩追加到下方「历史记录」区域
- 仅在此项目文件夹内生效

### 历史记录

#### 2026-04-01 完整工作记录

本次会话完成了一个完整的 UI 风格重构项目：

**1. Agent Team 组建** — 创建 6 人协作体系（需求分析师/提示词工程师/美学设计师/代码编辑师/性能优化师/成果验收员），通过 `.agent-team/` 文件夹协作。

**2. 需求分析** — 用户反馈页面"千篇一律很AI"，要求做成"资深动漫画师风格"。诊断出 6 大问题（圆角均匀/渐变滥用/缺漫画语言/网格死板/字体无个性/动效模板化），拆为 12 个子任务 + 10 条验收标准。

**3. 视觉重构** — 全面重写 CSS（JS/HTML 结构零改动）：
- 粗描边 3px + 4px 偏移漫画阴影 + 斜线排线纹理
- ZCOOL KuaiLe 手写字体 + text-stroke 描边标题
- clip-path 八角切边标签 + conic-gradient 集中线 + CSS 三角气泡尾巴
- 纯色平涂替代渐变铺满，弹性回弹 cubic-bezier 动效

**4. 移动端修复** — 首栏改为纵向居中布局，卡片阴影/旋转适配小屏。

**5. 验收** — 10/10 全部通过，备份至 `D:/Claude code使用/个人主页4.1/`。

**已解决的技术问题：**
- DeepSeek API Key 过期导致数字分身无法回复 → 用户自行更换 Key
- `.agent-team/` 目录下有完整的需求简报/设计规范/变更记录/验收报告

#### 工作偏好
- Agent 任务要拆小，每个 Agent 只做一件事，减少等待时间，不要一个大 Agent 跑很久没动静

<!-- 新记录追加在此上方 -->
