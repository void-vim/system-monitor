import http from 'node:http';
import os from 'node:os';

const PORT = process.env.PORT || 8080;

function getMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPercent = ((totalMem - freeMem) / totalMem) * 100;

    if (usedMemPercent > 85) {
        console.log(`[WARN] Memory usage exceeded threshold: ${usedMemPercent.toFixed(2)}%`);
    } else {
        console.log(`[INFO] System resource check completed successfully`);
    }

    return {
        uptime: os.uptime(),
        totalMemory: totalMem,
        freeMemory: freeMem,
        cpuLoad: os.loadavg()
    };
}

const server = http.createServer((req, res) => {
    if (req.url === '/metrics' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getMetrics()));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`[INFO] Server listening on port ${PORT}`);
});

setInterval(getMetrics, 10000);
