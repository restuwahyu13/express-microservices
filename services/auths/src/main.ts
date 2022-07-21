import 'reflect-metadata'
import 'dotenv/config'
import 'express-async-errors'
import express, { Express, Request, Response, Router } from 'express'
import http, { OutgoingMessage, Server } from 'http'
import { StatusCodes as status } from 'http-status-codes'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import q from 'q'
import compression from 'compression'
import zlib from 'zlib'
import hpp from 'hpp'
import mongoose from 'mongoose'
import consola from 'consola'
import { Container, Injectable, apiResponse } from '@node/pkg'

import { AppModule } from '@/app.module'

@Injectable()
class App {
	private app: Express
	private server: Server
	private version: string
	private env: string
	private port: number

	constructor() {
		this.app = express()
		this.server = http.createServer(this.app)
		this.version = '/api/v1'
		this.env = process.env.NODE_ENV as any
		this.port = process.env.PORT as any
	}

	private async connection(): Promise<void> {
		mongoose.Promise = q.Promise
		mongoose.connect(process.env.MONGO_URI as string)

		if (process.env.NODE_ENV !== 'production') {
			mongoose.connection.on('connecting', () => consola.info('database connecting'))
			mongoose.connection.on('connected', () => consola.success('database connected'))
			mongoose.connection.on('disconnecting', () => consola.info('database disconnecting'))
			mongoose.connection.on('disconnected', () => consola.info('database disconnected'))
			mongoose.connection.on('error', () => consola.error('database error'))
		}
	}

	private async config(): Promise<void> {
		this.app.disable('x-powered-by')
		Container.resolve<AppModule>(AppModule)
	}

	private async middleware(): Promise<void> {
		this.app.use(bodyParser.json({ limit: '5mb' }))
		this.app.use(bodyParser.urlencoded({ extended: true }))
		this.app.use(helmet({ contentSecurityPolicy: false }))
		this.app.use(hpp({ checkBody: true, checkQuery: true }))
		this.app.use(
			cors({
				origin: '*',
				methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'HEAD'],
				allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
				credentials: true
			})
		)
		this.app.use(
			compression({
				strategy: zlib.constants.Z_RLE,
				level: zlib.constants.Z_BEST_COMPRESSION,
				memLevel: zlib.constants.Z_BEST_COMPRESSION
			})
		)
		if (!['production', 'test'].includes(this.env)) {
			this.app.use(morgan('dev'))
		}
	}

	private async route(): Promise<void> {
		this.app.use(`${this.version}/users`, Container.resolve<Router>('UsersModule'))
	}

	private async globalRoute(): Promise<void> {
		this.app.all(
			['/', '/api/v1'],
			(_req: Request, res: Response): OutgoingMessage => res.status(status.OK).json(apiResponse(status.OK, 'Server Ping !'))
		)
	}

	private async run(): Promise<void> {
		const serverInfo: string = `Server is running on port: ${this.port}`
		this.server.listen(this.port, '0.0.0.0', () => console.info(serverInfo))
	}

	public async main(): Promise<void> {
		await this.connection()
		await this.config()
		await this.middleware()
		await this.route()
		await this.globalRoute()
		await this.run()
	}
}

/**
 * @description boostraping app and run app with env development / production
 */

;(async function () {
	if (process.env.NODE_ENV != 'test') await Container.resolve<App>(App).main()
})()
