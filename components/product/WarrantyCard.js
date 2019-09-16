import React, { Component } from 'react';

import { View, Text } from 'react-native';
import { Card, CardItem,CheckBox} from 'native-base';

export default class WarrantyCard extends Component {


    render() {
        return (
            <View style = {styles.viewStyle} >
        
                <Card style = {styles.cardStyle}>
                    <CardItem >

                        <View>
                            <Text> Does this product have warranty? </Text>
                        </View>
                        
                        <View style={{ flexDirection: 'column' }}>
                            <Text> Yes </Text>
                            <CheckBox checked={true} color="#4383FF" />
                            <Text> No </Text>
                            <CheckBox checked={true} color="#4383FF" />

                           <Text>  </Text>
                        </View>

                    </CardItem>
                </Card>
            </View>
        )
    }


}


const styles = {
    cardStyle : {
        height: 70,
        width: '90%',
        borderRadius: 10
    },

    viewStyle :{
        alignItems: 'center',
    },

    styledCheckbox :{

        border: 50,
        textSize: 90,
        size:900
    }

}