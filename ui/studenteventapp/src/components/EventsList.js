import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EventsList = ({ navigation, route }) => {
  const {studentNumber, studentGrade, studentName, studentEmail} = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.20.10.3:8080/api/events');
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handlePress = (item) => {
    navigation.navigate('eventitem', { eventId: item.eventId, eventData: item, studentNumber: studentNumber, studentGrade: studentGrade, 
      studentName: studentName, email: studentEmail});
  };

  const renderItem = ({ item }) => (
    <View style={styles.mainContainer}>
    <TouchableOpacity onPress={() => handlePress(item)}>
    <View style={styles.itemContainer}>
      {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
      <Text style={styles.title}>{item.eventName}</Text>
      <Text style={styles.subtitle}>{item.eventType}</Text>
    </View>
    </TouchableOpacity>
    </View>
  );

  return (
    <>
   { studentNumber ? <FlatList
      data={data}
      numColumns={3}
      keyExtractor={item => item.eventId}
      renderItem={renderItem}
    /> : null }
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    height: 150,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 10,
    textAlign: 'center',
  }
});

export default EventsList;