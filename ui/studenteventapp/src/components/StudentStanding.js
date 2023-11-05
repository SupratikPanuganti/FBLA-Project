import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';

const StudentStanding = ({ route }) => {
  const {studentNumber} = route.params;
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://172.20.10.3:8080/api/student-performance?studentNumber=${studentNumber}`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView>
    { studentNumber ? <View style={styles.cardContainer}>
      <Image
        style={styles.avatarImage}
        source={require('../../assets/avatar.png')}
      />
      <View style={styles.statsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Student Name</Text>
          <Text style={styles.value}>{data.studentName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Student Grade</Text>
          <Text style={styles.value}>{data.studentGrade}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Points</Text>
          <Text style={styles.value}>{data.points}</Text>
        </View>
      </View>
    </View> : null }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  statsContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '30%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    width: '40%',
    textAlign: 'left',
  },
  value: {
    fontSize: 16,
    width: '60%',
    textAlign: 'right',
  },
});

export default StudentStanding;
