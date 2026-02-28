import { supabase } from '../../supabaseClient';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone
} from './studentSlice';

export const getAllStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('school_id', id);

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                dispatch(getSuccess(data));
            } else {
                dispatch(getFailed("No students found"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const updateStudentFields = (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { error } = await supabase
            .from('students')
            .update(fields)
            .eq('id', id);

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const removeStuff = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    // Since we're using JSONB for many fields like attendance, 
    // removal logic would usually involve updating the JSONB field.
    dispatch(getError("Removal logic via Supabase requires specific implementation per field."));
}