import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions, SafeAreaView } from 'react-native';

const TermsConditions = () => {

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Terms and conditions</Text>
        <ScrollView
          style={styles.tcContainer}
        >
          <Text style={styles.tcP}>Welcome to our Student Event Portal. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.</Text>
          <Text style={styles.tcL}>{'\u2022'} Once students participate or attend events, they are awarded points. </Text>
          <Text style={styles.tcL}>{'\u2022'} You must have a way to pick a random winner each quarter from each grade level, as well as the student with the top point accumulation.</Text>
          <Text style={styles.tcL}>{'\u2022'} The number of points a person has accumulated will translate to the prize they will win. </Text>
          <Text style={styles.tcL}>{'\u2022'} You will need to have at least three prizes (a school reward, a food reward, and a school spirit item).</Text>
          <Text style={styles.tcP}>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const { width , height } = Dimensions.get('window');

const styles = {

  container:{
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  title: {
      fontSize: 22,
      alignSelf: 'center'
  },
  tcP: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 12
  },
  tcP:{
      marginTop: 10,
      fontSize: 12
  },
  tcL:{
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 10,
      fontSize: 12
  },
  tcContainer: {
      marginTop: 10,
      marginBottom: 10,
      width: width * .7,
      height: height * .3,
  },

  button:{
      backgroundColor: '#136AC7',
      borderRadius: 5,
      padding: 10
  },

  buttonDisabled:{
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10
 },

  buttonLabel:{
      fontSize: 14,
      color: '#FFF',
      alignSelf: 'center'
  }

}

export default TermsConditions;
