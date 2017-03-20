/**
 * Created by jinbangzhu on 17/01/2017.
 */
import {View, Image, TouchableHighlight, Dimensions, StyleSheet} from "react-native";
import React, {Component, PropTypes} from "react";
const window = Dimensions.get('window');
const Flowers = require('./Flowers');

const BOTTOM_HEIGHT = window.width * 0.1827;
const IMAGE_BUTTON_SIZE = BOTTOM_HEIGHT * 0.7;
const BALL_SIZE = BOTTOM_HEIGHT * 0.5;
const INSTRUCTION_SIZE = BOTTOM_HEIGHT * 0.3;
var currentBallFlower = -1;


class GameBottom extends Component {

    shouldComponentUpdate(nextProps) {
        if (nextProps.ballFlower != currentBallFlower) {
            currentBallFlower = nextProps.ballFlower;
            return true;
        } else {
            return false;
        }
    }


    render() {
        return (
            <View style={[styles.netContainer]}>
                <Image source={require('./img/game_bottom.png')}/>

                <View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>

                    {this.getCurrentBallFlower()}
                </View>



                <View style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>

                    <TouchableHighlight onPress={this.props.onClickReplay} underlayColor='#00000000'>
                        <Image style={{width: IMAGE_BUTTON_SIZE, height: IMAGE_BUTTON_SIZE, marginLeft: 10}}
                               source={require('./img/game_again.png')}/>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={this.props.onClickExit} underlayColor='#00000000'>
                        <Image style={{width: IMAGE_BUTTON_SIZE, height: IMAGE_BUTTON_SIZE, marginLeft: 10}}
                               source={require('./img/game_exit.png')}/>
                    </TouchableHighlight>
                </View>



                <View style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 25,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <TouchableHighlight onPress={this.props.onClickInput} underlayColor='#00000000'>
                        <Image style={{width: IMAGE_BUTTON_SIZE, height: IMAGE_BUTTON_SIZE}}
                               source={require('./img/input.png')}/>
                    </TouchableHighlight>
                </View>
                <View style={{
                    position: 'absolute',
                    top: -INSTRUCTION_SIZE * 0.1,
                    right: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>

                    <TouchableHighlight onPress={this.props.onClickInstruction} underlayColor='#00000000'>
                        <Image style={{width: INSTRUCTION_SIZE, height: INSTRUCTION_SIZE}}
                               source={require('./img/game_instructions.png')}/>
                    </TouchableHighlight>
                </View>

            </View>
        );
    }

    getCurrentBallFlower() {
        if (currentBallFlower >= 0) {
            return (
                <TouchableHighlight onPress={this.props.onClickBallFlower} underlayColor='#00000000'><Image
                    style={{width: BALL_SIZE, height: BALL_SIZE}}
                    source={Flowers.BALL_FLOWERS[currentBallFlower]}/>
                </TouchableHighlight>
            )
        }
    }
}

const styles = StyleSheet.create({
    netContainer: {
        width: window.width,
        height: BOTTOM_HEIGHT,
        flexDirection: 'row',
    },
});

GameBottom.defaultProps = {};

GameBottom.propTypes = {
    onClickReplay: PropTypes.func,
    onClickExit: PropTypes.func,
    onClickInput: PropTypes.func,
    onClickInstruction: PropTypes.func,
    onClickBallFlower: PropTypes.func,
};

export default GameBottom;
