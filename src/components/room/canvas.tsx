import React, { ComponentType, MouseEvent } from "react";
import { compose, lifecycle, withHandlers, withState } from "recompose";
import { connect, Dispatch } from "react-redux";
import _throttle from "lodash.throttle";

import { actions } from "../../actions";
import { State } from "../../store";

import { CanvasNavbar } from "./navbar";

interface Props {
    onRef: (ref: any) => any;
    getBoardRef: () => any;
    boardState: BoardState;
    setBoardState: (v: object) => void;
    drawingPoints: DrawingPoint[][];
    broadcastedDrawingPoints: BroadcastedDrawingPoints;
    setIsMouseDown: (val: boolean) => void;
    setIsMouseDownFalse: () => void;
    handleMouseDown: (e: MouseEvent) => void;
    handleMouseUp: (e: MouseEvent) => void;
    handleMouseMove: (e: MouseEvent) => void;
    setDrawingPoint: (v: DrawingPoint) => Dispatch;
    setNewDrawingPointsGroup: () => Dispatch;
    initClearDrawingPoints: () => Dispatch;
    initDrawingBroadcast: () => Dispatch;
    initMouseUpBroadcast: () => Dispatch;
    renderImage: () => void;
    setSelectedColor: (e: any) => void;
    handleResetBtn: () => void;
}

interface BroadcastedDrawingPoints {
    [key: string]: DrawingPoint[][]
}

interface BoardState {
    isMouseDown: boolean;
    selectedColor: string;
}

interface DrawingPoint {
    x: number;
    y: number;
    fill: string;
    weight: number
}

const lifecycleMethods = {
    componentDidMount() {
        this.props.initializeBoard();
        this.props.drawingPoints.length && this.props.renderImage();
    },
    componentWillUnmount() {
        this.props.prepareForUnmount();
    },
    componentWillReceiveProps(nextP: Props) {
        const { broadcastedDrawingPoints } = this.props;

        nextP.broadcastedDrawingPoints !== broadcastedDrawingPoints &&
            this.props.renderImage();
    }
};

const stateHandlers = {
    setIsMouseDown: (props: Props) => (v: boolean) => {
        props.setBoardState({ ...props.boardState, isMouseDown: v })
    },
    setIsMouseDownFalse: (props: Props) => () => {
        props.setBoardState({ ...props.boardState, isMouseDown: false })
    },
    setSelectedColor: (props: Props) => (e: any) => {
        props.setBoardState({ ...props.boardState, selectedColor: e.target.value })
    }
}

const handlers1 = () => {
    let boardRef: any;
    let ctx: CanvasRenderingContext2D;

    return {
        onRef: (props: Props) => (ref: any) => boardRef = ref,
        getBoardRef: (props: Props) => () => boardRef,
        initializeBoard: (props: Props) => () => {
            document.addEventListener('mouseup', props.setIsMouseDownFalse);
            ctx = boardRef.getContext('2d');
        },
        prepareForUnmount: (props: Props) => () => {
            document.removeEventListener('mouseup', props.setIsMouseDownFalse);
        },
        renderImage: (props: Props) => () => {
            console.log('rendering');

            ctx.clearRect(0, 0, boardRef.width, boardRef.height);
            // const renderLoop=()=>{
            // };

            const drawFn = (itm: DrawingPoint, i: number, arr: DrawingPoint[]) => {
                const { x, y, fill, weight } = itm;

                if (!i) return;

                ctx.lineJoin = 'round';

                requestAnimationFrame(() => {
                    ctx.lineWidth = weight;
                    ctx.strokeStyle = fill;

                    ctx.beginPath();
                    ctx.lineTo(arr[i - 1].x, arr[i - 1].y);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                });
            };

            props.drawingPoints.map(itm => itm.map(drawFn));
            Object.keys(props.broadcastedDrawingPoints).map(key => {
                props.broadcastedDrawingPoints[key].map(itm => itm.map(drawFn));
            });
        },
        handleResetBtn: (props: Props) => (e: HTMLButtonElement) => {
            ctx.clearRect(0, 0, boardRef.width, boardRef.height);
            props.initClearDrawingPoints();
        }
    }
};

const handlers2 = {
    handleMouseDown: (props: Props) => (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { selectedColor } = props.boardState;
        const { top, left } = props.getBoardRef().getBoundingClientRect();

        props.setNewDrawingPointsGroup();

        props.setDrawingPoint({
            x: clientX - left,
            y: clientY - top,
            fill: selectedColor,
            weight: 2
        });
        props.setDrawingPoint({
            x: clientX - left + 2,
            y: clientY - top + 2,
            fill: selectedColor,
            weight: 2
        });

        props.renderImage();
        props.setIsMouseDown(true);
    },
    handleMouseUp: (props: Props) => () => {
        props.setIsMouseDown(false);
        props.initMouseUpBroadcast();
    },
    handleMouseMove: (props: Props) => (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { selectedColor } = props.boardState;
        const { top, left } = props.getBoardRef().getBoundingClientRect();

        props.setDrawingPoint({
            x: clientX - left,
            y: clientY - top,
            fill: selectedColor,
            weight: 2
        });

        props.renderImage();
    }
};

export const CanvasComponent: ComponentType<Props> = (props: Props) => {
    const { onRef, boardState, setSelectedColor, handleMouseDown, handleMouseUp,
        handleResetBtn, handleMouseMove } = props;

    return (<div>
        <CanvasNavbar setSelectedColor={setSelectedColor} handleResetBtn={handleResetBtn} />
        <canvas
            ref={onRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
            onMouseMove={boardState.isMouseDown ? _throttle(handleMouseMove, 50) : null}
            width={window.innerWidth * 0.6} height={window.innerHeight * 0.9}
            style={{ float: 'left', border: '1px solid black' }}
        />
    </div>);
};

const mapStateToProps = ({ canvas, user }: State) => ({
    drawingPoints: canvas.drawingPoints,
    broadcastedDrawingPoints: canvas.broadcastedDrawingPoints,
    user: user.userData
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setDrawingPoint: (v: DrawingPoint) => dispatch(actions.canvas.setDrawingPoint(v)),
    setNewDrawingPointsGroup: () => dispatch(actions.canvas.setNewDrawingPointsGroup()),
    initClearDrawingPoints: () => dispatch(actions.canvas.initClearDrawingPoints()),
    initMouseUpBroadcast: () => dispatch(actions.canvas.initMouseUpBroadcast())
});

//multiple handlers to gain access to the upper in the ones lower via props
export const Canvas = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withState('boardState', 'setBoardState', {
        isMouseDown: false,
        selectedColor: '#000000'
    }),
    withHandlers(stateHandlers),
    withHandlers(handlers1),
    withHandlers(handlers2),
    lifecycle<Props, {}>(lifecycleMethods)
)(CanvasComponent);
