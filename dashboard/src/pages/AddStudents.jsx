import { useState, useEffect } from "react";
import axios from "axios";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper,

    Box,
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
        year: ""};

    const validate = () => {
        let tempErrors = emptyStudentInfo;

        if (inputValues.idNumber.trim() === "") {
            tempErrors.idNumber = "Field is required";
        } else if (!/^\d+$/.test(inputValues.idNumber)) {
            tempErrors.idNumber = "Must be a whole number";
        }   

        if (inputValues.firstName.trim() === "") {
            tempErrors.firstName = "Field is required";
        } else if (!/^[A-Za-z\s-]+$/.test(inputValues.firstName)) {
            tempErrors.firstName = "Can only contain letters, spaces, and dash";
        }

        if (!/^[A-Za-z\s-]+$/.test(inputValues.middleName)) {
            tempErrors.middleName = "Can only contain letters, spaces, and dash";
        }

        
        if (inputValues.lastName.trim() === "") {
            tempErrors.lastName = "Field is required";
        } else if (!/^[A-Za-z\s-]+$/.test(inputValues.lastName)) {
            tempErrors.lastName = "Can only contain letters, spaces, and dash";
        }

        if (inputValues.course.trim() === "") {
            tempErrors.course = "Field is required";
        }

        if (inputValues.year.trim() === "") {
            tempErrors.year = "Field is required";
        } else if (!/^[1-5]$/.test(inputValues.year)) {
            tempErrors.year = "Must be an integer between 1 and 5";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const [inputValues, setInputValues] = useState(emptyStudentInfo);
    const [fieldErrorText, setFieldErrorText] = useState(emptyStudentInfo);

    const [editIndex, setEditIndex] = useState(null);
    const [students, setStudents] = useState([]);
    
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
        setInputValues(prevValues => (emptyStudentInfo));
        setFieldErrorText(prevValues => (emptyStudentInfo))
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
        alert("Run!");
        try {
            // if (!noInputErrors()) {
            //     clearStudentInfo();
            //     alert("Fix all errors   .");
            //     return;
            // }
            await axios.post("http://localhost:1337/add-student", {
                idNumber: inputValues.idNumber,
                firstName: inputValues.firstName,
                middleName: inputValues.middleName,
                lastName: inputValues.lastName,
                course: inputValues.course,
                year: inputValues.year
            });
            displayStudentInfo();
            alert("Student added!");
            fetchStudents();
            clearInputFields();

        } catch (error) {
            console.error(error)
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


    async function handleUpdateStudent() {
        try {
            await axios.put(`http://localhost:1337/edit-student/${editIndex}`,{
                idNumber: inputValues.idNumber,
                firstName: inputValues.firstName,
                middleName: inputValues.middleName,
                lastName: inputValues.lastName,
                course: inputValues.course,
                year: inputValues.year,
            });
            displayStudentInfo();
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
        const { id, value } = e.target;

        alert(value + ", course: " + inputValues.course);
        setInputValues({
            ...inputValues,
            [e.target.id]: e.target.value
        });
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
                    width: 600
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

                        
                    <TextField id="course" label="course" variant="outlined" fullWidth margin="normal"
                        select
                        required
                        value={inputValues.course}
                        onChange={(e) => changeCourse(e.target.value)}

                        error={!!errors.course}
                        helperText={errors.course}
                        

                            SelectProps={{
                                renderValue: (selected) => handleCourse(selected),
                            }}
                        >
                        
                        {courseAcronyms.map((c, index) => (
                            <MenuItem value={c}>{courses[index]}</MenuItem>
                        ))}
                        </TextField>


                    {/* <TextField id="course" label="Course" variant="outlined" fullWidth margin="normal"
                        select
                        required
                        value={inputValues.course}
                        onChange={changeInputValue}
                        sx={{textAlign: 'left'}}
                        error={!!errors.course}
                        helperText={errors.course}>

                        {courseAcronyms.map((c, index) => (
                            <MenuItem value={c}>{courses[index]}</MenuItem>
                        ))}
                    </TextField> */}

                    {/*<TextField id="course" label="Course" variant="outlined" fullWidth margin="normal"
                        required
                        error={fieldErrorText.course !== ""}
                        helperText={fieldErrorText.course}
                        value={inputValues.course}
                        onChange={(e) => changeInputValue("course", e.target.value)}
                        />*/}

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
                </form>
                <Paper
                    sx={{
                        padding: 4,
                        marginTop: 3
                    }}>
                    <h2>Student Preview</h2>
                    <table style={{ textAlign: "left" }}>
                        <tr>
                            <td>ID:</td>
                            <td id="preview-id"></td>
                        </tr>
                        <tr>
                            <td>Name:</td>
                            <td id="preview-name"></td>
                        </tr>
                        <tr>
                            <td>Course:</td>
                            <td id="preview-course"></td>
                        </tr>
                        <tr>
                            <td>Year:</td>
                            <td id="preview-year"></td>
                        </tr>
                    </table>
                </Paper>
            </Paper>
            <TableContainer
                component={Paper}
                sx={{
                    height: "90vh",
                    overflow: "auto"
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Middle Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {students.map((student, index) => (
                            <TableRow key={index}>
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