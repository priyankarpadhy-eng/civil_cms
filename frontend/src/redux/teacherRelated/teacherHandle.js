import { supabase } from '../../supabaseClient';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    postDone,
    doneSuccess
} from './teacherSlice';

export const getAllTeachers = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, teachSclass:sclass_id(*)')
            .eq('role', 'Faculty');

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                const mappedData = data.map(teacher => ({
                    ...teacher,
                    _id: teacher.id,
                    teachSclass: teacher.teachSclass ? {
                        ...teacher.teachSclass,
                        _id: teacher.teachSclass.id,
                        sclassName: teacher.teachSclass.sclass_name
                    } : null
                }));
                dispatch(getSuccess(mappedData));
            } else {
                dispatch(getFailed("No faculty found"));
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
            .from('profiles')
            .select('*, teach_sclass:sclass_id (*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        const mappedData = data ? {
            ...data,
            _id: data.id,
            teachSclass: data.teach_sclass ? {
                ...data.teach_sclass,
                _id: data.teach_sclass.id,
                sclassName: data.teach_sclass.sclass_name
            } : null
        } : data;
        dispatch(doneSuccess(mappedData));
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const updateTeacherFields = (teacherId, fields) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { error } = await supabase
            .from('profiles')
            .update(fields)
            .eq('id', teacherId);

        if (error) throw error;
        dispatch(postDone());
    } catch (error) {
        dispatch(getError(error.message));
    }
}