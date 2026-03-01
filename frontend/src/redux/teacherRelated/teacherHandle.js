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
            .select('*, teachSclass:teach_sclass_id(*), teachSubject:teach_subject_id(*)')
            .eq('school_id', id);

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
                    } : null,
                    teachSubject: teacher.teachSubject ? {
                        ...teacher.teachSubject,
                        _id: teacher.teachSubject.id,
                        subName: teacher.teachSubject.sub_name
                    } : null
                }));
                dispatch(getSuccess(mappedData));
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
        const mappedData = data ? {
            ...data,
            _id: data.id,
            teachSclass: data.teach_sclass ? {
                ...data.teach_sclass,
                _id: data.teach_sclass.id,
                sclassName: data.teach_sclass.sclass_name
            } : null,
            teachSubject: data.teach_subject ? {
                ...data.teach_subject,
                _id: data.teach_subject.id,
                subName: data.teach_subject.sub_name
            } : null
        } : data;
        dispatch(doneSuccess(mappedData));
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