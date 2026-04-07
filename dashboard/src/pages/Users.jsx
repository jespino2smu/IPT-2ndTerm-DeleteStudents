import axios from "axios";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { Table, TableHead, TableCell, TableBody, TableRow } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";


function Users() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    const [users, setUsers] = useState([]);

    // ==============
    // Delete Dialog
        const [open, setOpen] = useState(false);

        const handleDeleteDialogOpen = (index) => {
            setEditIndex(index);
            setOpen(true);
        };

        const handleDialogClose = () => setOpen(false);

        const handleDeleteConfirm = () => {
            console.log("Confirmed!");
            setOpen(false);
            handleDeleteUser(editIndex);
            setEditIndex(null);
        };
    // ==============

    function fetchUsers() {
        axios
            .get("http://localhost:1337/users")
            .then((response) => {
                setUsers(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    async function handleAddUser() {
        try {
            await axios.post("http://localhost:1337/add-user", {
                name: name,
                email: email,
                password: password
            });
            alert("User added!");
            fetchUsers();
            clearFields();

        } catch (error) {
            console.error(error)
        }
    }

    async function handleUpdateUser() {
        try {
            await axios.put(`http://localhost:1337/edit-user/${editIndex}`,{
                name: name,
                email: email,
                password: password,
            });
            alert("User updated!");
            fetchUsers();
            clearFields();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteUser(index) {
        try {
            await axios.delete(`http://localhost:1337/delete-user/${index}`,{
                name: name,
                email: email,
                password: password,
            });
            alert("User deleted!");
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    }

    function handleEdit(user, index) {
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
        setEditIndex(index);
    }

    function clearFields() {
        setName("");
        setEmail("");
        setPassword("");
        setEditIndex(null);
    }


    return (
        <div className="content">
            <div>
                <h1>Users</h1>
                <TextField label="Name" variant="outlined" fullWidth margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />

                <TextField label="Email" variant="outlined" fullWidth margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />

                <TextField label="Password" variant="outlined" fullWidth margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" />

                {editIndex === null ? (
                    <Button variant="contained" color="primary" onClick={handleAddUser}>Add User</Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleUpdateUser}>Update User</Button>
                )}
            </div>
            <Dialog
                open={open}
                onClose={handleDialogClose}>

                <DialogTitle>{"Are you sure?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete this user? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={handleDialogClose}
                            >Cancel</Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error" autoFocus>
                            OK</Button>
                    </DialogActions>
            </Dialog>
            
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Password</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                {users.map((user, index) => (
                    <TableBody>
                        <TableRow key={index}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.password}</TableCell>
                            <TableCell
                                sx={{
                                    display: "flex",
                                    gap: "12px"
                                }}>
                                <Button variant="outlined" onClick={() => handleEdit(user, index)}>Edit</Button>
                                <Button variant="outlined"
                                    sx={{
                                        borderColor: "red",
                                        color: "red",
                                        '&:hover': {
                                            backgroundColor: '#f1ebeb'
                                        },
                                    }}
                                    onClick={() => handleDeleteDialogOpen(index)}
                                    >Delete</Button>
                            </TableCell>
                            
                        </TableRow>
                    </TableBody>
                ))}
            </Table>
        </div>
    )
}
export default Users