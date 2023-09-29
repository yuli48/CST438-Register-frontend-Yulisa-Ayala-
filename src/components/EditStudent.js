import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const EditStudent = ({ student, onEdit, onClose }) => {
  const [editedStudent, setEditedStudent] = useState({ ...student });

  useEffect(() => {
    setEditedStudent({ ...student });
  }, [student]);

  const InputChange = (event) => {
    const { name, value } = event.target;
    setEditedStudent({
      ...editedStudent,
      [name]: value,
    });
  };

  const Submit = () => {
    fetch(`http://localhost:8080/students/${editedStudent.studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedStudent),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((updatedStudent) => {
        onEdit(updatedStudent);
        onClose();
      })
      .catch((error) => console.error('Error updating student:', error));
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Student</DialogTitle>
      <DialogContent>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedStudent.name || ""}
            onChange={InputChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedStudent.email || ""}
            onChange={InputChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={Submit} color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudent;