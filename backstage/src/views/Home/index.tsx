/**
 * 设置页面
 * 个人头像
 * 个人介绍
 * 背景图片
 * 详情介绍
 * 其他链接
 * 文章链接
 * @returns
 */
import { useEffect, useState } from "react";
import { getAllSetting, saveSettingInfo } from "../../api";
import { Button, Input, Modal, UploadProps, message } from "antd";
import { Upload } from "antd";
import "./index.less";
import { PlusOutlined } from "@ant-design/icons";
import { baseUrl } from "../../api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
interface pageInfo {
  id: string | number;
  avatarImg: string | null;
  bacPic: string | null;
  internalInfo: string | null;
  documentLink: string | null;
  otherLink: string | null;
  introduce: string;
}
export default function index() {
  const [messageApi, contextHolder] = message.useMessage();
  const [list, changeList] = useState<pageInfo>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, changeFileList] = useState<any>([]);
  const [fileBacList, changeBacFileList] = useState<any>([]);
  const [value, setValue] = useState("");
  const [value1, setValue1] = useState("");

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ["image", "video", "link"],

      ["clean"],
    ],
  };

  const getPageInfo = async () => {
    const result = await getAllSetting();
    if (result.status == 200) {
      messageApi.success("success");
      changeList(result.data[0]);
      if (result.data[0].avatarImg) {
        const data = {
          uid: 0,
          url: result.data[0].avatarImg,
        };

        changeFileList([data]);
      }

      if (result.data[0].bacPic) {
        const data = {
          uid: 0,
          url: result.data[0].bacPic,
        };

        changeBacFileList([data]);
      }
      setValue(result.data[0].introduce);
      setValue1(result.data[0].internalInfo);
    } else {
      messageApi.error("error");
    }
  };
  const handleCancel = () => setPreviewOpen(false);
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>UpLoad</div>
    </button>
  );
  const handlePreview = async () => {
    setPreviewImage(list?.avatarImg as string);
    setPreviewOpen(true);
  };
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const myNewFileList = newFileList;
    if (fileList[0]?.status == "removed") {
      myNewFileList.length = 0;
    }
    const successResult = newFileList[0]?.response;
    if (successResult && successResult.status === 200) {
      const myList = list;
      myList!.avatarImg = "/" + baseUrl.split("/")[1] + successResult.filePath;
      changeList(myList);
      const data = {
        uid: 0,
        url: myList!.avatarImg,
      };
      changeFileList([data]);
      return;
    }

    changeFileList(myNewFileList);
  };
  const handleChange2: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    const myNewFileList = newFileList;
    if (fileList[0]?.status == "removed") {
      myNewFileList.length = 0;
    }
    const successResult = newFileList[0]?.response;
    if (successResult && successResult.status === 200) {
      const myList = list;
      myList!.bacPic = "/" + baseUrl.split("/")[1] + successResult.filePath;
      changeList(myList);
      const data = {
        uid: 0,
        url: myList!.bacPic,
      };
      changeBacFileList([data]);
      return;
    }

    changeBacFileList(myNewFileList);
  };

  const clickSaveHandle = async () => {
    console.log("save");
    const myData = { ...list };
    myData.introduce = value;
    myData.internalInfo = value1;
    const result = await saveSettingInfo(myData);
    console.log(result);
    if (result.status == 200) {
      messageApi.success("修改成功");
    } else {
      messageApi.error("修改失败");
    }
  };
  useEffect(() => {
    getPageInfo();
  }, []);

  const inputHandle = (e: any) => {
    const name = e.target.name;
    const data: any = { ...list };
    data[name] = e.target.value;
    changeMyList(data, () => {
      return null;
    });
  };
  const changeMyList = (data: pageInfo, callback?: () => void) => {
    changeList(data);
    if (callback) callback();
  };
  return (
    <>
      {contextHolder}
      <div className="mine">
        <div className="mine_title">首页详情设置</div>
        <div className="titleInfo">图片设置</div>
        <div className="imgsShow">
          <div className="imgBox">
            <div className="img_title">个人头像</div>
            <Upload
              action={baseUrl + "/upload"}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {/* {uploadButton} */}
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </div>
          <div className="imgBox">
            <div className="img_title">背景图片</div>
            <Upload
              action={baseUrl + "/upload"}
              listType="picture-card"
              fileList={fileBacList}
              onPreview={handlePreview}
              onChange={handleChange2}
            >
              {/* {uploadButton} */}
              {fileBacList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </div>
        </div>

        <div className="titleInfo">链接设置</div>
        <div className="linkBoxs">
          <div className="link_box">
            <div className="link_title">文档链接</div>
            <Input
              onInput={(e) => inputHandle(e)}
              name="documentLink"
              value={list?.documentLink as string}
            />
          </div>
          <div className="link_box">
            <div className="link_title">其他链接</div>
            <Input
              onInput={(e) => inputHandle(e)}
              name="otherLink"
              value={list?.otherLink as string}
            />
          </div>
        </div>
        <div className="titleInfo">介绍设置</div>

        <ReactQuill
          theme="snow"
          modules={modules}
          value={value}
          onChange={setValue}
        />

        <div className="titleInfo">内容设置</div>

        <ReactQuill
          theme="snow"
          modules={modules}
          value={value1}
          onChange={setValue1}
        />
      </div>
      <Button
        style={{ backgroundColor: "#52c41a" }}
        type="primary"
        onClick={clickSaveHandle}
      >
        保存
      </Button>
    </>
  );
}
