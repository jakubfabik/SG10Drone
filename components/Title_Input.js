import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, Alert, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown'
import ShowMap from '../components/ShowMap'
import uuid from 'react-native-uuid';
import { IconButton, Colors } from 'react-native-paper';

export const Title_Input = ({sentence: {sentence: title, inputType: inputType, predefined: predefined }, id, answ, setAnsw}) => {
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [date, setDate] = useState("");
    const [posNotes, setPosNotes] = useState(false);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const switchOnMap = () => {
        setShowMap(!showMap);
    }

    function addElement (ElementList, element) {
        let newList = Object.assign(ElementList, element)
        return newList
    }
    function saveInput(input){
        let answers = {...answ};
        if(posNotes){
            let inp = input;
            addElement(inp,{"notes":posNotes});
            addElement(answers, {[id]:inp});
        }
        else{addElement(answers, {[id]:input})}
        setAnsw(answers);
    }

    useEffect(()=>{
        if(inputType === "gps"){
            if(answ.hasOwnProperty(id)){
                if(answ[id].hasOwnProperty("notes")){
                    setPosNotes(answ[id].notes);
                }
            }
        }
    },[])

    useEffect(()=>{
        if(inputType === "gps" && posNotes){
            let answers = {...answ};
            if(answ.hasOwnProperty(id)){
                if(answ[id].hasOwnProperty("latitude")){
                    addElement(answers, {
                        [id]:{"notes":posNotes,
                        latitude: answ[id].latitude,
                        longitude: answ[id].longitude
                        }}
                        )
                }
                else{
                    addElement(answers, {[id]:{"notes":posNotes}})
                }
            }
            else{
                addElement(answers, {[id]:{"notes":posNotes}})

            }
            setAnsw(answers);
        }
    },[posNotes])


    const existGps = () => {
        if(answ.hasOwnProperty(id)){
            if("latitude" in answ[id]){
            return true;
            }
        }
        return false;
    }
    
    const styles = StyleSheet.create({
        Item: {
            flexDirection: 'row',
            marginVertical: 5,
            alignItems: 'center'
        },
        text: {
            borderColor: '#afafaf',
            paddingHorizontal: "1%",
            paddingVertical: "1%",
            borderWidth: 1,
            borderRadius: 10,
            minWidth: '60%',
            width: '90%',
        },
        datePicker: {
            width: 320,
            height: 260,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          },
        });


    const showPicker = () => {
        setIsPickerShow(!isPickerShow);
      };

    const showDatepicker = () => {
        showMode('date');
      };
    
    const showTimepicker = () => {
        showMode('time');
      };
      const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
      };

    const formatDate = (date, time) => {
        if(date instanceof Date){
            return `${date.getDate()}-${date.getMonth() +
            1}-${date.getFullYear()} ${time.getHours()<10? "0"+time.getHours(): time.getHours()}:${time.getMinutes()<10? "0"+time.getMinutes(): time.getMinutes()}`;
        }
      };
    
      const onChange = (event, value) => {
        let today = new Date(Date.now());
        if(value.getDate() === today.getDate() && value.getMonth() === today.getMonth() && value.getFullYear() === today.getFullYear()){
            showPicker();
            saveInput((parseDate(value)));
            return;
        }
        if ((value) < (today)) {
            Alert.alert(
                "Date",
                "You selected past date, please correct the date",
              [
                {
                  text: "Ok",
                  onPress: () => setShow(true)
                }
              ]
              );
            return;
        }
        showPicker();
        saveInput((parseDate(value)));
      };

      const onChange2 = (event, selectedValue) => {
        setShow(Platform.OS === 'ios');
        const selectedTime = selectedValue || new Date();
        if (mode == 'date') {
          const currentDate = selectedValue || new Date();
          if (selectedValue < (new Date(Date.now()))) {
            Alert.alert(
                "Date",
                "You selected past date, please try again.",
              [
                {
                  text: "Ok",
                  onPress: () => null
                }
              ]
              );
            return;
        }
          setDate(currentDate);
          setMode('time');
          setShow(Platform.OS !== 'ios'); // to show the picker again in time mode
        } else {
          //console.log(selectedTime);
          setShow(Platform.OS === 'ios');
          setMode('date');
        }
        selectedTime.setHours(selectedTime.getHours() - 2);
        saveInput(formatDate(date, selectedTime));
      };

    function parseDate(date){
        if(date != "" && date instanceof Date){
            var year = date.getFullYear()
            var month = (date.getMonth().toString().length < 2 ? "0"+(date.getMonth()+1).toString() :date.getMonth()+1);
            var day = (date.getDate().toString().length < 2 ? "0"+date.getDate().toString() :date.getDate());
            return(day+"-"+month+"-"+year);
            }
        else{
          return parseDate(defValue); //this will bring back date value if user moving to home screen
        }

        }

    const inputText = () => {
        if(inputType === "text"){
            let texT;
            return (
                <TextInput
                key={uuid.v4()}
                style={[styles.text, {color:"black"}]}
                returnKeyType="next"
                placeholder={(answ[id] != undefined)? answ[id] : "Empty"}
                placeholderTextColor={(null !== "input")?"black":"gray"} 
                autoCapitalize="words"
                editable={true}
                onChangeText={text => (texT = text)}
                onSubmitEditing={() => saveInput(texT)} //optional
                />
            )
            }
        }
    const inputCheck = () => {
        if(inputType === "check"){
            return(
                <View style={[{marginLeft: "1.2%"}]}>
                <Checkbox
                key={uuid.v4()}
                status={(answ[id] === "checked")? 'checked' : 'unchecked'}
                color="#71a1e3"
                onPress={() => {
                    (answ[id] === undefined || answ[id] === "unchecked")? saveInput("checked"): saveInput("unchecked")
                }}
             />
             </View>
             )
            }
    }
    
    const inputSelect = () => {
        if(inputType === "select"){
            return(
                <SelectDropdown
                    key={uuid.v4()}
                    buttonStyle={{width: '100%'}}
                    data={predefined}
                    defaultButtonText={(answ[id] === undefined)?"Select an option.":answ[id]}
                    onSelect={(selectedItem, index) => {
                        saveInput(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                />
            )
        }
    }

    const inputDate = () => {
        if(inputType === "date"){
            return(
                <View  style={
                    [styles.Item,{marginVertical: "-1%"}]
                }>
                <View style={[styles.text,{paddingVertical: "2%"}]}>
                <View >
                    <Text key={uuid.v4()}>{answ[id]}</Text>
                  <View>
            
                {isPickerShow?(
                  <DateTimePicker
                    key={uuid.v4()}
                    value={new Date(Date.now())}
                    mode={'date'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={true}
                    onChange={onChange}
                    style={styles.datePicker}
                  />
                ):null}
                 </View>
              </View>
              </View>
              <IconButton
              style={[{marginHorizontal: "0%"}]}
              icon="calendar"
              color={Colors.black900}
              size={30}
              onPress={showPicker}
            />
            </View>
            )
            }
    }

    const inputDateTime = () => {
        if(inputType === "datetime"){
            return(
                <View  style={
                    [styles.Item,{marginVertical: "-1%"}]
                }>
                <View style={[styles.text,{paddingVertical: "2%"}]}>
                <View >
                    <Text key={uuid.v4()}>{answ[id]}</Text>
                  <View>
   

                {show?(
                  <DateTimePicker
                    key={uuid.v4()}
                    timeZoneOffsetInMinutes={0}
                    value={new Date(Date.now())}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange2}
                    style={styles.datePicker}
                  />
                ):null}
                 </View>
              </View>
              </View>
              <IconButton
              style={[{marginHorizontal: "0%"}]}
              icon="calendar"
              color={Colors.black900}
              size={30}
              onPress={showDatepicker}
            />
            </View>
            )
            }
    }

    const inputMap = () => {
        if(inputType === "gps"){
            let texT;
            return(
                <View>
                    <Text>Position notes:</Text>
                    <View style={[styles.Item ,{flexDirection: 'row', marginVertical: "-1%",}]}>
                        <TextInput
                        key={uuid.v4()}
                        style={[styles.text, {color:"black"}]}
                        returnKeyType="next"
                        placeholder={posNotes? posNotes : "Location notes"}
                        placeholderTextColor={(null !== "input")?"black":"gray"} 
                        autoCapitalize="words"
                        editable={true}
                        onChangeText={text => (texT = text)}
                        onSubmitEditing={() => setPosNotes(texT)} //optional
                    />
                              <IconButton
              style={[{marginHorizontal: "0%"}]}
              icon="map-marker"
              color={Colors.black900}
              size={30}
              onPress={switchOnMap}
            />
                </View>
                    {existGps()?<Text>{"la: " + (answ[id].latitude).toFixed(4)+" " + 
                                          "lo: " + (answ[id].longitude).toFixed(4)}
                                    </Text>:null}
                {showMap?
                <View style={[{position:"absolute", zIndex: 100, marginLeft: "4%",}]}>
                    <ShowMap
                        saveGps={saveInput}
                        loadedGps={(answ[id] != undefined)? answ[id] : {}}
                    />
                </View>:null}
        
                </View>
            )
        }
    }

    //console.log(id);
    return(
        <View>
            <View style={styles.Item}>
                <Text 
                    key={uuid.v4()}
                    style={
                        [styles.text,
                        {fontWeight: "bold", marginVertical: "-2%",fontSize: 20, borderColor: "white"}]
                    }>
                    {title+":"}
                </Text>
                {inputCheck()}
            </View>
            {inputText()}
            {inputDate()}
            {inputDateTime()}
            {inputSelect()}
            {inputMap()}
        </View>
   )

}