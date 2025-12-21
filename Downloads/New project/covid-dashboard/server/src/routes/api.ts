import { Router } from 'express';
import { summaryController } from '../controllers/SummaryController';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Summary Routes
// Summary Routes
router.get('/global', summaryController.getGlobal);
router.get('/cities/all', summaryController.getAllCities);
router.get('/countries', summaryController.getCountries);
router.get('/country/:iso', summaryController.getCountry);
router.get('/country/:iso/cities', summaryController.getCountryCities);
router.get('/history/:category/:query?', summaryController.getHistory);

export default router;
