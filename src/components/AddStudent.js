import React, { useState } from 'react';
import {SERVER_URL} from '../constants'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

/*
 *    <AddStudent onClose=<routine> />
 */
function AddStudent(props) { 

  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState({name:'', email:''});
  const [message, setMessage] = useState('');
  
  const handleClickOpen = () => {
    setMessage('');
    setStudent({name:'', email:''});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const handleChange = (event) => {
    setStudent({...student,  [event.target.name]:event.target.value})
  }

    const addStudent = () => {
        console.log("addStudent "+JSON.stringify(student));
        fetch(`${SERVER_URL}/student`, 
            {  
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify(student)
            } 
        )
        .then((response) => response.json() )
        .then((data) => {
          if (data.message) setMessage('Student not added. '+data.message);
          else if (data) setMessage('Student added. ID='+data);
           else setMessage('Student not added. ');
        })
        .catch((err) =>  { setMessage('Error. '+err) } );
    }


  return (
      <div>
        <Button variant="outlined" color="primary" style={{margin: 10}} onClick={handleClickOpen}>
          New Student
        </Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New Student</DialogTitle>
            <DialogContent  style={{paddingTop: 20}} >
              <h4>{message}</h4>
              <TextField autoFocus fullWidth label="name" name="name" onChange={handleChange}  /> 
              <TextField fullWidth label="email" name="email" onChange={handleChange}  /> 
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={handleClose}>Close</Button>
              <Button id="Add" color="primary" onClick={addStudent}>Add Student</Button>
            </DialogActions>
          </Dialog>      
      </div>
  ); 
}


export default AddStudent;