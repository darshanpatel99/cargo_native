/*How to use:
    import {} from "../components/StyledTextInput";
    
    < {Variable name you used in import} placeholder="text" password={true}/> ----- passing password prop as true will take input as password and if you dont mention password 
    prop at all or its value as false, than text input will take input as normal text.

*/
import React, {Component} from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { Icon, Item } from "native-base";

export default class StyledTextInput extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            icon: "eye-off",
            password:true
        }
    }

    changePasswordVisibility = () => {
        const { password } = this.state;
      
        this.setState({

            icon: password ? "eye": "eye-off",
            password:!password
        });
    };

    

    render() {
        const { icon, password } = this.state;
        if (this.props.password == true) {
            return ( 
                <Item style={styles.container}>                
                    <TextInput style={styles.TextInputStyle}
                        secureTextEntry={password}
                        placeholder={this.props.placeholder}
                        underlineColorAndroid="transparent"   
                    />                        
                    <Icon name={icon}
                        onPress={this.changePasswordVisibility}
                        style={styles.iconstyle}/>
                </Item>
            );
        }
        else {
            return (
                <TextInput
                    placeholder={this.props.placeholder}
                    underlineColorAndroid="transparent"
                    style={styles.TextInputStyle}
                />
            );
        }
    }
}

//Styles
const styles = StyleSheet.create({
    iconstyle: {
        paddingRight:70,
    },

    TextInputStyle: {
        flex: 0,
        flexDirection: "row",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        height: 50,
        width: 300,
        borderRadius: 20,
        margin: 10,
        backgroundColor: "#f8f8f8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
    },
    container: {
        flex: 0, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        height: 50,
        width: 300,
        backgroundColor: "#f8f8f8",
    }
});
