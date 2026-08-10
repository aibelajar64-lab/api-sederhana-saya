export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Root path - halaman HTML dokumentasi
    if (path === "/") {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>API dengan Database</title></head>
        <body>
          <h1>🚀 API dengan D1 Database</h1>
          <p>Endpoint yang tersedia:</p>
          <ul>
            <li><code>GET /api/users</code> - Daftar semua user (dari database)</li>
            <li><code>GET /api/user/1</code> - Ambil user dengan ID 1</li>
          </ul>
        </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // GET /api/users - Ambil semua user dari database
    if (path === "/api/users") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM users ORDER BY id"
        ).all();
        
        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Gagal mengambil data: " + error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // GET /api/user/:id - Ambil satu user berdasarkan ID
    if (path.startsWith("/api/user/")) {
      const id = path.split("/")[3];
      
      if (!id || isNaN(id)) {
        return new Response(
          JSON.stringify({ error: "ID harus berupa angka" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
        const user = await env.DB.prepare(
          "SELECT * FROM users WHERE id = ?"
        ).bind(id).first();

        if (user) {
          return new Response(JSON.stringify(user), {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(
            JSON.stringify({ error: "User tidak ditemukan" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Gagal mengambil data: " + error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 404
    return new Response("Halaman tidak ditemukan", { status: 404 });
  },
};
