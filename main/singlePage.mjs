export default`
    html{
        height:100%;
    }
    body{
        height:100%;
        margin:0;
        background-color:#444;
    }
    body>div{
        display:table;
        width:100%;
        height:100%;
    }
    body>div>*{
        display:table-cell;
        vertical-align:middle;
        text-align:center;
        line-height:0;
    }
    body>div>*>*{
        display:inline-block;
        line-height:1;
    }
`
