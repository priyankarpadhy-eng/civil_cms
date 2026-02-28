import { supabase } from '../../supabaseClient';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    postDone,
    doneSuccess
} from './teacherSlice';

export const getAllTeachers = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('teachers')
            .select('*')
            .eq('school_id', id);

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                dispatch(getSuccess(data));
            } else {
                dispatch(getFailed("No teachers found"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getTeacherDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('teachers')
            .select('*, school:school_id (*), teach_sclass:teach_sclass_id (*), teach_subject:teach_subject_id (*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        dispatch(doneSuccess(data));
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const updateTeachSubject = (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { error } = await supabase
            .from('teachers')
            .update({ teach_subject_id: teachSubject })
            .eq('id', teacherId);

        if (error) throw error;
        dispatch(postDone());
    } catch (error) {
        dispatch(getError(error.message));
    }
}