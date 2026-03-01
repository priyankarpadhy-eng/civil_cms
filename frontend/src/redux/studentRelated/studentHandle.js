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
            .select('*, sclassName:sclass_id(*)')
            .eq('school_id', id);

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                const mappedData = data.map(student => ({
                    ...student,
                    _id: student.id,
                    rollNum: student.roll_num,
                    registrationNum: student.registration_num,
                    sclassName: student.sclassName ? {
                        ...student.sclassName,
                        _id: student.sclassName.id,
                        sclassName: student.sclassName.sclass_name
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