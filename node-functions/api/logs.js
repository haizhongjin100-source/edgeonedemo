export async function onRequestGet(context) {
    const { env } = context;
    const url = env.SUPABASE_URL;
    const serviceKey = env.SUPABASE_SERVICE_KEY;

    if (!url || !serviceKey) {
        return new Response(JSON.stringify({ error: '未配置 Supabase 环境变量' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const requestUrl = new URL(context.request.url);
        const limit = Math.min(parseInt(requestUrl.searchParams.get('limit') || '50'), 200);

        const response = await fetch(`${url}/rest/v1/conversations?select=*&order=created_at.desc&limit=${limit}`, {
            headers: {
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Supabase query error:', error);
            return new Response(JSON.stringify({ error: '查询失败' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Logs Error:', error);
        return new Response(JSON.stringify({ error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
