export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Endpoint API utama dengan parameter nama
    if (path === "/api") {
      const nama = url.searchParams.get("nama") || "Newai";
      return new Response(
        JSON.stringify({
          pesan: `Halo, ${nama}! Ini API pertamamu dari GitHub!`,
          waktu: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Endpoint root (halaman HTML)
    if (path === "/") {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>API Sederhana</title></head>
        <body>
          <h1>🚀 API Sederhana</h1>
          <p>Coba endpoint ini:</p>
          <code><a href="/api">/api</a></code><br>
          <code><a href="/api?nama=Budi">/api?nama=Budi</a></code>
        </body>
        </html>
        `,
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // 404
    return new Response("Halaman tidak ditemukan", { status: 404 });
  },
};