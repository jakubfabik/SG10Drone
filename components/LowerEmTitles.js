import { Text, View, Pressable } from 'react-native'
import React, { useEffect, useState} from 'react'
import {db, APPENDIX} from '../firebase/Config';
import styles from '../style/Style';

export default function EmTitles({route}) {
  
  const [lowerTitles, setLowerTitles] = useState({});
  const [show, setShow] = useState(false);
  const {title} = route.params

  useEffect(() => {
    db.ref(APPENDIX).child('caseOfEm').child(title).on('value', querySnapShot => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      let titleItems = {...data};
      setLowerTitles(titleItems);
    });
  }, []);

  const EmItem = ({emItem: {sentence: title, predefined}, id}) => {
      
    console.log(id);
   return (
       <View style={styles.container}>
           <Pressable onPress={() => setShow(!show)}>
             <View style={styles.missionText}>
               <Text>{title}</Text>
             </View>
           </Pressable>
           {show && (
               <Text>{predefined}</Text>
           )}
       </View>
   );
}

  let EmTitleKeys = Object.keys(lowerTitles);

  return (
    <View style={styles.newItem}>
         {EmTitleKeys.length > 0 ? (
          EmTitleKeys.map(key => (
            <EmItem
                key={key}
                id={key}
                emItem={lowerTitles[key]}
            />
          ))
        ) : (
          <Text style={styles.infoText}>There are no missions</Text>
        )}
    </View>
  )
}