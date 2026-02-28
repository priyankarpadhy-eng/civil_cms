import { supabase } from '../../supabaseClient';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getRequest,
    getError,
} from './userSlice';

const mapAddressToTable = (address) => {
    const map = {
        'Student': 'students',
        'Admin': 'admins',
        'Teacher': 'teachers',
        'Alumni': 'alumni'
    };
    return map[address] || address.toLowerCase() + 's';
};

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const table = mapAddressToTable(role);

        // For simplicity during migration, we query the table directly.
        // In a production app, you should use Supabase Auth (auth.signInWithPassword).
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq(role === 'Student' ? 'roll_num' : 'email', fields.rollNum || fields.email)
            .eq('password', fields.password)
            .single();

        if (error || !data) {
            dispatch(authFailed(error?.message || "Invalid credentials"));
            return;
        }

        // Map Postgres snake_case back to frontend camelCase if needed,
        // but for now, we'll suggest passing data as is.
        dispatch(authSuccess(data));
    } catch (error) {
        dispatch(authError(error.message));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const table = mapAddressToTable(role);

        const { data, error } = await supabase
            .from(table)
            .insert([fields])
            .select()
            .single();

        if (error) {
            dispatch(authFailed(error.message));
            return;
        }

        if (role === 'Admin') {
            dispatch(authSuccess(data));
        } else {
            dispatch(stuffAdded());
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const table = mapAddressToTable(address);
        const { data, error } = await supabase
            .from(table)
            .select(`
                *,
                classes:sclass_id (*),
                school:school_id (*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        dispatch(doneSuccess(data));
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    dispatch(getError("Delete function is restricted at the moment."));
}

export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const table = mapAddressToTable(address);
        const { data, error } = await supabase
            .from(table)
            .update(fields)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        if (address === 'Admin' || data.role) {
            dispatch(authSuccess(data));
        } else {
            dispatch(doneSuccess(data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}

export const getStudentBySlug = (slug) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('students')
            .select(`
                *,
                classes:sclass_id (*),
                school:school_id (*),
                subjects:exam_results->subName (*)
            `)
            .eq('portfolio_slug', slug)
            .single();

        if (error) throw error;
        dispatch(doneSuccess(data));
    } catch (error) {
        dispatch(getError(error.message));
    }
}
