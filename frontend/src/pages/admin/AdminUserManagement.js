import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    Avatar,
    InputBase,
    CircularProgress,
    Button
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    AdminPanelSettings as AdminIcon,
    School as StudentIcon,
    Person as FacultyIcon,
    Groups as CdcIcon,
    Badge as RepIcon
} from '@mui/icons-material';
import styled from 'styled-components';
import { getAllUsers, updateUserRole } from '../../redux/userRelated/userHandle';

const AdminUserManagement = () => {
    const dispatch = useDispatch();
    const { tempDetails: usersList, loading, error } = useSelector(state => state.user);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleOpenMenu = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleRoleUpdate = (newRole) => {
        if (selectedUser) {
            dispatch(updateUserRole(selectedUser.id, newRole));
        }
        handleCloseMenu();
    };

    const filteredUsers = Array.isArray(usersList) ? usersList.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const getRoleChip = (role) => {
        switch (role) {
            case 'Admin': return <Chip size="small" icon={<AdminIcon />} label="Admin" color="error" sx={{ fontWeight: 700 }} />;
            case 'Faculty': return <Chip size="small" icon={<FacultyIcon />} label="Faculty" color="primary" sx={{ fontWeight: 700 }} />;
            case 'CdcCoordinator': return <Chip size="small" icon={<CdcIcon />} label="CDC Coordinator" color="secondary" sx={{ fontWeight: 700 }} />;
            case 'CdcFaculty': return <Chip size="small" icon={<CdcIcon />} label="CDC Faculty" color="info" sx={{ fontWeight: 700 }} />;
            case 'BranchRep': return <Chip size="small" icon={<RepIcon />} label="Branch Rep" color="success" sx={{ fontWeight: 700 }} />;
            default: return <Chip size="small" icon={<StudentIcon />} label="Student" variant="outlined" sx={{ fontWeight: 600 }} />;
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--clr-text-primary)', mb: 1 }}>
                        User Directory
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--clr-text-muted)' }}>
                        Manage roles and access permissions for the entire department
                    </Typography>
                </Box>

                <SearchBox>
                    <SearchIcon sx={{ color: 'var(--clr-text-muted)', mr: 1 }} />
                    <InputBase
                        placeholder="Search users..."
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ color: 'inherit', fontSize: '0.9rem' }}
                    />
                </SearchBox>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : (
                <TableContainer component={Paper} sx={{
                    borderRadius: '20px',
                    background: 'var(--clr-surface-1)',
                    border: '1px solid var(--clr-border)',
                    boxShadow: 'none',
                    overflow: 'hidden'
                }}>
                    <Table>
                        <TableHead sx={{ background: 'var(--clr-surface-2)' }}>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Registered On</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'var(--clr-primary)', fontWeight: 800 }}>
                                                {user.name?.charAt(0)}
                                            </Avatar>
                                            <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleChip(user.role)}</TableCell>
                                    <TableCell sx={{ color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => handleOpenMenu(e, user)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{ sx: { borderRadius: '12px', minWidth: '180px', mt: 1 } }}
            >
                <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', fontWeight: 800, color: 'text.secondary' }}>
                    SET ROLE AS
                </Typography>
                <MenuItem onClick={() => handleRoleUpdate('Admin')}>Administrator</MenuItem>
                <MenuItem onClick={() => handleRoleUpdate('Faculty')}>Faculty Member</MenuItem>
                <MenuItem onClick={() => handleRoleUpdate('CdcCoordinator')}>CDC Coordinator</MenuItem>
                <MenuItem onClick={() => handleRoleUpdate('CdcFaculty')}>CDC Faculty</MenuItem>
                <MenuItem onClick={() => handleRoleUpdate('BranchRep')}>Branch Representative</MenuItem>
                <MenuItem onClick={() => handleRoleUpdate('Student')}>Standard Student</MenuItem>
            </Menu>
        </Box>
    );
};

export default AdminUserManagement;

const SearchBox = styled.div`
    display: flex;
    align-items: center;
    background: var(--clr-surface-2);
    border: 1px solid var(--clr-border);
    border-radius: 12px;
    padding: 8px 16px;
    width: 350px;
    transition: all 0.2s;
    &:focus-within { border-color: var(--clr-primary); box-shadow: 0 0 0 3px var(--clr-primary-glow); }
`;
