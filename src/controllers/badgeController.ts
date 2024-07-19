import express, {Request, Response} from "express";
import upload from "../middleware/multer";
import {BadgeService} from "../services/badgeService";
import path from "path";
import * as fs from "node:fs";


export const badgeRoute = (app: express.Express) => {

    app.post('/verify-badge', upload.single('image'), async (req: Request, res: Response) => {
        const filePath = req.file?.path;
        if (!filePath) {
            return res.status(400).json({error: 'No file uploaded'});
        }

        try {
            const badgeService = new BadgeService();
            const [isValid, message] = await badgeService.verifyBadge(filePath);
            res.json({valid: isValid, message: message});
        } catch (error: any) {
            res.status(500).json({error: error.message});
        } finally {
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting file: ${err.message}`);
            });
        }
    });

    app.post('/convert-image', upload.single('image'), async (req: Request, res: Response) => {
        const filePath = req.file?.path;
        if (!filePath) {
            return res.status(400).json({error: 'No file uploaded'});
        }

        const outputPath = path.join('public/uploads', `converted-${Date.now()}.png`);
        try {
            const badgeService = new BadgeService();
            await badgeService.convertImageToBadge(filePath, outputPath);
            res.json({message: 'Image converted successfully', path: outputPath});
        } catch (error: any) {
            res.status(500).json({error: error.message});
        }
    });
}