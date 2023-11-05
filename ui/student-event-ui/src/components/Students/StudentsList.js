import React, { useEffect, useState } from "react";
import './StudentsList.css';
import axios from 'axios';

function StudentsList() {

    const getStudents = async () => {
        try {
            const students_list = await axios.get('http://127.0.0.1:8080/students')
            console.log("students", students_list)
        }
        catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        getStudents();
    }, [])


    return (
        <>
            <table className="table">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Event Name</th>
          <th scope="col">Event Type</th>
          <th scope="col">Event Description</th>
          <th scope="col">Event Slots</th>
          <th scope="col">Event Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
      </tbody>
    </table>
        </>
      );
    }

export default StudentsList;

