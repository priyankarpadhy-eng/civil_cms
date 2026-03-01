import { supabase } from '../../supabaseClient';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone
} from './studentSlice';

export const getAllStudents = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                classes:sclass_id(*)
            `)
            .eq('role', 'Student');

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                const mappedData = data.map(student => ({
                    ...student,
                    _id: student.id,
                    rollNum: student.roll_num,
                    registrationNum: student.registration_num,
                    sclassName: student.classes ? {
                        ...student.classes,
                        _id: student.classes.id,
                        sclassName: student.classes.sclass_name
                    } : null
                }));
                dispatch(getSuccess(mappedData));
            } else {
                dispatch(getFailed("No students found"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const updateStudentFields = (id, fields) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { error } = await supabase
            .from('profiles')
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