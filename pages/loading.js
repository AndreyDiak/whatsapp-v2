import LoopIcon from '@mui/icons-material/Loop';
function Loading () {
  return <center>
    <div style={{display: "grid", placeItems: "center", height: '100vh'}}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <img
          src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
          alt=""
          style={{marginBottom: 10}}
          height={200}
        />
        <LoopIcon style={{color: "#3cbc28"}} />
      </div>
    </div>
  </center>
}

export default Loading;