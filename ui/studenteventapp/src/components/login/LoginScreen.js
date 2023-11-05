import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContent from '../Auth/AuthContent';
import LoadingOverlay from '../ui/LoadingOverlay';
import { AuthContext } from '../../store/auth-context';

function LoginScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [inputError, setInputError] = useState(null);

    const authCtx = useContext(AuthContext);

    const loginHandler = async (props) => {
        setIsAuthenticating(true);
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          }
        try {
            const response = await axios.post('http://172.20.10.3:8080/api/student/login', {
                email: props.enteredEmail,
                password: props.enteredPassword,
            }, {headers});
            if (response.data && response.data.message === 'successfully found student') {
                setInputError(null);
                authCtx.authenticate(response.data);
            } else {
                setInputError('Invalid Credentials. Please enter valid Email & Password');
                setIsAuthenticating(false);
            }
        } catch (error) {
            setInputError('An error occurred while logging in, please try later');
            setIsAuthenticating(false);
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message="Logging you in..." />;
    }
    return <AuthContent onAuthenticate={loginHandler} inputError={inputError} />;
}

export default LoginScreen;