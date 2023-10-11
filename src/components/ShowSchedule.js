import React, { useState, useEffect } from 'react';
import AddCourse from './AddCourse';
import {SERVER_URL, SEMESTERS} from '../constants';
/* 
 *  Displays a student schedule with DROP button for each course. 
 *  <SchedList courses={data} dropCourse={func} />
 *     data is an array of course data.  Each course consists of 
 *       id - enrollment primary key used to drop course (not displayed to user)
 *       course_id - number that identifies course 
 *       section -  course section number
 *       title - course title
 *       times - days and times for class
 *       building - classroom location 
 *       room 
 *       grade - the letter grade for completed courses
 * 
 *     func is the function to call to drop a course
*/


const ShowSchedule = () => {
    
    const params = new URLSearchParams(window.location.search);
    const termId = params.get("termId"); 
    const [courses, setCourses] = useState([]);  // list of courses
    const [message, setMessage] = useState(' ');  // status message

    useEffect(() => {
        // call when termId is changed.
        fetchCourses(termId);
        }, [termId]);


  /*
   *  GET enrolled courses for given term
   */ 
    const fetchCourses = (termId) => {
        const {year, semester} = SEMESTERS[termId];
        console.log("fetchCourses "+year+" "+semester);
        fetch(`${SERVER_URL}/schedule?year=${year}&semester=${semester}`)
        .then((response) => { return response.json(); } )
        .then((data) => { setCourses(data); })
        .catch((err) =>  { 
            console.log("exception fetchCourses "+err);
            setMessage("Exception. "+err);
         } );
    }

 /*
  *  add course
  */ 
    const  addCourse = (course_id) => {
        setMessage('');
        console.log("start addCourse"); 
        fetch(`${SERVER_URL}/schedule/course/${course_id}`,
        { 
            method: 'POST', 
        })
        .then(res => {
            if (res.ok) {
            console.log("addCourse ok");
            setMessage("Course added.");
            fetchCourses(termId);
            } else {
            console.log('error addCourse ' + res.status);
            setMessage("Error. "+res.status);
            }})
        .catch(err => {
            console.error("exception addCourse "+ err);
            setMessage("Exception. "+err);
        })
    }

  /* 
   *   drop course
   */ 
    const dropCourse = (idx) => {
        setMessage('');
        //const row_id = event.target.parentNode.parentNode.rowIndex - 1;
        console.log("drop course "+idx);
        const enrollment_id = courses[idx].id;
        
        if (window.confirm('Are you sure you want to drop the course?')) {
            fetch(`${SERVER_URL}/schedule/${enrollment_id}`,
            {
                method: 'DELETE',
            }
            )
        .then(res => {
            if (res.ok) {
                console.log("drop ok");
                setMessage("Course dropped.");
                fetchCourses(termId);
            } else {
                console.log("drop error");
                setMessage("Error dropCourse. "+res.status);
            }
            })
        .catch( (err) => {
            console.log("exception dropCourse "+err);
            setMessage("Exception. "+err);
         } );
        }
    } 

    const headers = ['Course', 'Section', 'Title', 'Times', 'Building', 'Room', 'Grade', ' '];
    const {semester, year} = SEMESTERS[termId];

    if (courses.length === 0) {
        return (
            <div>
                <h3>No Enrolled Courses {semester} {year}</h3>
                <h4>{message}</h4>
                <AddCourse addCourse={addCourse} />
            </div>
            );
      } else { 
        return(
            <div margin="auto" >
                <h3>Enrolled Courses {semester} {year}</h3>
                <h4>{message}</h4>
                <table className="Center"> 
                    <thead>
                    <tr>
                        {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((e,idx) => (
                            <tr key={idx}>
                            <td>{e.courseId}</td>
                            <td>{e.section}</td>
                            <td>{e.title}</td>
                            <td>{e.times}</td>
                            <td>{e.building}</td>
                            <td>{e.room}</td>
                            <td>{e.grade}</td>
                            <td><button type="button" margin="auto" onClick={() => dropCourse(idx)}>Drop</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <AddCourse addCourse={addCourse} />
            </div>
        );
    }
}
export default ShowSchedule;