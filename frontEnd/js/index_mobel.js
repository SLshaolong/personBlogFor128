/**
 * 根据设备切换
 */

isMobile();
function isMobile() {
  let flag =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if(flag){
    //   window.location.href="/index-model.html"
    //   console.log("切换");
    }else{
        window.location.href="/index.html"
      // console.log('pc端');
      // console.log(window.location);
    }

}

window.onload(()=>{
    isMobile()
})