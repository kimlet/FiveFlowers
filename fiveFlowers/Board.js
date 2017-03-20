/**
 * Created by jinbangzhu on 17/01/2017.
 */
import {TouchableHighlight, Animated, View, Text, Image, Dimensions, StyleSheet} from "react-native";
import React, {Component, PropTypes} from "react";
const window = Dimensions.get('window');

const Flowers = require('./Flowers');

const TILE_PADDING = 2;
const MIN_REMOVE_COUNT = 3;
const MAX_TILE_ROW_COUNT = 9;
const TILE_WIDTH = window.width / MAX_TILE_ROW_COUNT - TILE_PADDING * 2;
const BALL_WIDTH = TILE_WIDTH * 0.9;
const BALL_MARGIN_TILE = (TILE_WIDTH - BALL_WIDTH) / 2;


class Board extends Component {
    constructor(props) {
        super(props);


        this.pickedTile = {row: Flowers.REFRESH_KEY, column: Flowers.REFRESH_KEY, color: -1};
        this.disappearBallFlowers = [];
        this.isAnimating = false;
        this.ballFlowers = {};
        this.columnRows = [];
        this.tileRows = [[]];
        
        
        this.state = {
            bounceValue: new Animated.Value(1),
        };

    }

    shouldComponentUpdate(nextProps) {
        let pickedTileNext = nextProps.shouldUpdateBoard;

        if (pickedTileNext.row !== this.pickedTile.row || pickedTileNext.column !== this.pickedTile.column || pickedTileNext.color !== this.pickedTile.color) {
            this.pickedTile = {row: pickedTileNext.row, column: pickedTileNext.column, color: pickedTileNext.color};
            if (this.pickedTile.row === Flowers.REFRESH_KEY) {
            } else {
                if (pickedTileNext.color >= 0) {
                    this.ballFlowers[this.generateKeyForBall(pickedTileNext.row, pickedTileNext.column)] = {
                        row: pickedTileNext.row,
                        column: pickedTileNext.column,
                        color: pickedTileNext.color
                    };

                    this.removeSame();
                }
            }

            return true;
        } else {
            if (pickedTileNext.row === Flowers.REFRESH_KEY && this.ballFlowers != nextProps.ballFlowers) {
                this.ballFlowers = nextProps.ballFlowers;
                return true;
            }
            return false;
        }
    }

    generateKeyForBall(row, column) {
        return `row:${row} column:${column}`;
    }

    componentWillReceiveProps(nextProps) {
        let pickedTileNext = nextProps.shouldUpdateBoard;
        if (pickedTileNext.row !== this.pickedTile.row || pickedTileNext.column !== this.pickedTile.column) {
        } else {
        }
    }

    render() {
        return (
            <View style={[styles.netContainer]}>
                <View style={{
                    backgroundColor: '#000000AA',
                    borderRadius: 5,
                    width: window.width,
                    height: window.width,
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: TILE_PADDING,
                }}>
                    {this.drawTiles()}
                </View>

            </View>
        );
    }


    drawTile(row = 0, column = 0) {
        return (
            <TouchableHighlight onPress={() => {
                if (this.isAnimating) return;
                this.props.onClickTile(row, column)
            }} underlayColor='#00000000'
                                key={`{x:${row}, y:${column}}`} style={{}}>
                <View>
                    <Image style={{
                        width: TILE_WIDTH,
                        height: TILE_WIDTH,
                    }} source={require('./img/lattice.png')}/>
                    <View style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 0, left: 0, right: 0, bottom: 0,
                    }}>
                        <Text style={{
                            color: (this.pickedTile.row == row && this.pickedTile.column == column) ? '#FF6600' : '#FFFFFF11',
                            fontSize: 9
                        }}>{`x:${row}, y:${column}`}</Text>


                        {this.drawFrame(row, column)}
                        {this.drawBall(row, column)}
                        {this.drawDisappear(row, column)}
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    drawDisappear(row, column) {
        for (let ball of this.disappearBallFlowers) {
            if (ball.row == row && ball.column == column) {
                return (
                    <Animated.Image key={`{dx:${row}, dy:${column}}`} style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: TILE_WIDTH,
                        height: TILE_WIDTH,
                        transform: [                        // `transform` is an ordered array
                            {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
                        ]
                    }} source={require('./img/effect.png')}/>)
            }
        }
    }

    removeSame() {
        if (Object.keys(this.ballFlowers).length < MIN_REMOVE_COUNT) {
            return;
        }

        var sameRowBalls = [];
        var sameColumnBalls = [];
        var result = [];

        for (var column = 0; column < MAX_TILE_ROW_COUNT; column++) {
            var lastRow = 0;
            var lastColumnColor = -1;
            var lastRowColor = -1;
            sameRowBalls = [];
            sameColumnBalls = [];
            for (var row = 0; row < MAX_TILE_ROW_COUNT; row++) {


                let keyColumn = this.generateKeyForBall(column, row);
                let ballFlowerColumn = this.ballFlowers[keyColumn];

                if (ballFlowerColumn && (row - lastRow) <= 1) {
                    if (lastColumnColor === ballFlowerColumn.color) {
                        sameRowBalls.push(ballFlowerColumn);
                        if (sameRowBalls.length >= MIN_REMOVE_COUNT) {
                            result = result.concat(sameRowBalls);
                        }
                    } else {
                        sameRowBalls = [];
                        sameRowBalls.push(ballFlowerColumn);
                    }
                } else {
                    sameRowBalls = [];
                }

                lastColumnColor = ballFlowerColumn ? ballFlowerColumn.color : -1;


                let keyRow = this.generateKeyForBall(row, column);
                let ballFlowerRow = this.ballFlowers[keyRow];

                if (ballFlowerRow && (row - lastRow) <= 1) {
                    if (lastRowColor == ballFlowerRow.color) {
                        sameColumnBalls.push(this.ballFlowers[keyRow]);
                        if (sameColumnBalls.length >= MIN_REMOVE_COUNT) {
                            result = result.concat(sameColumnBalls);
                        }
                    } else {
                        sameColumnBalls = [];
                        sameColumnBalls.push(ballFlowerRow);
                    }
                } else {
                    sameColumnBalls = [];
                }
                lastRowColor = ballFlowerRow ? ballFlowerRow.color : -1;

                lastRow = row;
            }
        }

        if (result.length >= MIN_REMOVE_COUNT) {
            this.disappearBallFlowers = result;
            this.removeBallFlowers(result);
            this.startAnimation();

        }
    }

    removeBallFlowers(sameRowBalls) {
        for (let ball of sameRowBalls) {
            let key = this.generateKeyForBall(ball.row, ball.column);
            this.ballFlowers[key] = null;
        }
    }


    drawFrame(row, column) {
        if (this.pickedTile.row == row && this.pickedTile.column == column) {
            return (
                <Image style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: TILE_WIDTH,
                    height: TILE_WIDTH
                }} source={require('./img/blue_frame.png')}/>)
        }
    }

    drawBall(row, column) {
        let ballFlower = this.ballFlowers[this.generateKeyForBall(row, column)];
        if (ballFlower) {
            return (
                <Image key={`{bx:${row}, by:${column}}`} style={{
                    position: 'absolute',
                    top: BALL_MARGIN_TILE,
                    left: BALL_MARGIN_TILE,
                    right: BALL_MARGIN_TILE,
                    bottom: BALL_MARGIN_TILE,
                    width: BALL_WIDTH,
                    height: BALL_WIDTH
                }} source={Flowers.BALL_FLOWERS[ballFlower.color]}/>)
        }
    }


    componentDidMount() {

    }

    startAnimation() {
        this.isAnimating = true;
        this.state.bounceValue.setValue(1.1);     // Start large
        Animated.spring(                          // Base: spring, decay, timing
            this.state.bounceValue,                 // Animate `bounceValue`
            {
                toValue: 0.6,                         // Animate to smaller size
                friction: 3,                          // Bouncier spring
                tension: 40,
            }
        ).start(() => {
            this.disappearBallFlowers = [];
            this.isAnimating = false;
            this.props.onRemoveBallFlowersAnimationEnd();
            this.refreshState();
        });// Start the animation
    }

    refreshState() {
        this.pickedTile = {row: Flowers.REFRESH_KEY, column: Flowers.REFRESH_KEY, color: -1};
    }

    drawTiles() {
        for (var i = 0; i < MAX_TILE_ROW_COUNT; i++) {
            if (this.columnRows.length == MAX_TILE_ROW_COUNT) {
                this.columnRows[i] = this.drawRowTiles(i);
            } else {
                this.columnRows.push(this.drawRowTiles(i));
            }
        }
        return this.columnRows;
    }

    drawRowTiles(column = 0) {
        for (var i = 0; i < MAX_TILE_ROW_COUNT; i++) {
            // console.log(this.tileRows);
            // console.log('c' + column + ' i=' + i);
            if (!this.tileRows[column]){
                console.log('generate array');
                this.tileRows[column] = [];
            }
            if (this.tileRows[column].length == MAX_TILE_ROW_COUNT) {
                this.tileRows[column][i] = this.drawTile(i, column);
            } else {
                this.tileRows[column].push(this.drawTile(i, column));
            }
        }

        return (<View key={column} style={{flexDirection: 'row', justifyContent: 'space-between'}}>{this.tileRows[column]}</View>);
    }

    componentWillMount() {

    }

    componentWillUnmount(){
        this.disappearBallFlowers = [];
        this.isAnimating = false;
        this.ballFlowers = {};


        this.columnRows = [];
        this.tileRows = [[]];
    }


}

const styles = StyleSheet.create({
    netContainer: {},
});

Board.defaultProps = {};

Board.propTypes = {
    onClickTile: PropTypes.func,
    onRemoveBallFlowersAnimationEnd: PropTypes.func,
};

export default Board;
