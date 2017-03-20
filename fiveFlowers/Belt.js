/**
 * Created by jinbangzhu on 17/01/2017.
 */
/**
 * Created by jinbangzhu on 17/01/2017.
 */
import {View, Text, Image, TouchableHighlight, Dimensions, StyleSheet} from "react-native";
import React, {Component, PropTypes} from "react";
const window = Dimensions.get('window');

const Flowers = require('./Flowers');

const BELT_WIDTH = window.width;
const BELT_HEIGHT = BELT_WIDTH * 0.1948;

const BELT_ARROW_HEIGHT = BELT_HEIGHT * 0.4;
const BELT_ARROW_WIDTH = BELT_ARROW_HEIGHT * 1.17;

const BALL_FLOWER_WIDTH = BELT_HEIGHT * 0.6;
const BALL_FLOWER_GLOW_WIDTH = BALL_FLOWER_WIDTH * 1.5;

const BELT_FLOWER_COUNT = 6;


class Belt extends Component {
    constructor(props) {
        super(props);
        this.firstPanelPosition = -1;
        this.secondPanelPosition = -1;

        this.BALLS_ON_BELT_FIRST = [];
        this.BALLS_ON_BELT_SECOND = [];

        this.ballsViewOnBeltFirst = [];
        this.ballsViewOnBeltSecond = [];
        this.ballsNumberViewOnBeltFirst = [];
        this.ballsNumberViewOnBeltSecond = [];

        this.removedBalls = {};
        this.lastNumberA = {};
        this.lastNumberB = {};
    }

    render() {

        // console.log(`F:${this.firstPanelPosition} P:${this.props.positionX}`);
        /**
         * calculate first panel position
         *
         */
        if (this.firstPanelPosition <= this.props.positionX) {
            this.firstPanelPosition = this.props.positionX;
        } else if (this.firstPanelPosition > this.props.positionX && this.firstPanelPosition < window.width * 2) {
            this.firstPanelPosition = window.width + this.props.positionX;
        } else {
            this.firstPanelPosition = -1;
            this.generateFirstPanelBalls(BELT_FLOWER_COUNT);

            console.log('first panel scroll end');
        }


        /**
         * calculate second panel position
         */
        if (this.firstPanelPosition > window.width + 5) {
            this.secondPanelPosition = this.props.positionX;
        } else if (this.secondPanelPosition > this.firstPanelPosition && this.secondPanelPosition < window.width * 2) {
            this.secondPanelPosition = window.width + this.props.positionX;
        } else {
            if (this.secondPanelPosition != -1) {
                console.log('second panel scroll end');
                this.generateSecondPanelBalls(BELT_FLOWER_COUNT);
            }
            this.secondPanelPosition = -1;
        }


        let positionA = this.firstPanelPosition - window.width;
        let positionB = this.secondPanelPosition - window.width;
        return (
            <View style={[styles.netContainer]}>
                <View>
                    <Image source={require('./img/conveyor_belt.png')}
                           style={{width: BELT_WIDTH, height: BELT_HEIGHT}}/>

                    {this.drawBelt(this.props.positionX)}
                    {this.drawBelt(this.props.positionX - window.width)}

                    {this.drawFirstPanelBalls(positionA)}
                    {this.drawSecondPanelBalls(positionB)}

                </View>

                <View>
                    <Image style={{width: window.width, height: window.width * 0.089, marginTop: -10}}
                           source={require('./img/timeline.png')}/>

                    {this.drawFirstPanelBallsNumber(positionA)}
                    {this.drawSecondPanelBallsNumber(positionB)}

                </View>

            </View>
        );
    }

    generateBallsOnBelt(ballNumber = 6) {
        this.BALLS_ON_BELT_FIRST = [];
        this.BALLS_ON_BELT_SECOND = [];
        for (var i = 0; i < ballNumber; i++) {
            var color = Math.round(Math.random() * 10) % 6;
            this.BALLS_ON_BELT_FIRST.push(color);

            color = Math.round(Math.random() * 10) % 6;
            this.BALLS_ON_BELT_SECOND.push(color);
        }
    }

    generateFirstPanelBalls(ballNumber = 6) {
        this.ballsViewOnBeltFirst = [];
        this.BALLS_ON_BELT_FIRST = [];
        for (var i = 0; i < ballNumber; i++) {
            var color = Math.round(Math.random() * 10) % 6;
            this.BALLS_ON_BELT_FIRST.push(color);
            this.removedBalls[`first_panel_${i}`] = null;
        }
    }

    generateSecondPanelBalls(ballNumber = 6) {
        this.ballsViewOnBeltSecond = [];
        this.BALLS_ON_BELT_SECOND = [];
        for (var i = 0; i < ballNumber; i++) {
            var color = Math.round(Math.random() * 10) % 6;
            this.BALLS_ON_BELT_SECOND.push(color);
            this.removedBalls[`second_panel_${i}`] = null;
        }
    }


    drawFirstPanelBalls(position) {
        var index = 0;
        for (let ballColor of this.BALLS_ON_BELT_FIRST) {
            let indexKey = `first_panel_${index}`;

            if (this.ballsViewOnBeltFirst.length == BELT_FLOWER_COUNT) {
                if (this.removedBalls[indexKey]) {
                    /**
                     * when removed balls , need rebuild view
                     */
                    this.ballsViewOnBeltFirst[index] = (this.drawBall(Flowers.BALL_FLOWERS[ballColor], ballColor, indexKey, index, 0));
                }
            } else {
                this.ballsViewOnBeltFirst.push(this.drawBall(Flowers.BALL_FLOWERS[ballColor], ballColor, indexKey, index, 0));
            }
            index++;
        }

        return (
            <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                transform: [{
                    translateX: position,
                }]

            }}>
                {this.ballsViewOnBeltFirst}
            </View>
        );
    }

    drawSecondPanelBalls(position) {
        var index = 0;
        for (let ballColor of this.BALLS_ON_BELT_SECOND) {
            let indexKey = `second_panel_${index}`;

            if (this.ballsViewOnBeltSecond.length == BELT_FLOWER_COUNT) {
                if (this.removedBalls[indexKey]) {
                    /**
                     * when removed balls , need rebuild view
                     */
                    this.ballsViewOnBeltSecond[index] = (this.drawBall(Flowers.BALL_FLOWERS[ballColor], ballColor, indexKey, index, 0));
                }
            } else {
                this.ballsViewOnBeltSecond.push(this.drawBall(Flowers.BALL_FLOWERS[ballColor], ballColor, indexKey, index, 0));
            }
            index++;
        }


        return (
            <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                transform: [{
                    translateX: position,
                }]

            }}>
                {this.ballsViewOnBeltSecond}
            </View>
        );
    }

    drawFirstPanelBallsNumber(position) {
        // ballsNumberOnBeltFirst = [];
        if (this.ballsNumberViewOnBeltFirst.length == 0) {

            for (var i = this.BALLS_ON_BELT_FIRST.length; i > 0; i--) {
                let number = Math.round(60 - (this.firstPanelPosition - BALL_FLOWER_GLOW_WIDTH * i) / window.width * 60 - 5);
                this.ballsNumberViewOnBeltFirst.push(this.drawNumber(number, `first_panel_${i}`));
            }
        } else {
            for (var i = this.BALLS_ON_BELT_FIRST.length; i > 0; i--) {
                let number = Math.round(60 - (this.firstPanelPosition - BALL_FLOWER_GLOW_WIDTH * i) / window.width * 60 - 5);
                let reverseI = this.BALLS_ON_BELT_FIRST.length - i;
                if (this.lastNumberA[reverseI] != number) {
                    this.lastNumberA[reverseI] = number;
                    this.ballsNumberViewOnBeltFirst[reverseI] = this.drawNumber(number, `first_panel_${reverseI}`);
                }
            }
        }

        return (
            <View style={{
                position: 'absolute', top: -10, left: 0, right: 0, bottom: 0,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                transform: [{
                    translateX: position,
                }]

            }}>
                {this.ballsNumberViewOnBeltFirst}
            </View>
        );
    }

    drawSecondPanelBallsNumber(position) {
        // ballsNumberOnBeltSecond = [];
        if (this.ballsNumberViewOnBeltSecond.length == 0) {
            for (var i = this.BALLS_ON_BELT_SECOND.length; i > 0; i--) {
                let number = Math.round(60 - (this.secondPanelPosition - BALL_FLOWER_GLOW_WIDTH * i) / window.width * 60 - 5);
                this.ballsNumberViewOnBeltSecond.push(this.drawNumber(number, `second_panel_${i}`));
            }
        } else {
            for (var i = this.BALLS_ON_BELT_SECOND.length; i > 0; i--) {
                let number = Math.round(60 - (this.secondPanelPosition - BALL_FLOWER_GLOW_WIDTH * i) / window.width * 60 - 5);
                let reverseI = this.BALLS_ON_BELT_FIRST.length - i;

                if (this.lastNumberB[reverseI] != number) {
                    this.lastNumberB[reverseI] = number;
                    this.ballsNumberViewOnBeltSecond[reverseI] = this.drawNumber(number, `second_panel_${reverseI}`);
                }
            }
        }

        return (
            <View style={{
                position: 'absolute', top: -10, left: 0, right: 0, bottom: 0,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                transform: [{
                    translateX: position,
                }]
            }}>
                {this.ballsNumberViewOnBeltSecond}
            </View>
        );
    }

    drawNumber(number, ballKey) {
        return (
            <View key={`number_${number}`} style={{
                width: BALL_FLOWER_GLOW_WIDTH,
                backgroundColor: '#00000000',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{color: '#FFFFFF'}}>{this.getNumberIfNotRemoved(number, ballKey)}</Text>
            </View>
        )
    }

    getNumberIfNotRemoved(number, ballKey) {
        if (this.removedBalls[ballKey]) {
            return '';
        } else {
            return number;
        }
    }

    drawBall(ballFlower, ballColor, key, index, panel) {
        return (

            <BallWithGlow
                key={key}
                uniqueKey={key}
                panel={panel}
                index={index}
                flower={ballFlower}
                ballColor={ballColor}
                width={BALL_FLOWER_WIDTH}
                height={BALL_FLOWER_WIDTH}
                glowWidth={BALL_FLOWER_GLOW_WIDTH}
                glowHeight={BALL_FLOWER_GLOW_WIDTH}
                onClickBallFlower={this.props.onClickBallFlower}
                removedBalls={this.removedBalls}
                lastNumberA={this.lastNumberA}
                lastNumberB={this.lastNumberB}

            />
        )
    }

    componentDidMount() {
        this.generateBallsOnBelt(BELT_FLOWER_COUNT);
    }

    drawBelt(positionX) {
        return (
            <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                transform: [{
                    translateX: positionX,
                }]
            }}>
                <Image source={require('./img/arrow.png')}
                       style={{marginLeft: 0, width: BELT_ARROW_WIDTH, height: BELT_ARROW_HEIGHT}}/>
                <Image source={require('./img/arrow.png')}
                       style={{marginLeft: 30, width: BELT_ARROW_WIDTH, height: BELT_ARROW_HEIGHT}}/>
                <Image source={require('./img/arrow.png')}
                       style={{marginLeft: 80, width: BELT_ARROW_WIDTH, height: BELT_ARROW_HEIGHT}}/>
                <Image source={require('./img/arrow.png')}
                       style={{marginLeft: 30, width: BELT_ARROW_WIDTH, height: BELT_ARROW_HEIGHT}}/>

            </View>
        )
    }

    componentWillUnmount() {
        this.firstPanelPosition = -1;
        this.secondPanelPosition = -1;

        this.BALLS_ON_BELT_FIRST = [];
        this.BALLS_ON_BELT_SECOND = [];

        this.ballsViewOnBeltFirst = [];
        this.ballsViewOnBeltSecond = [];
        this.ballsNumberViewOnBeltFirst = [];
        this.ballsNumberViewOnBeltSecond = [];

        this.removedBalls = {};

        this.lastNumberA = {};
        this.lastNumberB = {};
    }


}


class BallWithGlow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableHighlight onPress={() => {
                if (this.props.removedBalls[this.props.uniqueKey]) {
                    return;
                }
                var currentNumber;
                this.props.removedBalls[this.props.uniqueKey] = true;
                if (this.props.panel === 0) {// first panel
                    currentNumber = this.props.lastNumberA[this.props.index];
                } else if (this.props.panel === 1) {// second panel
                    currentNumber = this.props.lastNumberB[this.props.index];
                }

                this.props.onClickBallFlower(this.props.ballColor, currentNumber);
            }} underlayColor='#00000000'
                                style={{
                                    width: this.props.glowWidth,
                                    height: this.props.glowHeight
                                }}>

                {this.getBallIfNotRemoved()}
            </TouchableHighlight >
        );
    }

    getBallIfNotRemoved() {
        if (this.props.removedBalls[this.props.uniqueKey]) {
            return (<View />);
        } else {
            return (
                <View style={{width: this.props.glowWidth, height: this.props.glowHeight}}>
                    <Image style={{
                        width: this.props.glowWidth,
                        height: this.props.glowHeight
                    }}
                           source={require('./img/out_glow.png')}/>
                    <View style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center', top: 0, left: 0, right: 0, bottom: 0
                    }}>
                        <Image style={{
                            width: this.props.width,
                            height: this.props.height
                        }}
                               source={this.props.flower}/>
                    </View>
                </View>
            )
        }
    }
}


const styles = StyleSheet.create({
    netContainer: {
        flexDirection: 'column',
    },
});

Belt.defaultProps = {
    positionX: 0,
};

Belt.propTypes = {
    positionX: PropTypes.number,
    onClickBallFlower: PropTypes.func,
};

export default Belt;
