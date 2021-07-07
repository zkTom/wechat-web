import * as api from './request';

export function queryCountByEpcNumAndIdCardNum (params) {
    return api.POST('/evi/distribute', params);
}
