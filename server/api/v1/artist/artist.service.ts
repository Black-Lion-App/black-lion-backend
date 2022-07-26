import { IArtist } from "../../../../types/artist";
import { Artist } from "../../../models";

export class AuthService {

    constructor() { }

    async get(options) {
        return new Promise(async (resolve, reject) => {
            try {
                const { offset, limit } = options;
                const serverRequest = await Artist.paginate({}, { offset, limit })
                resolve(serverRequest);
            } catch (e) {
                reject(e);
            }
        })
    }
    async post(payload: IArtist) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!payload) {
                    return reject({ code: 400, message: "Server returned error." })
                }
                const serverRequest = new Artist(payload);
                resolve(await serverRequest.save());
            } catch (e) {
                reject(e);
            }
        })
    }

}

export default new AuthService();
