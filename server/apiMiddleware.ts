import express, { Request, Response, Router } from 'express';
import {
  generateCustomerAssistantResponse,
  generateProductDescription,
  compareProducts
} from './gemini.js';

export function createApiMiddleware() {
  const router = Router();
  router.use(express.json());

  // Health check
  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      store: 'متجر عكاظ (Okaz Store)',
      version: '1.0.0',
      currency: 'LYD (د.ل)',
      geminiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // Customer AI Chat
  router.post('/ai/chat', async (req: Request, res: Response) => {
    try {
      const { history = [], message, catalogSummary = [] } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'الرسالة مطلوبة' });
        return;
      }

      const result = await generateCustomerAssistantResponse(history, message, catalogSummary);
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/ai/chat:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء معالجة طلب المساعد الذكي' });
    }
  });

  // Admin AI: generate product description
  router.post('/ai/admin/generate-description', async (req: Request, res: Response) => {
    try {
      const { productName, category, targetPrice, features } = req.body;
      if (!productName || !category) {
        res.status(400).json({ error: 'اسم المنتج والتصنيف مطلوبان' });
        return;
      }

      const result = await generateProductDescription({
        productName,
        category,
        targetPrice,
        features
      });
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/ai/admin/generate-description:', error);
      res.status(500).json({ error: 'حدث خطأ في توليد الوصف' });
    }
  });

  // Compare products with AI
  router.post('/ai/compare', async (req: Request, res: Response) => {
    try {
      const { products } = req.body;
      if (!products || !Array.isArray(products) || products.length < 2) {
        res.status(400).json({ error: 'يرجى تحديد منتجين على الأقل للمقارنة' });
        return;
      }

      const result = await compareProducts(products);
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/ai/compare:', error);
      res.status(500).json({ error: 'فشلت المقارنة الذكية' });
    }
  });

  const app = express();
  app.use('/api', router);
  return app;
}
