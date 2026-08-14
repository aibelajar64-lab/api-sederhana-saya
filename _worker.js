export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Endpoint GET /api/comments → Ambil semua komentar
    if (path === "/api/comments") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM comments ORDER BY created_at DESC"
      ).all();
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Endpoint POST /api/comments → Tambah komentar baru
    if (path === "/api/comments" && request.method === "POST") {
      const body = await request.json();
      const { name, comment } = body;

      if (!name || !comment) {
        return new Response(
          JSON.stringify({ error: "Nama dan komentar wajib diisi" }),
          { status: 400 }
        );
      }

      await env.DB.prepare(
        "INSERT INTO comments (name, comment) VALUES (?, ?)"
      ).bind(name, comment).run();

      return new Response(
        JSON.stringify({ success: true, message: "Komentar berhasil ditambahkan" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 404
    return new Response("Halaman tidak ditemukan", { status: 404 });
  },
};
