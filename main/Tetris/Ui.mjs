import doe from                     '../../lib/doe.mjs'
import constant from                './constant.mjs'
import isValidTransfer from         './isValidTransfer.mjs'
let color=[
    '#00FFFF',  // Aqua
    '#0000FF',  // Standard Blue
    '#FFA500',  // Standard Orange
    '#FFFF00',  // Standard Yellow
    '#00FF00',  // Standard Lime
    '#800080',  // Standard Purple
    '#FF0000',  // Standard Red
]
function Ui(){
    this.node=doe.canvas({
        className:'tetris',tabIndex:-1,width:640,height:480,
        onkeydown:e=>{
            this.game.in(['keyDown',e.key])
        },
        onkeyup:e=>{
            this.game.in(['keyUp',e.key])
        },
    })
    this._uiCache={
        context:this.node.getContext('2d',{alpha:false})
    }
    this._uiCache.context.fillStyle='darkgray'
    this._uiCache.context.fillRect(0,0,640,480)
    this._status={
        board:[...Array(10)].map(()=>({}))
    }
}
Ui.prototype._drawBoardAt=function(atX,atY){
    let status=this._status
    for(let x=0;x<10;x++)
    for(let y=0;y<20;y++){
        this._uiCache.context.fillStyle=
            status.board[x][y]==undefined
        ?
            'black'
        :
            color[status.board[x][y]]
        this._uiCache.context.fillRect(atX+17*x,atY+17*(20-1-y),16,16)
    }
    if(status.current){
        let
            p=this._shadowPosition(),
            c=status.current
        this._drawTetrominoShapeAt(
            atX+17*p[0],
            atY+17*(20-(p[1]+constant.shape[c.type][0].length)),
            c.type,
            c.direction,
            'gray'
        )
        this._drawTetrominoAt(
            atX+17*status.current.x,
            atY+17*(20-(c.y+constant.shape[c.type][0].length)),
            c.type,
            c.direction
        )
    }
}
Ui.prototype._drawTetrominoAt=function(atX,atY,id,direction=0){
    this._drawTetrominoShapeAt(atX,atY,id,direction,color[id])
}
Ui.prototype._drawTetrominoShapeAt=function(atX,atY,id,direction,color){
    this._uiCache.context.fillStyle=color
    let
        shape=constant.shape[id][direction],
        n=shape.length
    for(var r=0;r<n;r++)for(var c=0;c<n;c++)if(shape[r][c])
        this._uiCache.context.fillRect(atX+17*c,atY+17*r,16,16)
}
Ui.prototype._shadowPosition=function(){
    let status=this._status,delta_y__shadow=0
    while(isValidTransfer(
        status.current,status.board,0,delta_y__shadow-1,0
    ))
        delta_y__shadow--
    return[
        status.current.x,
        status.current.y+delta_y__shadow
    ]
}
Ui.prototype.set=function(set){
    if(set.board)
        this._status.board=set.board
    if(set.current)
        this._status.current=set.current
    if(set.board||set.current){
        this._uiCache.context.fillStyle='darkgray'
        this._uiCache.context.fillRect(160,12,169,407)
        this._drawBoardAt(160,80)
    }
    if(set.next)
        this._status.next=set.next
    this._uiCache.context.fillStyle='darkgray'
    this._uiCache.context.fillRect(400,80,67,67)
    if(this._status.next!=undefined)
        this._drawTetrominoAt(400,80,this._status.next)
    if(set.hold)
        this._status.hold=set.hold
    this._uiCache.context.fillStyle='darkgray'
    this._uiCache.context.fillRect(80,80,67,67)
    if(this._status.hold!=undefined)
        this._drawTetrominoAt(80,80,this._status.hold)
}
export default Ui
