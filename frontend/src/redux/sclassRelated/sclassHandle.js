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

export const getAllSclasses = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('classes')
            .select(`
                *,
                profiles(id, role, verification_status),
                subjects(id)
            `);

        if (error) {
            dispatch(getFailedTwo(error.message));
        } else {
            if (data && data.length > 0) {
                // Map to legacy fields for compatibility
                const mappedData = data.map(item => {
                    // Count only verified students
                    const studentCount = item.profiles ? item.profiles.filter(p => p.role === 'Student' && p.verification_status === 'verified').length : 0;
                    const subjectCount = item.subjects ? item.subjects.length : 0;

                    return {
                        ...item,
                        _id: item.id,
                        sclassName: item.sclass_name,
                        passoutYear: item.passout_year,
                        batchNumber: item.batch_number,
                        studentCount,
                        subjectCount
                    };
                });
                dispatch(getSuccess(mappedData));
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
            .from('profiles')
            .select('*')
            .eq('role', 'Student')
            .eq('sclass_id', id)
            .eq('verification_status', 'verified');

        if (error) {
            dispatch(getFailedTwo(error.message));
        } else {
            if (data && data.length > 0) {
                const mappedData = data.map(student => ({
                    ...student,
                    _id: student.id,
                    rollNum: student.roll_num,
                    registrationNum: student.registration_num
                }));
                dispatch(getStudentsSuccess(mappedData));
            } else {
                dispatch(getFailedTwo("No students found in this class"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getClassDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        const mappedData = data ? {
            ...data,
            _id: data.id,
            sclassName: data.sclass_name,
            passoutYear: data.passout_year,
            batchNumber: data.batch_number
        } : data;
        dispatch(detailsSuccess(mappedData));
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getSubjectList = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        let query = supabase.from('subjects').select('*, sclassName:sclass_id(*)');

        if (address === "ClassSubjects") {
            query = query.eq('sclass_id', id);
        }

        const { data, error } = await query;

        if (error) {
            dispatch(getFailed(error.message));
        } else {
            if (data && data.length > 0) {
                const mappedData = data.map(sub => ({
                    ...sub,
                    _id: sub.id,
                    subName: sub.sub_name,
                    subCode: sub.sub_code,
                    sclassName: sub.sclassName ? {
                        ...sub.sclassName,
                        _id: sub.sclassName.id,
                        sclassName: sub.sclassName.sclass_name
                    } : null
                }));
                dispatch(getSubjectsSuccess(mappedData));
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
                const mappedData = data.map(sub => ({
                    ...sub,
                    _id: sub.id,
                    subName: sub.sub_name,
                    subCode: sub.sub_code
                }));
                dispatch(getSubjectsSuccess(mappedData));
            } else {
                dispatch(getFailed("No free subjects found in this class"));
            }
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getSubjectDetails = (id) => async (dispatch) => {
    dispatch(getSubDetailsRequest());

    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*, classes:sclass_id (*)')
            .eq('id', id)
            .single();

        if (error) throw error;

        const mappedData = data ? {
            ...data,
            _id: data.id,
            subName: data.sub_name,
            subCode: data.sub_code,
            sclassName: data.classes ? {
                ...data.classes,
                _id: data.classes.id,
                sclassName: data.classes.sclass_name
            } : null
        } : data;

        dispatch(getSubDetailsSuccess(mappedData));
    } catch (error) {
        dispatch(getError(error.message));
    }
}