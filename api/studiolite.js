// plugin.js - Vercel Serverless Function
module.exports = async (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const RAW_SCRIPT_URL = 'https://raw.githubusercontent.com/narakublox/PluginStudioLite/refs/heads/main/LOG-PLUGIN';

  // Jika diakses oleh Roblox -> kirimkan isi script langsung
  if (userAgent.includes('Roblox')) {
    try {
      const scriptRes = await fetch(RAW_SCRIPT_URL);
      if (!scriptRes.ok) throw new Error('Gagal memuat');
      const scriptText = await scriptRes.text();
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(scriptText);
    } catch (err) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(500).send('-- Error: Gagal mengambil script dari sumber');
    }
  }

  // Jika diakses lewat browser -> tampilkan halaman UI SAMA PERSIS
  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plugin Studio Lite</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            dark: {
              base: '#0d0d0d',
              mid: '#151515',
              card: '#1d1d1d',
              border: '#2b2b2b'
            },
            neon: {
              green: '#55ff88',
              blue: '#00cfff',
              red: '#ff5555'
            }
          },
          fontFamily: {
            inter: ['Inter', 'system-ui', 'sans-serif']
          }
        }
      }
    }
  </script>
  <style type="text/tailwindcss">
    @layer utilities {
      .content-auto { content-visibility: auto; }
      .glass { background: rgba(29, 29, 29, 0.65); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
      .text-shadow { text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
      .glow-border { position: relative; }
      .glow-border::before {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(45deg, #ff555540, #00cfff20, #55ff8820);
        mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        mask-composite: exclude;
      }
      .code-rain {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        opacity: 0.15;
        pointer-events: none;
      }
      .toast {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 999;
      }
      .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
      @keyframes fade-in { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
    }

    body { font-family: 'Inter', sans-serif; }
    @keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
    @keyframes blink { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    .animate-pulse-slow { animation: pulse 2.5s infinite; }
    .animate-blink { animation: blink 2s infinite; }
    .animate-float { animation: float 6s ease-in-out infinite; }
  </style>
</head>
<body class="bg-dark-base text-white min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden">
  <!-- Background Code Rain -->
  <canvas id="codeRain" class="code-rain"></canvas>

  <!-- Toast Notification -->
  <div id="toast" class="toast px-6 py-3 rounded-lg bg-dark-card border border-neon-green/30 text-neon-green shadow-lg shadow-neon-green/10">
    ✅ Copied to clipboard!
  </div>

  <!-- Main Card -->
  <div class="w-full max-w-2xl glass glow-border rounded-[20px] p-6 md:p-8 shadow-2xl shadow-black/40 relative z-10 animate-fade-in">
    <!-- Verified Badge -->
    <div class="absolute -top-3 -right-3 bg-neon-green/20 text-neon-green text-xs font-bold px-3 py-1 rounded-full border border-neon-green/30 animate-pulse-slow">
      ✔ Verified
    </div>

    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-white text-shadow">Plugin Studio Lite</h1>
      <p class="text-gray-300 mt-2 text-lg">Official Script Distribution Endpoint</p>
      <p class="text-gray-400 text-sm mt-1">Secure delivery endpoint for Roblox Game Servers</p>
    </div>

    <!-- Loadstring Box -->
    <div class="bg-dark-mid rounded-xl border border-dark-border p-4 mb-6 shadow-inner">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <i class="fa fa-terminal text-neon-blue"></i>
          <span class="font-medium text-gray-200">Loadstring Script</span>
          <span class="text-xs text-gray-400 bg-dark-base px-2 py-0.5 rounded">Lua</span>
        </div>
        <button id="copyBtn" class="flex items-center gap-1.5 bg-dark-card hover:bg-dark-border text-white px-3 py-1.5 rounded-md transition-all hover:shadow-md hover:shadow-neon-blue/20 active:scale-95">
          <i class="fa fa-copy"></i>
          <span>Copy</span>
        </button>
      </div>
      <div id="codeBox" class="bg-dark-base p-3 rounded-md font-mono text-sm text-gray-200 overflow-x-auto">
loadstring(game:HttpGet("https://raw.githubusercontent.com/narakublox/PluginStudioLite/refs/heads/main/LOG-PLUGIN"))()
      </div>
    </div>

    <!-- Status Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-dark-mid rounded-lg p-4 border border-dark-border">
        <div class="text-xs text-gray-400 uppercase tracking-wider">Status</div>
        <div class="text-neon-green font-bold text-xl mt-1 flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-neon-green animate-blink"></span> Online
        </div>
      </div>
      <div class="bg-dark-mid rounded-lg p-4 border border-dark-border">
        <div class="text-xs text-gray-400 uppercase tracking-wider">Version</div>
        <div class="text-white font-bold text-xl mt-1">Latest</div>
      </div>
      <div class="bg-dark-mid rounded-lg p-4 border border-dark-border">
        <div class="text-xs text-gray-400 uppercase tracking-wider">Type</div>
        <div class="text-neon-blue font-bold text-xl mt-1">Lua Endpoint</div>
      </div>
      <div class="bg-dark-mid rounded-lg p-4 border border-dark-border">
        <div class="text-xs text-gray-400 uppercase tracking-wider">Host</div>
        <div class="text-white font-bold text-xl mt-1">Vercel</div>
      </div>
      <div class="bg-dark-mid rounded-lg p-4 border border-dark-border">
        <div class="text-xs text-gray-400 uppercase tracking-wider">Proxy</div>
        <div class="text-white font-bold text-xl mt-1">GitHub RAW</div>
      </div>
      <div class="bg-dark-mid rounded-lg p-4 border border-dark-border">
        <div class="text-xs text-gray-400 uppercase tracking-wider">Access</div>
        <div class="text-neon-red font-bold text-xl mt-1">Roblox Only</div>
      </div>
    </div>

    <!-- Security Section -->
    <div class="bg-dark-mid rounded-xl border border-dark-border p-5 mb-6">
      <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <i class="fa fa-shield text-neon-green"></i> Security
      </h3>
      <ul class="space-y-2 text-gray-200">
        <li class="flex items-center gap-2"><i class="fa fa-check-circle text-neon-green"></i> Roblox User-Agent Validation</li>
        <li class="flex items-center gap-2"><i class="fa fa-check-circle text-neon-green"></i> GitHub RAW Proxy</li>
        <li class="flex items-center gap-2"><i class="fa fa-check-circle text-neon-green"></i> Secure Endpoint</li>
        <li class="flex items-center gap-2"><i class="fa fa-check-circle text-neon-green"></i> Dynamic Script Delivery</li>
        <li class="flex items-center gap-2"><i class="fa fa-check-circle text-neon-green"></i> Server-side Fetch</li>
      </ul>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <button id="copyMainBtn" class="group relative overflow-hidden bg-gradient-to-r from-neon-red/90 to-[#c92a2a] text-white font-medium px-6 py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-neon-red/25 active:scale-[0.98]">
        <span class="relative z-10 flex items-center gap-2"><i class="fa fa-copy"></i> Copy Loadstring</span>
        <div class="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      </button>
      <a href="#" target="_blank" class="bg-dark-card hover:bg-dark-border border border-dark-border text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-md hover:shadow-neon-blue/10 active:scale-[0.98]">
        <i class="fa fa-discord"></i> Join Discord
      </a>
      <a href="https://github.com/narakublox/PluginStudioLite" target="_blank" class="bg-dark-card hover:bg-dark-border border border-dark-border text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-md hover:shadow-neon-blue/10 active:scale-[0.98]">
        <i class="fa fa-github"></i> GitHub
      </a>
    </div>

    <!-- Footer -->
    <div class="mt-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-neon-red animate-pulse"></span>
      Plugin Studio Lite • Secure Endpoint
    </div>
  </div>

  <script>
    // Code Rain Animation
    const canvas = document.getElementById('codeRain');
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const chars = [
      '0','1','A','B','C','D','E','F','10','11','FF','0A','11','A1F30D','ABCD123',
      'loadstring()','game:GetService()','HttpGet()','Plugin()','Server()','Lua','API','Fetch','RAW','Roblox','return','function','while','end'
    ];
    const fontSize = 14;
    const columns = Math.floor(w / fontSize);
    const drops = Array(columns).fill(1);

    function drawRain() {
      ctx.fillStyle = 'rgba(13, 13, 13, 0.1)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#55ff88';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > h && Math.random() > 0.98) drops[i] = 0;
        drops[i]++;
      }
    }
    setInterval(drawRain, 60);
    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    // Copy Functionality
    const codeText = `loadstring(game:HttpGet("https://raw.githubusercontent.com/narakublox/PluginStudioLite/refs/heads/main/LOG-PLUGIN"))()`;
    const toast = document.getElementById('toast');

    function copyCode() {
      navigator.clipboard.writeText(codeText).then(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
      });
    }

    document.getElementById('copyBtn').addEventListener('click', copyCode);
    document.getElementById('copyMainBtn').addEventListener('click', copyCode);
  </script>
</body>
</html>
  `;

  // Kirim halaman HTML ke browser
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(html);
};
