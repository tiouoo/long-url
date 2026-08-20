export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/') {
      return env.ASSETS.fetch(new URL('/index.html', request.url));
    }

    const code = pathname.slice(1);
    if (/^[iI]+$/.test(code)) {
      try {
        const original = decodeFromBase2(code);
        if (/^https?:\/\//.test(original)) {
          return Response.redirect(original, 302);
        }
        return env.ASSETS.fetch(new URL('/error.html', request.url));
      } catch {
        return env.ASSETS.fetch(new URL('/error.html', request.url));
      }
    }

    return env.ASSETS.fetch(request);
  },
};

function decodeFromBase2(encodedStr) {
  const binaryString = encodedStr.replace(/i/g, '0').replace(/I/g, '1');
  if (binaryString.length % 8 !== 0) throw new Error('invalid base2 string');
  const bytes = [];
  for (let i = 0; i < binaryString.length; i += 8) {
    bytes.push(parseInt(binaryString.substring(i, i + 8), 2));
  }
  return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
}
