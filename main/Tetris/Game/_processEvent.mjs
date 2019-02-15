function hold(t){
    if(this._status.hold==undefined){
        if(this._status.current==undefined)
            return
        this._status.hold=this._status.current.type
        this._getCurrent(t)
    }else if(this._status.current==undefined){
        this._setCurrent(t,this._status.hold)
        this._status.hold=undefined
    }else{
        let temp=this._status.hold
        this._status.hold=this._status.current.type
        this._setCurrent(t,temp)
    }
    this._set.hold=1
}
export default function(event){
    this._to(event[0])
    switch(event[1]){
        case'setNext':
            this._setNext(event[0],event[2])
        break
        case'keyDown':
            if(this._status.key[event[2]])
                break
            this._status.key[event[2]]=1
            switch(event[2]){
                case'C':
                case'c':
                    if(this._status.lineClear)
                        break
                    hold.call(this,event[0])
                break
                case'Z':
                case'z':
                    if(!this._status.current)
                        break
                    this._rotate(event[0],0)
                break
                case'ArrowUp':
                case'X':
                case'x':
                    if(!this._status.current)
                        break
                    this._rotate(event[0],1)
                break
                case'ArrowLeft':
                    this._status.horizontalMove={
                        direction:  -1,
                        status:     'first',
                        time:       event[0],
                    }
                    if(
                        this._status.current&&
                        this._isValidTransfer(-1,0,0)
                    )
                        this._transfer(event[0],-1,0,0)
                break
                case'ArrowRight':
                    this._status.horizontalMove={
                        direction:  1,
                        status:     'first',
                        time:       event[0],
                    }
                    if(
                        this._status.current&&
                        this._isValidTransfer(1,0,0)
                    )
                        this._transfer(event[0],1,0,0)
                break
                case' ':
                    if(!this._status.current)
                        break
                    for(;this._isValidTransfer(0,-1,0);)
                        this._transfer(event[0],0,-1,0)
                    this._drop(event[0])
                break
                case'ArrowDown':
                    this._status.down={
                        mode:'softdrop',
                        start:event[0],
                    }
                    if(
                        this._status.current&&
                        this._isValidTransfer(0,-1,0)
                    )
                        this._transfer(event[0],0,-1,0)
                break
            }
        break
        case'keyUp':
            if(!this._status.key[event[2]])
                break
            this._status.key[event[2]]=0
            switch(event[2]){
                case'ArrowLeft':
                    if(
                        this._status.horizontalMove&&
                        this._status.horizontalMove.direction==-1
                    )
                        this._status.horizontalMove=undefined
                break
                case'ArrowRight':
                    if(
                        this._status.horizontalMove&&
                        this._status.horizontalMove.direction==1
                    )
                        this._status.horizontalMove=undefined
                break
                case'ArrowDown':
                    this._status.down={
                        mode:'gravity',
                        start:event[0],
                    }
                break
            }
        break
    }
}
