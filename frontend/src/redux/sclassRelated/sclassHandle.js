import { supabase } from '../../supabaseClient';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    detailsSuccess,
    getFailedTwo,
    getSubjectsSuccess,
    getSubDetailsSuccess,
    getSubDetailsRequest
} from './sclassSlice';

export const getAllSclasses = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .eq('school_id', id);

        if (error) {
            dispatch(getFailedTwo(error.message));
        } else {
            if (data && data.length > 0) {
                dispatch(getSuccess(data));
            } else {
                dispatch(getFailedTwo("No classes found"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getClassStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('sclass_id', id);

        if (error) {
            dispatch(getFailedTwo(error.message));
        } else {
            if (data && data.length > 0) {
                dispatch(getStudentsSuccess(data));
            } else {
                dispatch(getFailedTwo("No students found in this class"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getClassDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('classes')
            .select('*, school:school_id (*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        dispatch(detailsSuccess(data));
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getSubjectList = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .eq(address === "ClassSubjects" ? 'sclass_id' : 'school_id', id);

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                dispatch(getSubjectsSuccess(data));
            } else {
                dispatch(getFailed("No subjects found"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .is('teacher_id', null)
            .eq('sclass_id', id);

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                dispatch(getSubjectsSuccess(data));
            } else {
                dispatch(getFailed("No free subjects found in this class"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getSubjectDetails = (id, address) => async (dispatch) => {
    dispatch(getSubDetailsRequest());

    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*, classes:sclass_id (*), school:school_id (*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        dispatch(getSubDetailsSuccess(data));
    } catch (error) {
        dispatch(getError(error.message));
    }
}