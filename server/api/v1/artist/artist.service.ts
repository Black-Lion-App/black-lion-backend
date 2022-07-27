import { IArtist } from "../../../../types/artist";
import { Artist } from "../../../models";

export class AuthService {

    constructor() { }

    async get(options): Promise<Array<IArtist>> {
        return new Promise(async (resolve, reject) => {
            try {
                const { offset, limit } = options;
                const serverRequest = await Artist.find({})
                resolve(serverRequest);
            } catch (e) {
                reject(e);
            }
        })
    }
    async post(payload: IArtist, host: string, file: any): Promise<IArtist> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!file) {
                    return reject({ code: 400, message: "Server returned error." })
                }

                const docUrl = `http://${host}/${file.path}`;

                if (!payload) {
                    return reject({ code: 400, message: "Server returned error." })
                }
                payload.avatar = docUrl;

                const serverRequest = new Artist(payload);
                resolve(await serverRequest.save());
            } catch (e) {
                reject(e);
            }
        })
    }
    async getById(id): Promise<IArtist> {
        return new Promise(async (resolve, reject) => {
            try {
                const [serverRequest] = await Artist.find({ _id: id })
                resolve(serverRequest);
            } catch (e) {
                reject(e);
            }
        })
    }
    async update(id, payload: IArtist): Promise<IArtist> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ code: 400, message: "Invalid id, Server returned error." })
                }
                if (!payload) {
                    return reject({ code: 400, message: "Invalid payload, Server returned error." })
                }

                const update = await Artist.findOneAndUpdate({ _id: id }, payload)
                return resolve(update);
            } catch (e) {
                reject(e);
            }
        })
    }
    async updateWithProfile(id, payload: IArtist, host: string, file): Promise<IArtist> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!file) {
                    return reject({ code: 400, message: "File Not Found, Server returned error." })
                }
                const docUrl = `http://${host}/${file.path}`;

                if (!id) {
                    return reject({ code: 400, message: "Invalid id, Server returned error." })
                }

                if (!payload) {
                    return reject({ code: 400, message: "Invalid payload, Server returned error." })
                }

                payload.avatar = docUrl;
                const update = await Artist.findOneAndUpdate({ _id: id }, payload)

                return resolve(update);
            } catch (e) {
                reject(e);
            }
        })
    }
    async delete(id): Promise<IArtist> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!id) {
                    return reject({ code: 400, message: "Invalid id, Server returned error." })
                }

                const request = await Artist.findOneAndDelete({ _id: id })
                return resolve(request);
            } catch (e) {
                reject(e);
            }
        })
    }
}

export default new AuthService();
