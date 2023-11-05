import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, TextInput, Text, Image, TouchableHighlight, TouchableOpacity, Button, View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import { AirbnbRating } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios';
import emailjs from 'emailjs-com';


const EventItem = ({ route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmationNumber, setConfirmationNumber] = useState('');
    const [eventAttendance, setEventAttendance] = useState('');
    const [isNew, setIsNew] = useState('');
    const [attendanceValue, setAttendanceValue] = useState('');
    const [confirmationCodevalue, setConfirmationCodeValue] = useState('');
    const [rating, setRating] = useState('');
    const [val, setVal] = useState(null);
    const { eventId, eventData, studentNumber, studentGrade, studentName, email } = route.params;
    const navigation = useNavigation();

    useEffect(() => {
    }, [eventId]);
    
    const handleEmail = (confirmationNumber) => {
        emailjs.send('service_w6un7tf', 'template_ml9007u', {
          email,
          subject: `Event Registration Confirmation Code: ${eventData.eventName}`,
          message: confirmationNumber
        }, 'l3BAV4yWhrs1FunNJ')
        .then(res => console.log('Email sent successfully', res))
        .catch(err => console.error('Error sending email:', err));
    };

    const handleEventRegistration = async () => {
        
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          }
        try {
            const response = await axios.post('http://172.20.10.3:8080/api/event-registration', {
                studentNumber: studentNumber,
                studentName: studentName,
                studentGrade: studentGrade,
                eventId: eventData.eventId,
                eventName: eventData.eventName,
                eventDate: eventData.eventDate,
                eventAttendance: false
            }, {headers});
            if (response.data && response.data.registrationConfirmationId) {
                setModalVisible(true);
                setConfirmationNumber(response.data.registrationConfirmationId);
            } else {
                setModalVisible(false);
                setVal(response.data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleModalClose = () => {
        handleEmail(confirmationNumber);
        setModalVisible(false);
        navigation.navigate('home');
    }

    const handleRadioPress = (value) => {
        setIsNew(value);
    }

    const handleEventAttendance = async () => {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          }
        try {
            const response = await axios.post('http://172.20.10.3:8080/api/event-attendance', {
                registrationConfirmationId: confirmationCodevalue,
                eventAttendanceId: attendanceValue,
                studentNumber: studentNumber,
            }, {headers});
            if (response.data && response.data.message) {
                setModalVisible(true);
                setEventAttendance(response.data.message);
            } else {
                setModalVisible(false);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView style={styles.scrollView}>
                <View style={styles.bannerContainer}>
                    <Text style={styles.bannerText}>Please select Yes if you need to register for event and
                        No if you already registered and have registration Confirmation Id and Attendance Id</Text>
                </View>
                {/* <Image source={{ uri: eventData.image }} style={styles.image} /> */}
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{eventData.eventName}</Text>
                    <Text style={styles.eventdate}>{eventData.eventDate}</Text>
                    <Text style={styles.description}>{eventData.eventDescription}</Text>

                    {isNew === 'No' ?
                    <> 
                    <View
                        style={{
                            marginBottom: 5,
                            fontSize: 4,
                            flexDirection: 'row'
                        }}
                    > 
                    <Text style={{marginTop: 24, marginRight: 10}}>Please Rate !!</Text>
                        <AirbnbRating 
                        reviews={["1/5", "2/5", "3/5", "4/5", "5/5"]}
                        onFinishRating={(value) => setRating(value)} 
                        defaultRating={0} size={20} />
                    </View>
                    </> : null }

                    <Text style={styles.question}>Are you new to Registration? Select Yes / No</Text>
                    <View style={styles.radioContainer}>
                        <RadioButton.Android
                            value="Yes"
                            status={isNew === 'Yes' ? 'checked' : 'unchecked'}
                            onPress={() => handleRadioPress('Yes')}
                        />
                        <Text style={styles.radioText}>Yes</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <RadioButton.Android
                            value="No"
                            status={isNew === 'No' ? 'checked' : 'unchecked'}
                            onPress={() => handleRadioPress('No')}
                        />
                        <Text style={styles.radioText}>No</Text>
                    </View>
                    <Text>{val}</Text>

                    {isNew === 'No' ?
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Attendance Id:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => setAttendanceValue(text)}
                                    placeholder="Please enter valid Attendance ID"
                                    value={attendanceValue}
                                />
                                <Text style={styles.label}>Confirmation Code:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => setConfirmationCodeValue(text)}
                                    placeholder="Please enter valid Confirmation ID"
                                    value={confirmationCodevalue}
                                />
                                <View style={styles.buttonContainer}>
                                    <Button disabled={(attendanceValue === '') || (confirmationCodevalue === '')} 
                                    title="Attend Event" onPress={handleEventAttendance} style={styles.button} />
                                </View>
                            </View>
                        </> : null}
                    {isNew === 'Yes' ?
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight style={{ marginTop: 10 }} >
                                <Button title="Register"
                                    onPress={handleEventRegistration} />
                            </TouchableHighlight>
                        </View> : null}

                    <Modal animationType="slide" transparent={true} visible={modalVisible}>
                        <View style={styles.modalContainer}>
                            {confirmationNumber ?
                                <>
                                    <Text style={styles.modalHeader}>Your confirmation code</Text>
                                    <Text style={styles.modalCode}>{confirmationNumber}</Text>
                                </> : null}
                            {eventAttendance ?
                                <>
                                    <Text style={styles.modalCode}>{eventAttendance}</Text>
                                </> : null}
                            <TouchableOpacity
                                style={styles.modalButtonContainer}
                                onPress={handleModalClose}
                            >
                                <Text style={styles.modalButton}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                </View>
        </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 16,
        marginRight: 16
    },
    contentContainer: {
        flex: 1
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 8,
    },
    eventdate: {
        fontSize: 12,
        marginBottom: 8,
        fontWeight: 'bold'

    },
    description: {
        marginBottom: 8,
        fontSize: 16,
    },
    bannerContainer: {
        margin: 10,
        backgroundColor: 'black',
        padding: 12,
        alignItems: 'center',
      },
    bannerText: {
        color: '#fff',
        fontWeight: 'normal',
        fontSize: 14,
    },
    inputContainer: {
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8
    },
    input: {
        padding: 12,
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 4,
        fontSize: 16
    },
    buttonContainer: {
        padding: 8
    },
    button: {
        backgroundColor: '#673AB7',
        color: '#fff',
        padding: 8,
        borderRadius: 8,
        fontSize: 18,
    },
    question: {
        fontSize: 18,
        marginTop: 8,
        marginBottom: 8,
    },
    radioContainer: {
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8,
    },
    radioText: {
        marginLeft: 8,
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,1)',
    },
    modalHeader: {
        color: '#FFFFFF',
        fontSize: 20,
    },
    modalCode: {
        color: '#FFFFFF',
        fontSize: 36,
    },
    modalButtonContainer: {
        alignItems: 'center',
        backgroundColor: '#673AB7',
        borderRadius: 100,
        margin: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    modalButton: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});

export default EventItem;
