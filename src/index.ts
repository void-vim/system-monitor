import http from 'node:http';
import os from 'node:os';
import { formatBytes, formatUptime } from './format';

const PORT = process.env.PORT || 8080;

function getMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const usedMemPercent = (usedMem / totalMem) * 100;

    if (usedMemPercent > 85) {
        console.log(`[WARN] Memory usage exceeded threshold: ${usedMemPercent.toFixed(2)}%`);
    } else {
        console.log(`[INFO] System resource check completed successfully`);
    }

    return {
        uptimeRaw: os.uptime(),
        uptimeHuman: formatUptime(os.uptime()),
        totalMemory: formatBytes(totalMem),
        freeMemory: formatBytes(freeMem),
        usedMemory: formatBytes(usedMem),
        memoryUsagePercent: `${usedMemPercent.toFixed(2)}%`,
        cpuLoad: os.loadavg()
    };
}

const server = http.createServer((req, res) => {
    if (req.url === '/metrics' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getMetrics(), null, 2));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`[INFO] Server listening on port ${PORT}`);
});

setInterval(getMetrics, 10000);
