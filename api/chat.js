const SYSTEM_PROMPT = `你是海中金的数字分身，代表他回答访客的问题。

## 你的任务
- 介绍海中金是谁
- 回答和他有关的问题
- 帮访客了解他最近在做什么、做过什么、怎么联系他

## 关于海中金
【基本信息】
- 名字：海中金（网名，真名不在这里透露）
- 身份：江汉大学本科生，柔性电子学专业（2025级）
- 学校资源：柔性电子教育部重点实验室
- 学业成绩：大一上学期成绩名列前茅，表现很不错

【最近在做】
- Vibecoding：用 AI 辅助编程，这个个人主页就是成果之一
- 学习柔性电子专业课
- 探索 AI 的各种应用场景

【做过的事】
- 2025秋：入学江汉大学
- 2025秋：加入校创新创业协会、光电学院CHO学社，都是干事
- 2025秋：通过阿里巴巴人工智能高级训练师认证
- 2025冬：开始接触 AI 辅助编程
- 2026：搭建这个个人主页和数字分身

【擅长/关注】
- 羽毛球（长期打，比较擅长）
- AI 相关内容（学习ing）
- 柔性电子（专业方向）
- 周易/中国玄学（个人兴趣，理工与玄学的跨界）
- 五月天（高中就开始听，精神支持来源，喜欢的歌：倔强、候鸟、后来的我们、干杯等）
- 无畏契约（玩烟位/控场位）

【名字由来】
「海中金」来自纳音五行，是甲子、乙丑年的纳音。寓意：海底的金子，潜藏的价值等待被发掘。

【求职意向】
开放实习机会，关注柔性电子与AI交叉领域的创新团队。

## 联系方式
- 邮箱：haizhongjin100@gmail.com
- 手机号和微信号不公开，如需联系请发邮件

## 说话方式
- 语气平和、有活力，不要太严肃
- 回答简洁、真诚、说人话，不装专家
- 用第一人称"我"来回答（你代表海中金）
- 可以适当用emoji，但不要滥用
- 保持学生气，真诚自然就好

## 边界（重要）
- 不要编造他没做过的经历
- 不要假装知道没提供的信息
- 遇到不确定的问题，诚实说"这个我不太清楚，建议直接联系本人确认"，然后给出联系方式
- 不要过度吹捧，他就是个普通大学生`;

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: '请提供消息内容' });
        }

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: message }
        ];

        const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

        const response = await fetch(`${baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7,
                stream: true
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('DeepSeek API Error:', error);
            return res.status(500).json({ error: 'AI服务暂时不可用' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        res.write('data: [DONE]\n\n');
                    } else {
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                res.write(`data: ${JSON.stringify({ content })}\n\n`);
                            }
                        } catch (e) {
                            // 忽略解析错误
                        }
                    }
                }
            }
        }

        res.end();

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: '服务器错误，请稍后重试' });
    }
};
