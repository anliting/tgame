let npm={
    events:()=>module.import('https://cdn.rawgit.com/anliting/module/ba2cb12b7f16bf066fc82d2ebd24200d6c857856/node/events.js')
}
module.debug=true
module=module.share({npm})
Promise.all([
    module.shareImport('Status.js'),
    module.shareImport('Board.js'),
    module.shareImport('BoardHold.js'),
    module.shareImport('BoardNext.js'),
    module.shareImport('Tetromino.js'),
    module.shareImport('QueuePrototypeTetromino.js'),
]).then(modules=>{
let
    Status=modules[0],
    Board=modules[1],
    BoardHold=modules[2],
    BoardNext=modules[3],
    Tetromino=modules[4],
    QueuePrototypeTetromino=modules[5]
module.export=Tetris
function Tetris(){
    let
        mainDiv=document.createElement('div'),
        boardDiv=document.createElement('div'),
        holdDiv=document.createElement('div'),
        nextDiv=document.createElement('div'),
        statusDiv=document.createElement('div')
    mainDiv.id='div_game'
    mainDiv.style.position='fixed'
    mainDiv.style.backgroundColor='darkgray'
    mainDiv.style.top='50%'
    mainDiv.style.left='50%'
    mainDiv.style.marginTop='-240px'
    mainDiv.style.marginLeft='-320px'
    mainDiv.style.width='640px'
    mainDiv.style.height='480px'
    boardDiv.id='div_board'
    boardDiv.style.position='absolute'
    boardDiv.style.left='160px'
    boardDiv.style.top='80px'
    holdDiv.id='div_boardhold'
    holdDiv.style.position='absolute'
    holdDiv.style.left='80px'
    holdDiv.style.top='80px'
    nextDiv.id='div_boardnext'
    nextDiv.style.position='absolute'
    nextDiv.style.left='400px'
    nextDiv.style.top='80px'
    statusDiv.id='div_gamestatus'
    statusDiv.style.position='relative'
    statusDiv.style.left='400px'
    statusDiv.style.top='160px'
    mainDiv.appendChild(boardDiv)
    mainDiv.appendChild(holdDiv)
    mainDiv.appendChild(nextDiv)
    mainDiv.appendChild(statusDiv)
    document.body.appendChild(mainDiv)
    let
        queue_prototype_tetrominoes=new QueuePrototypeTetromino,
        board=new Board,
        tetromino=new Tetromino(
            queue_prototype_tetrominoes.access(0),
            queue_prototype_tetrominoes,
            board
        ),
        board_hold=new BoardHold(tetromino),
        board_next=new BoardNext(tetromino,queue_prototype_tetrominoes),
        status_game=new Status(tetromino,()=>stdout),
        stdout=''
    queue_prototype_tetrominoes.pop()
    board.build_html()
    board.update_html()
    board_hold.build_html()
    board_hold.update_html()
    board_next.build_html()
    board_next.update_html()
    tetromino.build_html()
    tetromino.update_html()
    tetromino.set_autofall()
    queue_prototype_tetrominoes.on('pop',ev=>{
        ev.then(()=>{
            board_next.update_html()
        })
    })
    var keys={},times_key={}
    var timeout_keyevents
    var onkeydown_body=function(event){
        keys[event.which]=true
        times_key[event.which]=0
    }
    var onkeyup_body=function(event){
        delete keys[event.which]
    }
    var keyevents=function(){
        timeout_keyevents=setTimeout(()=>{
            keyevents()
        },25)
        if(keys[32]){    // space: hard drop
            if(times_key[32]%8==0)
                tetromino.harddrop()
        }
        if(keys[37]){    // left arrow
            if(times_key[37]%4==0)
                tetromino.transfer(-1,0,0)
        }
        if(keys[38]){    // up arrow: 順時鐘轉
            if(times_key[38]%8==0)
                tetromino.rotate(1)
        }
        if(keys[39]){    // right arrow
            if(times_key[39]%4==0)
                tetromino.transfer(1,0,0)
        }
        if(keys[40]){    // down arrow: soft drop
            if(times_key[40]%4==0)
                tetromino.softdrop()
        }
        if(keys[67]){    // c: hold
            if(times_key[67]%8==0)
                board_hold.hold()
            board_hold.update_html()
        }
        if(keys[88]){    // x: 順時鐘轉
            if(times_key[88]%8==0)
                tetromino.rotate(1)
        }
        if(keys[90]){    // z: 逆時鐘轉
            if(times_key[90]%8==0)
                tetromino.rotate(0)
        }
        for(let i=0;i<128;i++)
            if(keys[i])
                times_key[i]++
        tetromino.update_html()
        status_game.update_html()
    }
    keyevents()
    document.body.onkeydown=onkeydown_body
    document.body.onkeyup=onkeyup_body
}
})