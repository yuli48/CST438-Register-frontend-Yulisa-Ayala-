import React, { useState } from 'react';
import {SERVER_URL} from '../constants'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const EditStudent = (props)  => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [student, setStudent] = useState(props.student);

    /*
     *  dialog for edit student
     */
    const editOpen = (event) => {
        setOpen(true);
        setEditMessage('');
    };

    const editClose = () => {
        setOpen(false);
        props.onClose();
    };

    const editChange = (event) => {
        setStudent({...student,  [event.target.name]:event.target.value})
    }

    const editSave = () => {
        console.log("editStudent "+JSON.stringify(student));
        fetch(`${SERVER_URL}/student/${student.studentId}`, 
            {  
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify(student)
            } 
        )
        .then((response) => {
            if (response.ok) return; 
            else return response.json(); 
        })
        .then((data) => {
            if (data) {
                if (data.message) setEditMessage('Student not saved. '+data.message);
                else setEditMessage('Student not saved.');
            } else setEditMessage('Student saved.');
        })
        .catch((err) =>  { setEditMessage('Error. '+err) } );
    }

    return (
        <div>
        <button type="button" margin="auto" onClick={editOpen}>Edit</button>
        <Dialog open={open} >
            <DialogTitle>Edit Student</DialogTitle>
            <DialogContent  style={{paddingTop: 20}} >
                <h4>{editMessage}</h4>
                <TextField fullWidth label="student id" name="studentId" value={student.studentId} InputProps={{readOnly: true, }}/>
                <TextField autoFocus fullWidth label="name" name="name" value={student.name} onChange={editChange}  /> 
                <TextField fullWidth label="email" name="email" value={student.email} onChange={editChange}  /> 
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={editClose}>Close</Button>
                <Button color="primary" onClick={editSave}>Save</Button>
            </DialogActions>
        </Dialog> 
        </div>                       
    )
}

export default EditStudent;