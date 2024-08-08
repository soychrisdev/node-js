import express, { Router } from 'express'
interface ServerOptions {
  port?: number
  routes: Router
}

export class Server {
  private readonly app = express();
  private readonly port: number
  private readonly routes: Router
  constructor(options: ServerOptions) {
    const { port = 3000, routes } = options
    this.port = port
    this.routes = routes
  }

  async start() {
    this.app.use(express.json()) //application/json
    this.app.use(express.urlencoded({ extended: true })) //x-www-form-urlencoded

    this.app.use(this.routes)

    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`)
    })
  }
}