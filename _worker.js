export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Root path
    if (path === "/") {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>API Sederhana</title></head>
        <body>
          <h1>🚀 API Sederhana</h1>
          <p>Endpoint yang tersedia:</p>
          <ul>
            <li><code>GET /api/users</code> - Daftar semua user</li>
            <li><code>GET /api/user/1</code> - Ambil user dengan ID 1</li>
          </ul>
        </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // GET /api/users
    if (path === "/api/users") {
      const users = [
        { id: 1, nama: "Andi", email: "andi@email.com" },
        { id: 2, nama: "Budi", email: "budi@email.com" },
        { id: 3, nama: "Citra", email: "citra@email.com" },
      ];
      return new Response(JSON.stringify(users), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // GET /api/user/1 (path parameter)
    if (path.startsWith("/api/user/")) {
      const id = path.split("/")[3];
      const users = [
        { id: 1, nama: "Andi", email: "andi@email.com" },
        { id: 2, nama: "Budi", email: "budi@email.com" },
        { id: 3, nama: "Citra", email: "citra@email.com" },
      ];
      const user = users.find((u) => u.id == id);
      if (user) {
        return new Response(JSON.stringify(user), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({ error: "User tidak ditemukan" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // 404
    return new Response("Halaman tidak ditemukan", { status: 404 });
  },
};
