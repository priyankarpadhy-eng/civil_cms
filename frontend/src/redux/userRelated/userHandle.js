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
        'Alumni': 'alumni',
        'Sclass': 'classes',
        'Subject': 'subjects',
        'Notice': 'notices',
        'Complain': 'complains'
    };
    return map[address] || address.toLowerCase() + 's';
};

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const table = mapAddressToTable(role);

        // For simplicity during migration, we query the table directly.
        // In a production app, you should use Supabase Auth (auth.signInWithPassword).
        let selectQuery = "*";
        if (role === 'Student') {
            selectQuery = `
                *,
                sclassName:sclass_id (*),
                school:school_id (*)
            `;
        } else if (role === 'Teacher') {
            selectQuery = `
                *,
                teachSclass:teach_sclass_id (*),
                teachSubject:teach_subject_id (*),
                school:school_id (*)
            `;
        } else if (role === 'Admin') {
            selectQuery = `*`;
        }

        const { data, error } = await supabase
            .from(table)
            .select(selectQuery)
            .eq(role === 'Student' ? 'roll_num' : 'email', fields.rollNum || fields.email)
            .eq('password', fields.password)
            .single();

        if (error || !data) {
            dispatch(authFailed(error?.message || "Invalid credentials"));
            return;
        }

        // Map Postgres snake_case back to frontend camelCase for compatibility
        let compatData = { ...data, _id: data.id };
        if (role === 'Student') {
            compatData.rollNum = data.roll_num;
            if (data.sclassName) {
                compatData.sclassName = {
                    ...data.sclassName,
                    _id: data.sclassName.id,
                    sclassName: data.sclassName.sclass_name || data.sclassName.sclassName
                };
            }
        } else if (role === 'Teacher') {
            if (data.teachSclass) {
                compatData.teachSclass = {
                    ...data.teachSclass,
                    _id: data.teachSclass.id,
                    sclassName: data.teachSclass.sclass_name
                }
            }
            if (data.teachSubject) {
                compatData.teachSubject = {
                    ...data.teachSubject,
                    _id: data.teachSubject.id,
                    subName: data.teachSubject.sub_name
                }
            }
        }

        dispatch(authSuccess(compatData));
    } catch (error) {
        dispatch(authError(error.message));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const table = mapAddressToTable(role);

        let mappedFields = { ...fields };
        if (role === 'Admin') {
            mappedFields = {
                school_name: fields.schoolName,
                email: fields.email,
                password: fields.password,
                role: 'Admin'
            };
        } else if (role === 'Student') {
            mappedFields = {
                name: fields.name,
                roll_num: fields.rollNum,
                password: fields.password,
                sclass_id: fields.sclassName,
                school_id: fields.adminID,
                role: 'Student'
            };
        } else if (role === 'Teacher') {
            mappedFields = {
                name: fields.name,
                email: fields.email,
                password: fields.password,
                role: 'Teacher',
                school_id: fields.adminID
            };
        }

        const { data, error } = await supabase
            .from(table)
            .insert([mappedFields])
            .select()
            .single();

        if (error) {
            dispatch(authFailed(error.message));
            return;
        }

        if (role === 'Admin') {
            const compatData = data ? { ...data, _id: data.id } : data;
            dispatch(authSuccess(compatData));
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

        // Map Postgres snake_case back to frontend camelCase for compatibility
        const compatData = {
            ...data,
            _id: data.id,
            sclassName: data.classes ? {
                ...data.classes,
                _id: data.classes.id,
                sclassName: data.classes.sclass_name || data.classes.sclassName
            } : (data.sclass_id || null),
            schoolName: data.school ? data.school.school_name : (data.school_name || null)
        };

        dispatch(doneSuccess(compatData));
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
        let updateData = { ...fields };

        // Mapping common and face-related fields
        if (fields.faceData) {
            updateData.face_data = fields.faceData;
            delete updateData.faceData;
        }
        if (fields.faceCaptured) {
            updateData.face_captured = fields.faceCaptured;
            delete updateData.faceCaptured;
        }
        if (fields.faceDescriptor) {
            updateData.face_descriptor = fields.faceDescriptor;
            delete updateData.faceDescriptor;
        }
        if (fields.adminID) {
            updateData.school_id = fields.adminID;
            delete updateData.adminID;
        }
        if (fields.rollNum) {
            updateData.roll_num = fields.rollNum;
            delete updateData.rollNum;
        }

        const { data, error } = await supabase
            .from(table)
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Ensure compatibility mapping for the rest of the app
        const compatData = data ? { ...data, _id: data.id } : data;

        if (address === 'Admin' || compatData.role) {
            dispatch(authSuccess(compatData));
        } else {
            dispatch(doneSuccess(compatData));
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

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const table = mapAddressToTable(address);
        let insertData = { ...fields };

        // 1. Mandatory Core Mappings (Always delete specific camelCase keys)
        if (fields.adminID) {
            insertData.school_id = fields.adminID;
        }
        delete insertData.adminID; // Always delete to avoid column errors even if falsy

        // 2. Conditional Class/Sclass Mappings
        if (address === 'Sclass') {
            if (fields.sclassName) insertData.sclass_name = fields.sclassName;
            if (fields.passoutYear) insertData.passout_year = fields.passoutYear;
            if (fields.batchNumber) insertData.batch_number = fields.batchNumber;

            delete insertData.sclassName;
            delete insertData.passoutYear;
            delete insertData.batchNumber;
        }

        // 3. Subject Mappings
        else if (address === 'Subject') {
            if (fields.sclassName) insertData.sclass_id = fields.sclassName;
            delete insertData.sclassName;
        }

        // 4. Student Mappings
        else if (address === 'Student') {
            if (fields.sclassName) insertData.sclass_id = fields.sclassName;
            if (fields.rollNum) insertData.roll_num = fields.rollNum;

            delete insertData.sclassName;
            delete insertData.rollNum;
        }

        // 5. Notice/Complain Mappings (Standardize school_id)
        else if (address === 'Notice' || address === 'Complain') {
            // Already handled by general adminID -> school_id mapper above
        }

        // Final sanity check: Ensure no undefined keys are sent that PostgREST might map to columns
        Object.keys(insertData).forEach(key => {
            if (insertData[key] === undefined) {
                delete insertData[key];
            }
        });

        const { data, error } = await supabase
            .from(table)
            .insert([insertData])
            .select()
            .single();

        if (error) {
            dispatch(authFailed(error.message));
        } else {
            const compatData = data ? { ...data, _id: data.id } : data;
            dispatch(stuffAdded(compatData));
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};

export const bulkAddStudents = (payload) => async (dispatch) => {
    dispatch(authRequest());
    try {
        const { students, adminID, sclassName } = payload;

        const mappedFields = students.map(f => ({
            name: f.name,
            roll_num: f.rollNum,
            registration_num: f.registrationNum,
            current_semester: f.currentSemester,
            password: f.password,
            sclass_id: sclassName,
            school_id: adminID,
            role: 'Student'
        }));

        const { data, error } = await supabase
            .from('students')
            .insert(mappedFields);

        if (error) {
            dispatch(authFailed(error.message));
        } else {
            dispatch(stuffAdded());
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};
