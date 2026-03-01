import { supabase } from '../../supabaseClient';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './complainSlice';

export const getAllComplains = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('complains')
            .select('*, user:user_id(name, email, role)')
            .order('created_at', { ascending: false });

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                const mappedData = data.map(complain => ({ ...complain, _id: complain.id }));
                dispatch(getSuccess(mappedData));
            } else {
                dispatch(getFailed("No complains found"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}