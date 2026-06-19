import { NextResponse } from 'next/server';

export const runtime = 'edge';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

async function handleRequest(req) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path');
    if (!path) {
      return new Response('Missing path parameter', { status: 400 });
    }

    // Ensure the path is prefixed correctly
    const targetPath = path.startsWith('/') ? path : `/${path}`;
    const targetUrl = `${supabaseUrl}${targetPath}`;

    // Filter headers to forward to Supabase
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // Skip hop-by-hop headers and host/content-length
      if (
        lowerKey !== 'host' &&
        lowerKey !== 'connection' &&
        lowerKey !== 'content-length' &&
        lowerKey !== 'transfer-encoding' &&
        lowerKey !== 'keep-alive'
      ) {
        headers.set(key, value);
      }
    });

    // Extract body if the method supports a body payload
    let body = undefined;
    if (!['GET', 'HEAD'].includes(req.method)) {
      try {
        body = await req.arrayBuffer();
      } catch (e) {
        body = undefined;
      }
    }

    // Execute the request on the server
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
    });

    // Load response data as arrayBuffer to support JSON and binary payloads
    const responseData = await response.arrayBuffer();

    // Prepare response headers to send back to the browser
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // Skip content-encoding to avoid compression mismatches
      if (lowerKey !== 'content-encoding') {
        responseHeaders.set(key, value);
      }
    });

    return new Response(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Supabase Proxy Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as PUT,
  handleRequest as PATCH,
  handleRequest as DELETE,
  handleRequest as OPTIONS,
};
