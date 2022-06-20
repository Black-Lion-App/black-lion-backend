import { IMeUser } from '../../types/me';
import { IUser } from '../../types/user';

export class HelperService {

    tranformMeData(user: IUser) {
        return {
            id: user['_id'],
            firstName: user['firstName'],
            lastName: user['lastName'],
            email: user['email'],
        } as IMeUser;
    }

}

export default new HelperService();