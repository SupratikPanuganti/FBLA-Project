import { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Colors } from '../../constants/styles';

function AuthContent({ onAuthenticate, inputError }) {

    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [emptyInput, setEmptyInput] = useState(null);

    function updateInputValueHandler(inputType, enteredValue) {
        switch (inputType) {
          case 'email':
            setEnteredEmail(enteredValue);
            break;
          case 'password':
            setEnteredPassword(enteredValue);
            break;
        }
      }

    function submitHandler() {
        const emailIsValid = enteredEmail.includes('@');
        const passwordIsValid = enteredPassword.length > 6;

        if (!emailIsValid || !passwordIsValid) {
            setEmptyInput("Invalid Credentials. Please enter valid Email & Password");
            return;
        }
        onAuthenticate({ enteredEmail, enteredPassword });
    }

    return (
        <View style={styles.authContent}>
            <View style={styles.form}>
                <View>
                    <Input
                        label="Email Address"
                        onUpdateValue={updateInputValueHandler.bind(this, 'email')}
                        value={enteredEmail}
                        keyboardType="email-address"
                    />
                    <Input
                        label="Password"
                        onUpdateValue={updateInputValueHandler.bind(this, 'password')}
                        secure
                        value={enteredPassword}
                    />
                    { inputError || emptyInput ? <Text style={styles.text}>{inputError || emptyInput}</Text> : null }
                    <View style={styles.buttons}>
                        <Button onPress={submitHandler}>Log In</Button>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default AuthContent;

const styles = StyleSheet.create({
    authContent: {
        marginTop: 64,
        marginHorizontal: 32,
        padding: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary800,
        elevation: 2,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
    },
    buttons: {
        marginTop: 12,
      },
      text: {
        textAlign: 'center',
        color: 'white',
        margin: 4,
      },
});