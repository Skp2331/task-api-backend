/**
 * App Controller
 * ---------------
 * Handles the root route to show API information.
 */

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    /**
     * GET /
     * Welcome endpoint - shows API is running
     */
    @Get()
    getWelcome() {
        return {
            message: 'Task API is running!',
            version: '1.0.0',
            endpoints: {
                auth: {
                    signup: 'POST /auth/signup',
                    login: 'POST /auth/login',
                },
                tasks: {
                    create: 'POST /tasks',
                    getAll: 'GET /tasks',
                    getOne: 'GET /tasks/:id',
                    update: 'PATCH /tasks/:id',
                    delete: 'DELETE /tasks/:id',
                },
            },
            documentation: 'See README.md for full documentation',
        };
    }
}
