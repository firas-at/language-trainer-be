import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Store the original json function
    const originalJson = response.json;
    let responseBody: any;

    // Override json method
    response.json = function (body) {
      responseBody = body;
      return originalJson.call(this, body);
    };

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength}b - ${responseTime}ms - ${userAgent} ${ip} ${JSON.stringify(responseBody)}`,
      );
    });

    next();
  }
}
