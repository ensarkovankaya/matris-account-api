import * as express from "express";

/**
 * Mock Account API Endpoint
 */
export class Server {
    public app: express.Application;
    public data: any;
    public status;

    constructor() {
        this.status = 200;
        this.app = express();
        this.routes();
    }

    private routes(): void {
        try {
            this.app.post('/graphql', ((req, res) => {
                try {
                    res.status(this.status).send(this.data);
                } catch (e) {
                    console.error('Server Error', e);
                    res.status(500).send();
                }
                this.status = 200;
                this.data = undefined;
            }));
        } catch (err) {
            console.error('Route configuration failed', err);
            throw err;
        }
    }
}
