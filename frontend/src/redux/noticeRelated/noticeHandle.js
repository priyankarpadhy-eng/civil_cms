import { supabase } from '../../supabaseClient';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './noticeSlice';

export const getAllNotices = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('notices')
            .select('*')
            .eq('school_id', id);

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                const mappedData = data.map(notice => ({ ...notice, _id: notice.id }));
                dispatch(getSuccess(mappedData));
            } else {
                dispatch(getFailed("No notices found"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}