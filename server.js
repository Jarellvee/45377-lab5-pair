import http from 'http';
import { Database } from './db.js';
import url from 'url';
import { MESSAGES } from './lang/en/user.js';

class Server {
    constructor() {
        this.db = new Database();
        this.server = http.createServer(this.requestListener.bind(this));
    }

    async start(port) {
        await this.db.setup();
        this.server.listen(port, () => {
            console.log(MESSAGES.SUCCESS.SERVER_RUNNING(port));
        });
    }

    corsHeaders() {
        return {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };
    }

    handleOptions(res) {
        res.writeHead(204, this.corsHeaders());
        res.end();
    }

    async handleGet(req, res, parsedUrl) {
        const sql = decodeURIComponent(parsedUrl.query.query || '');

        if (!sql.toLowerCase().startsWith('select')) {
            res.writeHead(400, this.corsHeaders());
            return res.end(MESSAGES.ERRORS.ONLY_SELECT_ALLOWED);
        }

        try {
            const rows = await this.db.query(sql);

            if (rows.length === 0) {
                res.writeHead(404, this.corsHeaders());
                return res.end(JSON.stringify({ ok: false, error: MESSAGES.INFO.EMPTY }));
            }

            res.writeHead(200, { ...this.corsHeaders(), 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error) {
            res.writeHead(500, this.corsHeaders());
            res.end(JSON.stringify({ ok: false, error: error.message }));
        }
    }

    async handlePost(req, res, parsedUrl) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { sql, params } = JSON.parse(body);

                if (!sql.toLowerCase().startsWith('insert')) {
                    res.writeHead(400, this.corsHeaders());
                    return res.end(JSON.stringify({ success: false, error: MESSAGES.ERRORS.ONLY_INSERT_ALLOWED }));
                }

                const data = await this.db.query(sql, params);
                res.writeHead(200, { ...this.corsHeaders(), 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true, result: data }));
            } catch (error) {
                res.writeHead(500, { ...this.corsHeaders(), 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, error: error.message }));
            }
        });
    }

    async requestListener(req, res) {
        const parsedUrl = url.parse(req.url, true);

        if (!parsedUrl.pathname.endsWith('/lab5/api/v1/sql')) {
            res.writeHead(404, this.corsHeaders());
            return res.end(JSON.stringify({ ok: false, error: MESSAGES.ERRORS.INVALID_ENDPOINT }));
        }

        if (req.method === "OPTIONS") return this.handleOptions(res);
        if (req.method === "GET") return this.handleGet(req, res, parsedUrl);
        if (req.method === "POST") return this.handlePost(req, res, parsedUrl);

        res.writeHead(405, this.corsHeaders());
        res.end(MESSAGES.ERRORS.METHOD_NOT_ALLOWED);
    }
}

class ServerRunner {
    constructor() {
        this.server = new Server();
        this.PORT = process.env.PORT || 3000;
    }

    async run() {
        await this.server.start(this.PORT);
    }
}

const serverRunner = new ServerRunner();
serverRunner.run();
