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

// 1. Unified Auth Login
export const loginUser = (fields) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const { data: { user }, error: authErrorMsg } = await supabase.auth.signInWithPassword({
            email: fields.email,
            password: fields.password,
        });

        if (authErrorMsg) {
            dispatch(authFailed(authErrorMsg.message));
            return;
        }

        if (user) {
            // Fetch User Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                dispatch(authFailed(profileError.message));
                return;
            }

            dispatch(authSuccess({ ...profile, _id: profile.id }));
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};

// 2. Unified Auth Register
export const registerUser = (fields) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const { data: { user }, error: authErrorMsg } = await supabase.auth.signUp({
            email: fields.email,
            password: fields.password,
            options: {
                data: {
                    name: fields.name,
                    phone: fields.phone,
                }
            }
        });

        if (authErrorMsg) {
            dispatch(authFailed(authErrorMsg.message));
            return;
        }

        if (user) {
            dispatch(stuffAdded("Verification email sent! Please check your inbox."));
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};

// 3. User Details (Unified)
export const getUserDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            dispatch(getError(error.message));
        } else {
            dispatch(doneSuccess({ ...data, _id: data.id }));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

// 4. Update Profile (Detailed onboarding)
export const updateUser = (fields, id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(fields)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            dispatch(authFailed(error.message));
        } else {
            // Update current user state as well if it's the logged-in user
            dispatch(authSuccess({ ...data, _id: data.id }));
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};

// 5. Admin: Get All Users
export const getAllUsers = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            dispatch(getError(error.message));
        } else {
            // We use tempDetails to store the list of all users for the admin page
            dispatch(stuffAdded(data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

// 6. Admin: Update Role
export const updateUserRole = (userId, newRole) => async (dispatch) => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) throw error;

        // Refresh list
        dispatch(getAllUsers());
    } catch (error) {
        dispatch(authError(error.message));
    }
};

export const logoutUser = () => (dispatch) => {
    supabase.auth.signOut();
    dispatch(authLogout());
};

// Kept for backward compatibility if needed, but simplified
export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());
    try {
        const { error } = await supabase.from(address.toLowerCase() + 's').insert([fields]);
        if (error) throw error;
        dispatch(stuffAdded());
    } catch (error) {
        dispatch(authError(error.message));
    }
};
