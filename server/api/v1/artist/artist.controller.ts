import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import ArtistService from "./artist.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {
    async get(req: Request, res: Response): Promise<void> {
        try {
            const response = await ArtistService.get({
                offset: req.query?.offset || 0, 
                limit: req.query?.limit || 10
            });
            super.response(res, response, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in login, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
    async post(req: Request, res: Response): Promise<void> {
        try {
            const response = await ArtistService.post(req.body);
            super.response(res, response, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in login, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
