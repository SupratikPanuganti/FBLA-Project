import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableHighlight, TextInput, View } from 'react-native';
import TermsConditions from './components/TermsConditions';
import Checkbox from 'expo-checkbox';
import { Colors } from '../src/constants/styles';
import Button from '../src/components/ui/Button';

const Home = (props) => {
  const [value, setValue] = useState('');
  // const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const data = props.route.params;

  return (
    <SafeAreaView>
      <TermsConditions />
  
      <View style={styles.container}>
      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={isSelected}
          onValueChange={setSelection}
          color={isSelected ? '#4630EB' : undefined}
        />
        <Text style={styles.paragraph}>Agree to terms and conditions to search</Text>
      </View>

     { data && data.studentNumber && isSelected ? <View style={styles.buttonsContainer}>
       <TouchableHighlight style ={{ marginBottom :10}} >
          <Button 
          onPress={() => {
            props.navigation.navigate('events', { studentNumber: data.studentNumber, studentGrade: data.studentGrade,
               studentName: data.studentName, studentEmail: data.studentEmail});
          }}>Events</Button>
          </TouchableHighlight>
          <TouchableHighlight style ={{ marginBottom :10}} >
          <Button buttonStyle={styles.button} 
          onPress={() => {
            props.navigation.navigate('studentstanding', { studentNumber: data.studentNumber});
          }}>Student Standing</Button>
          </TouchableHighlight>
          <TouchableHighlight style ={{ marginBottom :10}} >
          <Button buttonStyle={styles.button} 
          onPress={() => {
            props.navigation.navigate('winners');
          }}>Winners</Button>
          </TouchableHighlight>
        </View> : null }

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  input: {
    padding: 12,
    margin: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    width: '80%'
  },
  inputFocus: {
    borderColor: '#555',
  },
  buttonsContainer: {
    marginTop: 16,
    width: '70%'
  },
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  }
});

export default Home;