import {useRef, useState, forwardRef} from 'react';

interface IPropsSeat {
  xpos: number,
  ypos: number,
  row: number,
  col: number,
  click: (e:any) => void
}

interface IPropsGrid {
  rows:number,
  cols: number,
  selected: {col:number | undefined,row:number | undefined},
  onClickSelected: (e:any) => void,
}

const Seat = forwardRef((props:IPropsSeat, ref:any) => {
  return (
    <div ref={ref} style={{position: 'absolute',top:props.ypos+'px', left:props.xpos+'px', backgroundColor: '0xccccff',padding: '10px'}}>
      <input onChange={props.click} data-row={props.row} data-col={props.col} type="checkbox" />
    </div>
  );
});

const Grid = ({ rows, cols,onClickSelected, selected }:IPropsGrid) => {
  const arr = [];

  let seatRef = useRef<HTMLDivElement[]>([]);
  seatRef.current = [];

  const addToRefs = (elm:HTMLDivElement) => {
    seatRef.current.push(elm);

    if (selected.col !== undefined && selected.row !== undefined) {
      for (let i = 0; i < seatRef.current.length; i++) {
        const tmp_elm:any = seatRef.current[i];
        if (tmp_elm !== null) {
          const inpt = tmp_elm.getElementsByTagName("input")[0];
          const col = +inpt.getAttribute("data-col");
          const row = +inpt.getAttribute("data-row");
          if (col === +selected.col && row === +selected.row) {
            inpt.checked = false;
          }
        }
      }
    }
  };

  for(let idx:number=0;idx<cols;idx++){
          for(let idy:number=0;idy<rows;idy++) {
            let _xpos= 50+(30*idx);
            let _ypos= 20+(30*idy);
            let _row = idy+1;
            let _col = idx+1;
            
            arr.push(
            idx===0
          ?
          <div style={{position:'absolute',top: _ypos+8, width: ' 70px', backgroundColor:'#cccccc'}}>{`Řada: ${_row} `}</div>
          :
        (idy===0
          ?
          <div style={{position:'absolute',top: 0, left: _xpos+15 , backgroundColor:'#cccccc'}}>{`${idx}`}</div>
          :
        <Seat click={onClickSelected} xpos={_xpos} ypos={_ypos} row={_row} col={_col} ref={addToRefs} />
        )
      );
    }
  }

  return <section id="gridContainer">{arr}</section>;
};

const App = () => {
  const [seat, setSeat] = useState<{row:number,col:number}[]>([])
  const [unselectedItem, setUnselectedItem] = useState<{col:number | undefined,row:number | undefined}>({col:undefined,row:undefined})

  const onSeatClick = (e:any) => {
    const _elm = e.currentTarget;
    const _col = _elm.getAttribute("data-col");
    const _row = _elm.getAttribute("data-row");
    const _checked = _elm.checked;
    setSeat(
      _checked
        ? [...seat, { col: _col, row: _row }]
        : seat.filter((item) => item.col !== _col && item.row !== _row)
    );
  };

  const onSelectItemClick = (col:number, row:number) => {
    setUnselectedItem({ ...unselectedItem, col: col, row: row });
    setSeat(seat.filter((item) => item.col !== col && item.row !== row))
  };


  return(
    <section>
      <h1 style={{position: 'absolute', top: '350px'}}>Počet vybraných míst:{seat.length}</h1>
      <Grid rows={10} cols={20} selected={unselectedItem} onClickSelected={onSeatClick} />
      <section style={{position: 'absolute', right: '200px'}}>
        <h2>Vybrana mista:</h2>
        {
          seat.map((item:any,idx:number) => <li>{`Řada: ${item.row}, Sedadlo: ${item.col}`}<a href="#" rel="noreferrer" onClick={
            () => {onSelectItemClick(item.col,item.row)}
          }>Zrušit</a></li>)
        }
      </section>
    </section>
    )
}

export default App;
