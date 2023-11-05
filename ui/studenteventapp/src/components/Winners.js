import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, SafeAreaView, Text, Button, TextInput, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { DataTable } from 'react-native-paper';

const Winners = () => {
    const [selected, setSelected] = useState('');
    const [data, setData] = useState([]);

    const handleSelect = async (value) => {
        setSelected(value);
        try {
            const response = await axios.get(`http://172.20.10.3:8080/api/winners?quarter=${value}`);
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const selectData = [
        { key: '1', value: '1' },
        { key: '2', value: '2' },
        { key: '3', value: '3' },
        { key: '4', value: '4' }
    ];

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.header}>Winners List</Text>
                <Text style={styles.text}>Please Select Year - Quarter to Display Results</Text>
                <SelectList
                    data={selectData}
                    setSelected={(value) => handleSelect(value)}
                    dropdownItemStyles={{ marginHorizontal: 10 }}
                    placeholder='Select Quarter'
                    maxHeight={150}
                />
            </View>
            <View>
                <DataTable style={styles.tableContainer}>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title textStyle={{color:"black", fontSize:16, fontWeight: 'bold'}}>Name</DataTable.Title>
                        <DataTable.Title textStyle={{color:"black", fontSize:16, fontWeight: 'bold'}}>Grade</DataTable.Title>
                        <DataTable.Title textStyle={{color:"black", fontSize:16, fontWeight: 'bold'}}>Points</DataTable.Title>
                        <DataTable.Title textStyle={{color:"black", fontSize:16, fontWeight: 'bold'}}>Type</DataTable.Title>
                        <DataTable.Title textStyle={{color:"black", fontSize:16, fontWeight: 'bold'}}>Reward</DataTable.Title>
                    </DataTable.Header>

                    {data.map((item) => {
                        return (
                            <DataTable.Row key={item.studentName} style={styles.tableRow}>
                                <DataTable.Cell textStyle={{fontFamily:"Avenir", fontSize:14}}>{item.studentName}</DataTable.Cell>
                                <DataTable.Cell textStyle={{fontFamily:"Avenir", fontSize:14}}>{item.studentGrade}</DataTable.Cell>
                                <DataTable.Cell textStyle={{fontFamily:"Avenir", fontSize:14}}>{item.studentPoints}</DataTable.Cell>
                                <DataTable.Cell textStyle={{fontFamily:"Avenir", fontSize:14}}>{item.winnerType}</DataTable.Cell>
                                <DataTable.Cell textStyle={{fontFamily:"Avenir", fontSize:14}}>{item.reward}</DataTable.Cell>
                            </DataTable.Row>
                        )
                    }
                    )}

                </DataTable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 16,
        margin: 8
    },
    text: {
        margin: 8
    },
    tableContainer: {
        flex: 1,
        padding: 16
    },
    tableRow: {
        height: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16
    }
});

export default Winners;