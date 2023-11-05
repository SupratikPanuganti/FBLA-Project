import React, { useEffect, useState } from "react";
import './EventsList.css';
import axios from 'axios';

function EventsList() {

    const getEvents = async () => {
        try {
            const events_list = await axios.get('http://10.0.0.44:8080/events')
            console.log("events", events_list)
        }
        catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        getEvents();
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

export default EventsList;

