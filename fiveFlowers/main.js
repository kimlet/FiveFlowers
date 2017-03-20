/**
 * Created by jinbangzhu on 16/01/2017.
 */
import React, {Component, PropTypes} from "react";
import {
    Animated,
    TouchableHighlight,
    Button,
    Dimensions,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    ScrollView,
    Platform,
    TextInput
} from "react-native";
import World from "./World";
import Scorecard from "./Scorecard";
import Belt from "./Belt";
import Board from "./Board";
import GameBottom from "./GameBottom";
import KeyboardSpacer from "react-native-keyboard-spacer";
const Flowers = require('./Flowers');

const window = Dimensions.get('window');
const GAME_FPS = 1000 / 60;
const DURATION_TRANSFORM_BALL = 60 * 1000;// seconds

let marginTopForStatusBar = Platform.OS === 'ios' ? 20 : 50;


export default class FiveFlowers extends Component {

    constructor(props) {
        super(props);
        this.interval = null;
        this.intervalSecond = null;
        this.pickedTile = {row: -1, column: -1};
        this.currentBallFlower = -1;
        this.ballFlowers = {};
        this.showInputView = false;

        // initialize states
        this.state = {
            positionX: 0,
            text: DURATION_TRANSFORM_BALL / 1000,
            startTime: 0,
        };

    }

    render() {
        return (

            <View style={styles.Container}>
                <World />
                <Scorecard marginTop={marginTopForStatusBar} onClick={() => {
                    console.log('onClick scorecard');
                }}/>

                <View style={{flex:1}}>

                    <View style={{flex:1}} />

                    <Belt positionX={this.state.positionX} onClickBallFlower={(flower, currentNumber) => {
                        this.currentBallFlower = flower;
                    }}/>
                    <Board shouldUpdateBoard={this.pickedTile}
                           onClickTile={(row, column) => {
                               this.pickedTile = {row: row, column: column, color: Flowers.REFRESH_KEY};
                           }}
                           onRemoveBallFlowersAnimationEnd={() => {
                               this.pickedTile = {
                                   row: this.pickedTile.row,
                                   column: this.pickedTile.column,
                                   color: -2 // just different with default color
                               };
                           }}
                           ballFlowers={this.ballFlowers}

                    />
                    <GameBottom ballFlower={this.currentBallFlower}
                                onClickReplay={() => {
                                    this.ballFlowers = this.generateRandomBalls();
                                    this.pickedTile = {
                                        row: Flowers.REFRESH_KEY,
                                        column: Flowers.REFRESH_KEY,
                                        color: Flowers.REFRESH_KEY
                                    };
                                }}
                                onClickInput={() => {
                                    this.showInputView = true;
                                }}
                                onClickExit={() => {
                                }}
                                onClickBallFlower={() => {
                                    if (this.currentBallFlower >= 0 && this.pickedTile && this.pickedTile.row >= 0) {
                                        let key = this.generateKeyForBall(this.pickedTile.row, this.pickedTile.column);
                                        if (this.ballFlowers[key]) {
                                            /**
                                             * already exists
                                             */
                                        } else {
                                            this.pickedTile = {
                                                row: this.pickedTile.row,
                                                column: this.pickedTile.column,
                                                color: this.currentBallFlower
                                            };
                                            this.currentBallFlower = Flowers.REFRESH_KEY;
                                            this.pushRandomBalls(2);
                                        }

                                    }
                                }}
                    />
                </View>

                {this.getInputView()}
            </View>

        )
    }

    getInputView() {
        if (this.showInputView) {
            return (

                <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF'}}>
                    <TextInput
                        style={{
                            height: 40,
                            borderColor: 'gray',
                            borderWidth: 1,
                            backgroundColor: '#FFFFFF'
                        }}
                        autoFocus={true}
                        onChangeText={(text) => console.log(text)}
                        onSubmitEditing={() => {
                            this.showInputView = false;
                        }}
                    />
                    {this.getKeyboardHeightView()}
                </View>
            )
        }
    }

    getKeyboardHeightView() {
        if (Platform.OS === 'ios') {
            return (
                <KeyboardSpacer />
            )
        }
    }

    update() {
        let nextState = null;
        nextState = Object.assign({}, this.state);
        this.updateTextPosition(nextState);
        this.setState(nextState);
    }

    updateTextPosition(nextState) {
        var leftTime = 0;
        if (nextState.startTime == 0) {
            nextState.startTime = Date.now();
        } else {
            leftTime = Date.now() - nextState.startTime;

            if (leftTime > DURATION_TRANSFORM_BALL) {
                nextState.startTime = Date.now();
            }

            let realPositionPercent = leftTime / DURATION_TRANSFORM_BALL;

            if (nextState.positionX >= window.width) {
                nextState.positionX = 0;
            } else if (realPositionPercent * window.width < nextState.positionX) {
                realPositionPercent = nextState.positionX;
            }
            nextState.positionX = realPositionPercent * window.width;
        }
    }


    updateSecond() {
        let nextState = null;
        nextState = Object.assign({}, this.state);

        this.updateText(nextState);

        this.setState(nextState);
    }

    updateText(nextState) {
        nextState.text = this.state.text - 1;
    }

    pushRandomBalls(count = 2) {
        for (var i = 0; i < count; i++) {
            this.generateRandomBall();
        }
    }

    generateRandomBall() {
        var color = Math.round(Math.random() * 10) % 6;
        var row = Math.round(Math.random() * 10) % 9;
        var column = Math.round(Math.random() * 10) % 9;
        if (this.ballFlowers[this.generateKeyForBall(row, column)]) {
            this.generateRandomBall();
        } else {
            this.ballFlowers[this.generateKeyForBall(row, column)] = {row: row, column: column, color: color};
        }
    }

    generateRandomBalls(maxCount = 9) {
        var ballFlowers = {};
        for (var i = 0; i < maxCount; i++) {
            var color = Math.round(Math.random() * 10) % 6;
            var j = Math.round(Math.random() * 10) % (maxCount - 1);
            var key = this.generateKeyForBall(i, j);
            ballFlowers[key] = {row: i, column: j, color: color};

            color = Math.round(Math.random() * 10) % 6;
            key = this.generateKeyForBall(j, i);
            ballFlowers[key] = {row: j, column: i, color: color};
        }
        return ballFlowers;
    }

    generateKeyForBall(row, column) {
        return `row:${row} column:${column}`;
    }

    componentWillMount() {
        this.ballFlowers = this.generateRandomBalls();
    }


    componentDidMount() {
        //
        this.interval = setInterval(this.update.bind(this), GAME_FPS);
        this.intervalSecond = setInterval(this.updateSecond.bind(this), 1000);
    }

    componentWillUnmount() {
        this.pickedTile = {row: -1, column: -1};
        this.currentBallFlower = -1;
        this.ballFlowers = {};


        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.intervalSecond) {
            clearInterval(this.intervalSecond);
        }

    }
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'column',
        flex: 1,
    },
});


module.exports = FiveFlowers;
