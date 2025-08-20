import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { vectorDB } from '../services/vectorDB';
import { openaiClient } from '../services/openaiClient';

const router = Router();

/**
 * GET /api/health
 * Comprehensive health check for all services
 */
router.get('/', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const healthChecks = {
    timestamp: new Date().toISOString(),
    status: 'OK',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    checks: {
      database: { status: 'unknown', responseTime: 0 },
      openai: { status: 'unknown', responseTime: 0 },
      system: { status: 'OK', memory: 0, cpu: 0 },
    },
  };

  try {
    // Check vector database health
    const dbStartTime = Date.now();
    try {
      const dbStats = await vectorDB.getIndexStats();
      const dbResponseTime = Date.now() - dbStartTime;
      
      healthChecks.checks.database = {
        status: 'OK',
        responseTime: dbResponseTime,
        details: {
          indexName: process.env.PINECONE_INDEX_NAME || 'rv-repair-manuals',
          totalVectors: dbStats.totalVectorCount || 0,
          dimension: dbStats.dimension || 1536,
        },
      };
    } catch (error) {
      const dbResponseTime = Date.now() - dbStartTime;
      healthChecks.checks.database = {
        status: 'ERROR',
        responseTime: dbResponseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      healthChecks.status = 'DEGRADED';
    }

    // Check OpenAI health
    const openaiStartTime = Date.now();
    try {
      const modelInfo = openaiClient.getModelInfo();
      const openaiResponseTime = Date.now() - openaiStartTime;
      
      healthChecks.checks.openai = {
        status: 'OK',
        responseTime: openaiResponseTime,
        details: modelInfo,
      };
    } catch (error) {
      const openaiResponseTime = Date.now() - openaiStartTime;
      healthChecks.checks.openai = {
        status: 'ERROR',
        responseTime: openaiResponseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      healthChecks.status = 'DEGRADED';
    }

    // Check system resources
    const memUsage = process.memoryUsage();
    healthChecks.checks.system = {
      status: 'OK',
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
      },
      cpu: {
        uptime: process.uptime(),
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version,
      },
    };

    // Determine overall status
    const hasErrors = Object.values(healthChecks.checks).some(
      check => check.status === 'ERROR'
    );
    
    if (hasErrors) {
      healthChecks.status = 'DEGRADED';
    }

    const totalResponseTime = Date.now() - startTime;
    healthChecks.responseTime = totalResponseTime;

    // Log health check results
    logger.info('Health check completed', {
      status: healthChecks.status,
      responseTime: totalResponseTime,
      checks: healthChecks.checks,
    });

    // Return appropriate HTTP status
    const httpStatus = healthChecks.status === 'OK' ? 200 : 503;
    res.status(httpStatus).json(healthChecks);

  } catch (error) {
    logger.error('Health check failed:', error);
    
    healthChecks.status = 'ERROR';
    healthChecks.error = error instanceof Error ? error.message : 'Unknown error';
    healthChecks.responseTime = Date.now() - startTime;

    res.status(503).json(healthChecks);
  }
});

/**
 * GET /api/health/ready
 * Readiness probe for Kubernetes/container orchestration
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if all critical services are ready
    const dbStats = await vectorDB.getIndexStats();
    const modelInfo = openaiClient.getModelInfo();

    if (dbStats && modelInfo) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        services: {
          database: 'ready',
          openai: 'ready',
        },
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        reason: 'One or more services are not ready',
      });
    }
  } catch (error) {
    logger.error('Readiness check failed:', error);
    
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      reason: 'Service health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/health/live
 * Liveness probe for Kubernetes/container orchestration
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pid: process.pid,
  });
});

/**
 * GET /api/health/info
 * Get detailed system information
 */
router.get('/info', (req: Request, res: Response) => {
  const info = {
    application: {
      name: 'RV Repair Copilot API',
      version: '1.0.0',
      description: 'AI-powered RV repair assistance API',
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3001,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      pid: process.pid,
    },
    dependencies: {
      openai: {
        model: process.env.OPENAI_MODEL || 'gpt-4-1106-preview',
        embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-ada-002',
      },
      pinecone: {
        indexName: process.env.PINECONE_INDEX_NAME || 'rv-repair-manuals',
        environment: process.env.PINECONE_ENV || 'not set',
      },
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(info);
});

export default router;