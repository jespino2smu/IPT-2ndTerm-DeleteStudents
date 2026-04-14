import { useState, useEffect } from "react";
import axios from "axios";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar,

    Box, Stack,
    TextField, Button,
    Select, MenuItem, InputLabel,
    Typography
} from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

function AddStudents() {
    const [errors, setErrors] = useState([]); 

    const emptyStudentInfo = {
        idNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        course: "",
        year: "",
        image: null};

    const validate = () => {
        let tempErrors = {};

        if (inputValues.idNumber.trim() === "") {
            tempErrors.idNumber = "Field is required";
        } else if (isNaN(inputValues.idNumber)) {
            tempErrors.idNumber = "Must be number";
        } else if (Number(inputValues.idNumber) < 1) {
            tempErrors.idNumber = "Must be positive";
        } if (students.some(item => item.idNumber === inputValues.idNumber)) {
            tempErrors.idNumber = "ID already exists";
        }

        if (inputValues.firstName.trim() === "") {
            tempErrors.firstName = "Field is required";
        } else if (!/^[A-Za-zÀ-ÿ\s-]+$/.test(inputValues.firstName)) {
            tempErrors.firstName = "Can only be letters, spaces, and dash";
        }

        if (inputValues.middleName.trim() === "") {}
        else if (!/^[A-Za-zÀ-ÿ\s-]+$/.test(inputValues.middleName)) {
            tempErrors.middleName = "Can blank or only be letters, spaces, and dash";
        }

        
        if (inputValues.lastName.trim() === "") {
            tempErrors.lastName = "Field is required";
        } else if (!/^[A-Za-zÀ-ÿ\s-]+$/.test(inputValues.lastName)) {
            tempErrors.lastName = "Can only be letters, spaces, and dash";
        }

        if (inputValues.course.trim() === "") {
            tempErrors.course = "Field is required";
        }

        if (inputValues.year.trim() === "") {
            tempErrors.year = "Field is required";
        } else if (!/^[1-5]$/.test(inputValues.year)) {
            tempErrors.year = "Must be from 1 to 5";
        }
        setErrors(tempErrors);
        
        
        return Object.keys(tempErrors).length === 0;
    };

    const [inputValues, setInputValues] = useState(emptyStudentInfo);
    const [fieldErrorText, setFieldErrorText] = useState(emptyStudentInfo);
    const [imageUrl, setImageUrl] = useState("");
    

    const [preview, setPreview] = useState(null);

    const [editIndex, setEditIndex] = useState(null);
    const [students, setStudents] = useState([]);

    const [currentStudentInfo, setCurrentStudentInfo] = useState(emptyStudentInfo);
    
    // ==============
    // Delete Dialog
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [dialogStudentInfo, setDialogStudentInfo] = useState({
        idNumber: "",
        firstName: "",
        middleName: "",
        lastName: ""});

    const handleDeleteDialogOpen = (index, student) => {
        setDeleteIndex(index);
        setDialogStudentInfo({
            idNumber: student.idNumber,
            firstName: student.firstName,
            middleName: student.middleName,
            lastName: student.lastName
        });
        setOpenDeleteDialog(true);
    };

    const handleDialogClose = () => setOpenDeleteDialog(false);

    const handleDeleteConfirm = () => {
        console.log("Confirmed!");
        setOpenDeleteDialog(false);
        handleDeleteStudent();
        setDeleteIndex(null);
    };


    const courseAcronyms = [
        "BSAR",
        "BSCE",
        "BSCP",
        "BSEE",
        "BSECE",
        "BSGE",
        "BSIT",
        "BLIS",
        "BSMATH",
    ];

    const courses = [
        "Architecture",
        "Civil Engineering",
        "Computer Engineering",
        "Electrical Engineering",
        "Electronics Engineering",
        "Geodetic Engineering",
        "Information Technology",
        "Library and Information Science",
        "Mathematics"
    ];


    async function handleDeleteStudent() {
        try {
            await axios.delete(`http://localhost:1337/delete-student/${deleteIndex}`,{});
            alert("Student deleted!");
            fetchStudents();
        } catch (error) {
            console.error(error);
        }
    }
    // ==============


    // ==============

    // const changeInputValue = (key, value) => {
    //     if (key === "idNumber") {
    //         value = value.replace(/\D/g, ''); 
    //     }

    //     setInputValues(prevInputValue => ({
    //         ...prevInputValue,
    //         [key]: value
    //     }));
        
    //     displayEmptyError(key, value);
    // };
    
    const displayEmptyError = (key, value) => {
        if (key === "middleName") {
            return;
        }

        if (value.trim() === "") {
            setFieldErrorText(prevState => ({
                ...prevState,
                [key]: "This field is required"
            }));
        } else {

            // if (key === "year" && !isInvalidYear()) {
            //     setFieldErrorText(prevState => ({
            //         ...prevState,
            //         [key]: "Please enter a valid year"
            //     }));
            //     return;
            // }

            setFieldErrorText(prevState => ({
                ...prevState,
                [key]: ""
            }));
        }
    };

    function isInvalidYear() {
        return isNaN(inputValues.year) || Number(inputValues.year) < 1900 || Number(inputValues.year) > new Date().getFullYear();
    }

    function noInputErrors() {
        const allFieldsHaveEmptyErrorText = Object.values(
            fieldErrorText).every(value => value === "");

        const allFieldsFilled = inputValues.idNumber.trim() !== "" &&
            inputValues.firstName.trim() !== "" &&
            inputValues.lastName.trim() !== "" &&
            inputValues.course.trim() !== "" &&
            inputValues.year.trim() !== "";

        return allFieldsHaveEmptyErrorText && allFieldsFilled && !isInvalidYear();
    }
    
    function clearInputFields() {
        setInputValues(emptyStudentInfo);
        setFieldErrorText(emptyStudentInfo)
        setEditIndex(null);
    }
    
    function displayStudentInfo() {
        let currentElement = document.getElementById("preview-id");
        currentElement.textContent = document.getElementById("id-number").value;

        const name =
            document.getElementById("first-name").value + " " +
            document.getElementById("middle-name").value + " " +
            document.getElementById("last-name").value;

        currentElement = document.getElementById("preview-name");
        currentElement.textContent = name;
        
        currentElement = document.getElementById("preview-course");
        currentElement.textContent = document.getElementById("course").value;

        currentElement = document.getElementById("preview-year");
        currentElement.textContent = document.getElementById("year").value;
    }
    
    function clearStudentInfo() {
        let currentElement = document.getElementById("preview-id");
        currentElement.textContent = "";
        
        currentElement = document.getElementById("preview-name");
        currentElement.textContent = "";
        
        currentElement = document.getElementById("preview-course");
        currentElement.textContent = "";

        currentElement = document.getElementById("preview-year");
        currentElement.textContent = "";
    }

    async function handleAddStudent() {
        if (!validate()) {
            //console.log("Form Data:", form);
            return;
        }
        try {
            const studentToAdd = {
                idNumber: inputValues.idNumber,
                firstName: inputValues.firstName,
                middleName: inputValues.middleName,
                lastName: inputValues.lastName,
                course: inputValues.course,
                year: inputValues.year
            }
            if (inputValues.image) {
                studentToAdd["image"] = inputValues.image;
            }
            await axios.post("http://localhost:1337/add-student",
                studentToAdd, {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            //alert("Ran");
            //displayStudentInfo();
            setCurrentStudentInfo(studentToAdd);

            alert("Student added!");
            fetchStudents();
            clearInputFields();

        } catch (error) {
            console.error(error)
            //alert(error);
        }
    }

    function fetchStudents() {
        axios
            .get("http://localhost:1337/students")
            .then((response) => {
                setStudents(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);


    async function handleUpdateStudent() {
        try {

            const studentToUpdate = {
                idNumber: inputValues.idNumber,
                firstName: inputValues.firstName,
                middleName: inputValues.middleName,
                lastName: inputValues.lastName,
                course: inputValues.course,
                year: inputValues.year
            }

            if (inputValues.image) {
                studentToUpdate["image"] = inputValues.image;
            }

            await axios.put(`http://localhost:1337/edit-student/${editIndex}`,
                studentToUpdate,{
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            setCurrentStudentInfo(studentToUpdate);
            
            alert("Student updated!");
            fetchStudents();
            clearInputFields();
        } catch (error) {
            console.error(error);
        }
    }
    
    function handleEdit(student, index) {
        setInputValues({
            idNumber: student.idNumber,
            firstName: student.firstName,
            middleName: student.middleName,
            lastName: student.lastName,
            course: student.course,
            year: student.year,
        });

        setEditIndex(index);
    }


    
    function handleCourse(selected) {
        if (inputValues.course === "BLIS") {
            return "Bachelor in " + courses[courseAcronyms.indexOf(selected)];
        } else {
            return "Bachelor of Science in " + courses[courseAcronyms.indexOf(selected)];
        }
        
    }

    const changeInputValue = (e) => {
        const { id, value, files } = e.target;

        //alert(value + ", course: " + inputValues.course);

        if (id === "image") { 
            const file = files[0];

            setInputValues({
                ...inputValues,
                image: file
            });
            
            if (file) {
                setPreview(URL.createObjectURL(file));
            }

        } else {
            setInputValues({
                ...inputValues,
                [e.target.id]: e.target.value
            });
        }
    };
    
    const changeCourse = (value) => {
        setInputValues(prevInputValue => ({
            ...prevInputValue,
            course: value
        }));
    };

    return (
        <>
            <Dialog
                open={openDeleteDialog}
                onClose={handleDialogClose}>

                <DialogTitle>{"Delete this user?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete this student:<br/>
                            <blockquote>[{dialogStudentInfo.idNumber}] {dialogStudentInfo.firstName} {dialogStudentInfo.middleName} {dialogStudentInfo.lastName}</blockquote>
                            This action cannot be undone.
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

        <div style={{ display: "flex", flexDirection: "row",justifyContent: "center", gap: 20 }}>
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    maxWidth: '450px'
                }}
            >
                <h2>Add Student</h2>

                <form
                    // onSubmit={handleAddStudent}
                    >

                    <TextField id="idNumber" label="ID Number" variant="outlined" fullWidth margin="normal"
                        required
                        // type="number"
                        value={inputValues.idNumber}
                        onChange={changeInputValue}

                        error={!!errors.idNumber}
                        helperText={errors.idNumber}
                        />

                    <TextField id="firstName" label="First Name" variant="outlined" fullWidth margin="normal"
                        required
                        value={inputValues.firstName}
                        onChange={changeInputValue}
                        
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        />

                    <TextField id="middleName" label="Middle Name" variant="outlined" fullWidth
                        value={inputValues.middleName}
                        onChange={changeInputValue}
                        
                        error={!!errors.middleName}
                        helperText={errors.middleName}
                        />

                    <TextField id="lastName" label="Last Name" variant="outlined" fullWidth margin="normal"
                        required
                        value={inputValues.lastName}
                        onChange={changeInputValue}

                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        />

                        
                    <TextField id="course" label="Course" variant="outlined" fullWidth margin="normal"
                        select
                        required
                        value={inputValues.course}
                        onChange={(e) => changeCourse(e.target.value)}

                        error={!!errors.course}
                        helperText={errors.course}
                                sx={{textAlign: 'left'}}
                        

                            SelectProps={{
                                renderValue: (selected) => handleCourse(selected),
                            }}
                        >
                        
                        {courseAcronyms.map((c, index) => (
                            <MenuItem
                                value={c}
                                >{courses[index]}</MenuItem>
                        ))}
                        </TextField>

                    <TextField id="year" label="Year" variant="outlined" fullWidth margin="normal"
                        required
                        // type="number"
                        value={inputValues.year}
                        onChange={changeInputValue}
                        inputProps={{ 
                            pattern: "[1-5]{1}"
                        }}

                        error={!!errors.year}
                        helperText={errors.year}
                        />

                    {preview && (
                        <Box sx={{ mt: 2 }}>
                            <Typography>Image Preview:</Typography>
                            <img
                            src={preview}
                            alt="preview"
                            style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                            />
                        </Box>
                    )}

                    <Stack spacing="5px">
                        <Button variant="contained" component="label"
                            sx={{ mt: 2 }}>
                            Upload Image
                            <input
                                id="image" 
                                type="file"
                                name="image"
                                hidden
                                accept="image/*"
                                onChange={changeInputValue}
                            />
                        </Button>

                    {/* <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button> */}

                        {editIndex === null ? (
                            <Button variant="contained" color="primary" onClick={handleAddStudent}>Add Student</Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={handleUpdateStudent}>Update Student</Button>
                        )}
                    </Stack>
                </form>
                <Paper
                    sx={{
                        padding: 4,
                        marginTop: 3
                    }}
                >
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>ID:</TableCell>
                                <TableCell
                                    align="left">
                                    {currentStudentInfo.idNumber}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Name:</TableCell>
                                <TableCell
                                    align="left">
                                    {currentStudentInfo.firstName}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Course:</TableCell>
                                <TableCell
                                    align="left">
                                    {currentStudentInfo.course}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Year:</TableCell>
                                <TableCell
                                    align="left">
                                    {currentStudentInfo.year}
                                    </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </Paper>
            </Paper>
            <TableContainer
                component={Paper}
                sx={{
                    height: "90vh",
                    overflowY: "auto",
                    width: '1200px',
                    maxWidth: '1200px',
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Middle Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {students.map((student, index) => (
                            <TableRow key={index}>
                                <TableCell><Avatar src={student.image}/></TableCell>
                                <TableCell>{student.idNumber}</TableCell>
                                <TableCell>{student.firstName}</TableCell>
                                <TableCell>{student.middleName}</TableCell>
                                <TableCell>{student.lastName}</TableCell>
                                <TableCell>{student.course}</TableCell>
                                <TableCell>{student.year}</TableCell>
                                <TableCell
                                    
                                    sx={{
                                        display: "flex",
                                        gap: "12px"
                                    }}>
                                    <Button variant="contained" color="primary"
                                        sx={{
                                            backgroundColor: "#5496e0",
                                            color: "white",
                                            '&:hover': {
                                                backgroundColor: "#2777b2"
                                            }
                                        }}
                                        onClick={() => handleEdit(student, index)}>Edit</Button>
                                    <Button variant="contained"
                                        sx={{
                                            backgroundColor: "#e09090",
                                            color: "white",
                                            '&:hover': {
                                                backgroundColor: "#a75454"
                                            }
                                        }}
                                        onClick={() => handleDeleteDialogOpen(index, student)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        
        </>
    );
}

export default AddStudents