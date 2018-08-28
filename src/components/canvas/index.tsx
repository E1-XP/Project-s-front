import { MouseEvent } from "react";
import { compose, lifecycle, withHandlers, withState } from "recompose";
import { connect, Dispatch } from "react-redux";
import _throttle from "lodash.throttle";

import { actions } from "../../actions";
import { State } from "../../store";

import { CanvasComponent } from './template';

export interface Props {
    onRef: (ref: any) => any;
    getBoardRef: () => any;
    boardState: BoardState;
    setBoardState: (v: object) => void;
    drawingPoints: DrawingPoint[][];
    broadcastedDrawingPoints: BroadcastedDrawingPoints;
    setIsMouseDown: (val: boolean) => void;
    setWeight: (e: any, val: number) => void;
    setIsColorPickerOpen: (val: boolean) => void;
    setIsMouseDownFalse: () => void;
    setIsImageSelectorOpen: (val?: boolean) => void;
    handleMouseDown: (e: MouseEvent) => void;
    handleMouseUp: (e: MouseEvent) => void;
    handleMouseMove: (e: MouseEvent) => void;
    drawPoint: (e: MouseEvent, x?: number, y?: number, fill?: string,
        weightArg?: number) => void;
    setDrawingPoint: (v: DrawingPoint) => Dispatch;
    setNewDrawingPointsGroup: () => Dispatch;
    initClearDrawingPoints: () => Dispatch;
    initDrawingBroadcast: () => Dispatch;
    initMouseUpBroadcast: () => Dispatch;
    initCanvasToImage: (v: any) => Dispatch;
    renderImage: () => void;
    setSelectedColor: (e: any) => void;
    handleImageChange: (e: any) => void;
    initInRoomDrawingSelect: (id: number) => Dispatch;
    handleResetBtn: () => void;
    initializeBoard: () => void;
    handleResize: (e?: any) => void;
}

interface BroadcastedDrawingPoints {
    [key: string]: DrawingPoint[][];
}

interface BoardState {
    isMouseDown: boolean;
    isImageSelectorOpen: boolean;
    isColorPickerOpen: boolean;
    selectedColor: string;
    weight: number;
}

interface DrawingPoint {
    x: number;
    y: number;
    fill: string;
    weight: number;
}

const lifecycleMethods = {
    componentDidMount() {
        this.props.initializeBoard();
        this.props.handleResize();
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
    setIsImageSelectorOpen: (props: Props) => (is?: boolean) => {
        const value = is || !props.boardState.isImageSelectorOpen;
        const bothOpened = value && props.boardState.isColorPickerOpen;

        const newState = { ...props.boardState, isImageSelectorOpen: value };
        if (bothOpened) newState.isColorPickerOpen = false;

        props.setBoardState(newState);
    },
    setSelectedColor: (props: Props) => (color: any) => {
        props.setBoardState({ ...props.boardState, selectedColor: color.hex })
    },
    setWeight: (props: Props) => (e: any, value: number) => {
        props.setBoardState({ ...props.boardState, weight: value })
    },
    setIsColorPickerOpen: (props: Props) => (is: boolean) => {
        const bothOpened = is && props.boardState.isImageSelectorOpen;

        const newState = { ...props.boardState, isColorPickerOpen: is };
        if (bothOpened) newState.isImageSelectorOpen = false;

        props.setBoardState(newState);
    }
};

const handlers1 = () => {
    let boardRef: any;
    let ctx: CanvasRenderingContext2D;

    return {
        onRef: (props: Props) => (ref: any) => boardRef = ref,
        getBoardRef: (props: Props) => () => boardRef,
        initializeBoard: (props: Props) => () => {
            ctx = boardRef.getContext('2d');
            document.addEventListener('mouseup', props.setIsMouseDownFalse);
        },
        prepareForUnmount: (props: Props) => () => {
            document.removeEventListener('mouseup', props.setIsMouseDownFalse);
        },
        drawPoint: (props: Props) => (e: MouseEvent, x?: number, y?: number, fill?: string,
            weightArg?: number) => {
            const { pageX, pageY } = e;
            const { selectedColor, weight } = props.boardState;
            const board = boardRef;
            const { top, left, width, height } = boardRef.getBoundingClientRect();

            const xPos = ((pageX - left - scrollX) / width) * board.width;
            const yPos = ((pageY - top - scrollY) / height) * board.height;

            props.setDrawingPoint({
                x: x !== undefined ? x : xPos,
                y: y !== undefined ? y : yPos,
                fill: fill !== undefined ? fill : selectedColor,
                weight: weightArg !== undefined ? weightArg : weight
            });
        },
        renderImage: (props: Props) => () => {
            console.log('rendering');

            ctx.clearRect(0, 0, boardRef.width, boardRef.height);
            // const renderLoop=()=>{
            // };

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, boardRef.width, boardRef.height);

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
        handleImageChange: (props: Props) => (e: any) => {
            props.initInRoomDrawingSelect(e.target.closest('li').dataset.id);
        },
        handleResetBtn: (props: Props) => (e: HTMLButtonElement) => {
            ctx.clearRect(0, 0, boardRef.width, boardRef.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, boardRef.width, boardRef.height);

            props.initClearDrawingPoints();

            setTimeout(() => {
                const imgB64 = boardRef.toDataURL('image/jpeg', 0.5);
                props.initCanvasToImage(imgB64);
            }, 500);
        }
    }
};

const handlers2 = {
    handleResize: (props: Props) => () => {
        window.addEventListener('resize', props.renderImage);
    },
    handleMouseDown: (props: Props) => (e: MouseEvent) => {
        const { pageX, pageY } = e;
        const board = props.getBoardRef();
        const { top, left, width, height } = board.getBoundingClientRect();

        props.setNewDrawingPointsGroup();

        const xPos = ((pageX - left - scrollX) / width) * board.width;
        const yPos = ((pageY - top - scrollY) / height) * board.height;

        props.drawPoint(e);
        props.drawPoint(e, xPos + 2, yPos + 2)

        props.renderImage();
        props.setIsMouseDown(true);
    },
    handleMouseUp: (props: Props) => () => {
        props.setIsMouseDown(false);
        props.initMouseUpBroadcast();

        setTimeout(() => {
            const imgB64 = props.getBoardRef().toDataURL('image/jpeg', 0.5);
            props.initCanvasToImage(imgB64);
        }, 500);
    },
    handleMouseMove: (props: Props) => _throttle((e: MouseEvent) => {
        props.drawPoint(e);
        props.renderImage();
    }, 150)
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
    initMouseUpBroadcast: () => dispatch(actions.canvas.initMouseUpBroadcast()),
    initCanvasToImage: (v: any) => dispatch(actions.canvas.initCanvasToImage(v)),
    initInRoomDrawingSelect: (v: number) => dispatch(actions.rooms.initInRoomDrawingSelect(v))
});

export const Canvas = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withState('boardState', 'setBoardState', {
        isMouseDown: false,
        isImageSelectorOpen: false,
        isColorPickerOpen: false,
        selectedColor: '#000000',
        weight: 2
    }),
    withHandlers(stateHandlers),
    withHandlers(handlers1),
    withHandlers(handlers2),
    lifecycle<Props, {}>(lifecycleMethods)
)(CanvasComponent);
