import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    FormControlLabel,
    Tab,
    Tabs,
    Avatar,
    Chip,
    CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { updateUser } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import { supabase } from '../../supabaseClient';

const PersonnelManagement = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [tab, setTab] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [{ data: tData, error: tErr }, { data: sData, error: sErr }] = await Promise.all([
                supabase.from('profiles').select('*, sclassName:sclass_id(*)').eq('role', 'Faculty'),
                supabase.from('profiles').select('*, classes:sclass_id(*)').eq('role', 'Student')
            ]);

            if (tErr) throw tErr;
            if (sErr) throw sErr;

            setTeachers(tData?.map(t => ({ ...t, _id: t.id })) || []);
            setStudents(sData?.map(s => ({ ...s, _id: s.id, sclassName: s.classes ? { ...s.classes, sclassName: s.classes.sclass_name } : null })) || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentUser]);

    const handleToggle = async (id, role, field, value) => {
        try {
            const { error } = await supabase.from('profiles').update({ [field]: value }).eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight={900} gutterBottom>Personnel Role Management</Typography>
                <Typography variant="body1" color="textSecondary">Assign roles like HOD, Branch Reps, CDC Coordinators, and Alumni status.</Typography>
            </Box>

            <Paper sx={{ borderRadius: '24px', overflow: 'hidden' }}>
                <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
                    <Tab label="Faculty Roles" sx={{ fontWeight: 800 }} />
                    <Tab label="Student Roles" sx={{ fontWeight: 800 }} />
                </Tabs>

                <Box p={3}>
                    {loading ? <CircularProgress /> : (
                        tab === 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 900 }}>Faculty Name</TableCell>
                                            <TableCell sx={{ fontWeight: 900 }}>Designation</TableCell>
                                            <TableCell sx={{ fontWeight: 900 }}>Is HOD?</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {teachers.map((t) => (
                                            <TableRow key={t._id}>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Avatar>{t.name.charAt(0)}</Avatar>
                                                        <Typography fontWeight={700}>{t.name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{t.designation}</TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={t.isHOD || false}
                                                        onChange={(e) => handleToggle(t._id, "Teacher", "isHOD", e.target.checked)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 900 }}>Student Name</TableCell>
                                            <TableCell sx={{ fontWeight: 900 }}>Batch</TableCell>
                                            <TableCell sx={{ fontWeight: 900 }}>Branch Rep</TableCell>
                                            <TableCell sx={{ fontWeight: 900 }}>CDC Coord.</TableCell>
                                            <TableCell sx={{ fontWeight: 900 }}>Alumni</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {students.map((s) => (
                                            <TableRow key={s._id}>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Avatar>{s.name.charAt(0)}</Avatar>
                                                        <Typography fontWeight={700}>{s.name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{s.sclassName?.sclassName}</TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={s.isBranchRep || false}
                                                        onChange={(e) => handleToggle(s._id, "Student", "isBranchRep", e.target.checked)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={s.isCDC || false}
                                                        onChange={(e) => handleToggle(s._id, "Student", "isCDC", e.target.checked)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={s.isAlumni || false}
                                                        onChange={(e) => handleToggle(s._id, "Student", "isAlumni", e.target.checked)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default PersonnelManagement;
