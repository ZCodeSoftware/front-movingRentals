import { AppApiGateWay } from '../../app.api.gateway';
import { IRoles } from '../models/roles.interface';

export const fetchAllRoles = async (): Promise<IRoles[]> => {
    const response = await AppApiGateWay.get('/role');
    return response.data;
};