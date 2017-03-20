/**
 * Created by jinbangzhu on 17/01/2017.
 */
import {View, Image, Dimensions, Platform, Text, TouchableHighlight, StyleSheet} from "react-native";
import React, {Component, PropTypes} from "react";
const window = Dimensions.get('window');

class Scorecard extends Component {
    render() {
        return (
            <TouchableHighlight onPress={this.props.onClick} underlayColor='#00000000'
                                style={{marginTop: this.props.marginTop}}>
                <View style={[styles.netContainer]}>
                    <Image style={{width: this.props.width, height: this.props.height,}}
                           source={require('./img/experience.png')}/>
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#00000000',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{color: '#6C2D06'}}>{this.props.score}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    netContainer: {
        position: 'absolute',
        left: 10,
        flex: 1,
    },
});

Scorecard.defaultProps = {
    score: '0',
    width: 100,
    height: 100 * 0.327,
    marginTop: 20,
};

Scorecard.propTypes = {
    score: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    onClick: PropTypes.func,
    marginTop: PropTypes.number,
};

export default Scorecard;
