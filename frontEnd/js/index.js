/**
 *  获取当前时间
 */

const getCurrentTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const changeNewDate = () => {
  const element = document.querySelector("#time");
  element && (element.innerText = getCurrentTime());
  element &&
    setInterval(() => {
      element.innerText = getCurrentTime();
    }, 1000);
};

function toggleInfo(infoId) {
  const infoElement = document.getElementById(infoId);
  const contentHeight = infoElement.scrollHeight;
  infoElement.classList.toggle("active");
  infoElement.style.maxHeight = infoElement.classList.contains("active")
    ? `${contentHeight}px`
    : "0";
}

const getSettingInfo = () => {
  fetch("/api/blog/getSetting")
    .then((res) => res.json())
    .then((e) => {
      console.log(e);
      if (e.status == 200) {
        const MyData = e.data[0];
        // 设置头像
        document.querySelector("#img") &&
          (document.querySelector("#img").src = MyData.avatarImg);
        // 设置个人介绍
        document.querySelector("#produce") &&
          (document.querySelector("#produce").innerHTML = MyData.introduce);
        // 设置链接 文档链接
        document.querySelector("#page") &&
          (document.querySelector("#page").href = MyData.documentLink);
        // 设置链接 其他链接
        document.querySelector("#other") &&
          (document.querySelector("#other").href = MyData.otherLink);
        // 设置介绍内容
        document.querySelector("#title") &&
          (document.querySelector("#title").innerHTML = MyData.internalInfo);
        // 设置背景
        document.querySelector(".footerContainer") &&
          (document.querySelector(
            ".footerContainer"
          ).style.backgroundImage = `url(${MyData.bacPic})`);
        console.log(MyData);
      } else {
        console.log("请求获取失败--");
      }
    });
};

const getPage = (e) => {
  // console.log(e);
  // console.log(e.target.nextElementSibling);
  const infoElement = e.target.nextElementSibling;
  const contentHeight = infoElement.scrollHeight;
  infoElement && infoElement.classList.toggle("active");
  infoElement &&
    (infoElement.style.maxHeight = infoElement.classList.contains("active")
      ? `${contentHeight}px`
      : "0");
};

const getAllBlogs = () => {
  fetch("/api/blog/blogs")
    .then((res) => res.json())
    .then((e) => {
      if (e.status == 200) {
        const list = e.data;
        const result = list.map((e) => {
          const template = `
      <div class="line_detail">
                    <div class="line_time">
                        ${e.createTime}
                    </div>
                    <div class="line_title" onclick="getPage(event)">
                        ${e.title}
                    </div>
                    <div class="line_info">
                        ${e.info}
                    </div>
                </div>
      `;
          return template;
        });
        document.querySelector('.detailsLines').innerHTML=result.join('')
       
      } else {
        console.log("内容错误");
      }
    });
};

window.onload = () => {
  changeNewDate();
  getSettingInfo();
  document.querySelector('.detailsLines')&&getAllBlogs();
};
