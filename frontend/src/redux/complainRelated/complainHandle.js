import { supabase } from '../../supabaseClient';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './complainSlice';

export const getAllComplains = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('complains')
            .select('*')
            .eq('school_id', id);

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                dispatch(getSuccess(data));
            } else {
                dispatch(getFailed("No complains found"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}