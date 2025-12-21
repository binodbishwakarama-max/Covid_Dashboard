import { Request, Response, NextFunction } from 'express';
import { covidDataService } from '../services/CovidDataService';

export class SummaryController {

    public async getGlobal(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await covidDataService.getGlobalSummary();
            res.json({
                status: 'success',
                data
            });
        } catch (error) {
            next(error);
        }
    }

    public async getCountries(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await covidDataService.getAllCountries();
            res.json({
                status: 'success',
                results: data.length,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    public async getCountry(req: Request, res: Response, next: NextFunction) {
        try {
            const { iso } = req.params;
            const data = await covidDataService.getCountry(iso);
            res.json({
                status: 'success',
                data
            });
        } catch (error) {
            next(error);
        }
    }

    public async getCountryCities(req: Request, res: Response, next: NextFunction) {
        try {
            const { iso } = req.params;
            const data = await covidDataService.getCountryCities(iso);
            res.json({
                status: 'success',
                results: data.length,
                data
            });
        } catch (error) {
            next(error);
        }
    }
    public async getAllCities(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await covidDataService.getAllCities();
            res.json({
                status: 'success',
                results: data.length,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    public async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { category, query } = req.params;
            const days = req.query.days as string || '30';
            const data = await covidDataService.getHistory(category, query, days);

            if (!data) {
                res.status(404).json({
                    status: 'error',
                    message: 'History data not found'
                });
                return;
            }

            res.json({
                status: 'success',
                data
            });
        } catch (error) {
            next(error);
        }
    }
}

export const summaryController = new SummaryController();
