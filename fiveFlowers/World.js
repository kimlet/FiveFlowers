/**
 * Created by jinbangzhu on 17/01/2017.
 */
import {View, Image, Dimensions, StyleSheet} from "react-native";
import React, {Component, PropTypes} from "react";
const window = Dimensions.get('window');


class World extends Component {

    shouldComponentUpdate(nextProps) {
        return false;
    }
    render() {
        return (
            <View style={[styles.netContainer]}
            >

                <Image source={require('./img/sky.png')}
                       style={{width: window.width, height: window.width * 0.7061}}/>

                <Image source={require('./img/snow_mountain.png')}
                       style={{width: window.width, height: window.width * 0.7407,}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    netContainer: {
        position: 'absolute',
        backgroundColor: '#27A8FF',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
});

World.defaultProps = {};

World.propTypes = {};

export default World;
