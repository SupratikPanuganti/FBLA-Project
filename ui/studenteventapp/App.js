import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import StudentStanding from './src/components/StudentStanding';
import Winners from './src/components/Winners';
import EventsList from './src/components/EventsList';
import EventItem from './src/components/EventItem';
import LoginScreen from './src/components/login/LoginScreen';
import Home from './src/Home';
import { useFonts } from 'expo-font';
import { Colors } from './src/constants/styles';
import AuthContextProvider, { AuthContext } from './src/store/auth-context';
import IconButton from './src/components/ui/IconButton';

const Stack = createStackNavigator();

function AuthStack() {

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary500 },
                headerTintColor: 'white',
                contentStyle: { backgroundColor: Colors.primary100 },
            }}
        >
            <Stack.Screen name="EventEase App Login" component={LoginScreen} />
        </Stack.Navigator>
    )
}

function AuthenticatedStack(props) {
    const authCtx = useContext(AuthContext)
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary500 },
                headerTintColor: 'white',
                contentStyle: { backgroundColor: Colors.primary100 },
            }}
            initialRouteName="home"
        >
            <Stack.Screen name="home" component={Home} 
            initialParams={{ 'studentNumber': props.data.studentNumber, 
            'studentGrade': props.data.studentGrade, 
            'studentName': props.data.studentName, 
            'studentEmail': props.data.studentEmail }}
                options={{
                    headerRight: ({ tintColor }) => (
                        <IconButton
                            icon="log-out"
                            color={tintColor}
                            size={24}
                            onPress={authCtx.logout}
                        />
                    ),
                }} />
            <Stack.Screen name="events" component={EventsList}
                options={{
                    headerRight: ({ tintColor }) => (
                        <IconButton
                            icon="log-out"
                            color={tintColor}
                            size={24}
                            onPress={authCtx.logout}
                        />
                    ),
                }} />
            <Stack.Screen name="eventitem" component={EventItem}
                options={({ route }) => ({ title: route.params.eventId })}
            />
            <Stack.Screen name="studentstanding" component={StudentStanding}
                options={{
                    headerRight: ({ tintColor }) => (
                        <IconButton
                            icon="log-out"
                            color={tintColor}
                            size={24}
                            onPress={authCtx.logout}
                        />
                    ),
                }} />
            <Stack.Screen name="winners" component={Winners}
                options={{
                    headerRight: ({ tintColor }) => (
                        <IconButton
                            icon="log-out"
                            color={tintColor}
                            size={24}
                            onPress={authCtx.logout}
                        />
                    ),
                }} />
        </Stack.Navigator>
    );
}

function PrimaryNavigation() {
    const authCtx = useContext(AuthContext);

    return (
        <NavigationContainer>
            {!authCtx.isAuthenticated && <AuthStack />}
            {authCtx.isAuthenticated && <AuthenticatedStack data={authCtx.token} />}
        </NavigationContainer>
    );
}

export default function App() {
    const [fontsLoaded] = useFonts({
        'Material Design Icons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
    });
    return (
        <>
            <StatusBar style="light" />
            <AuthContextProvider>
                <PrimaryNavigation />
            </AuthContextProvider>
        </>
    );
}