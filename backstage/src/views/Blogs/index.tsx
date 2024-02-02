import { useEffect, useState } from "react";
import { addBlog, deleBlogById, editBlogById, getAllBlogs } from "../../api";
import { Button, Form, Input, Modal, Popconfirm, Space, message } from "antd";
import "./index.less";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
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
export default function index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [pageList, changePageList] = useState([]);
  const [form, setForm] = useState<any>({ title: 1 });
  const [flag, setFlag] = useState(false);
  const getPageInfo = async () => {
    const result = await getAllBlogs();
    console.log(result);
    if (result.status == 200) {
      changePageList(result.data.sort((a: any, b: any) => a.id - b.id));
      messageApi.success("列表数据获取成功!");
    } else {
      messageApi.error("列表数据获取失败!");
    }
  };
  const getCurrentDateTime = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const handleOk = (e: any) => {
    const newDate = getCurrentDateTime();
    const myData = { ...e };
    myData.createTime = newDate;
    console.log(myData);
    submitHandle(myData, flag);
    // 执行保存

    // setIsModalOpen(false);
  };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };
  useEffect(() => {
    getPageInfo();
  }, []);

  /**
   * 打开
   */
  const openHandle = () => {
    setFlagCallBack(true, () => {
      console.log("新增");
    });
    setTitle("add new blog");
    setIsModalOpen(true);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const submitHandle = async (data: any, flag?: boolean) => {
    if (flag) {
      // 新增
      const result = await addBlog(data);
      console.log(result);
      if (result.status == 200) {
        messageApi.success("新增成功");
        getPageInfo();
      } else {
        messageApi.warning("新增失败");
      }
    } else {
      const result = await editBlogById(data);
      console.log(result);
      if (result.status == 200) {
        messageApi.success("修改成功");
        getPageInfo();
      } else {
        messageApi.warning("修改失败");
      }
    }
    setIsModalOpen(false);
  };
  const setFlagCallBack = (flag: boolean, callback?: () => void) => {
    setFlag(flag);
    callback && callback();
  };

  /**
   * 编辑
   */
  const editHandle = (e: any) => {
    setForm(e);
    setFlagCallBack(false, () => {
      console.log("编辑");
    });
    setTitle("eidt  blog");
    setIsModalOpen(true);
  };

  const delHandle = async (id: string | number) => {
    console.log(id);
    const result = await deleBlogById(id);
    if (result.status == 200) {
      messageApi.info("删除成功");
      getPageInfo();
    } else {
      messageApi.warning("删除失败");
    }
  };
  return (
    <>
      {contextHolder}
      <div className="blogContainer">
        <div className="title">文档列表</div>
        <div className="addButton">
          <Button type="primary" onClick={openHandle}>
            新增
          </Button>
        </div>
        <ul className="pageList">
          {pageList.map((e: any) => {
            return (
              <li key={e.id}>
                <div className="li_title">{e.title}</div>
                <div className="li_button_views">
                  <Space>
                    <Popconfirm
                      title="Delete the blog"
                      description="Are you sure to delete this blog?"
                      onConfirm={() => delHandle(e.id)}
                      // onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        danger
                        type="primary"
                        shape="circle"
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>

                    <Button
                      type="primary"
                      shape="circle"
                      onClick={() => editHandle(e)}
                      icon={<EditOutlined />}
                      // size="small"
                    />
                  </Space>
                </div>
                <div className="li_createTime">{e.createTime}</div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 富文本 */}
      <Modal
        title={title}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        okText="Submit"
        destroyOnClose
      >
        <br />
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          style={{ maxWidth: 600 }}
          onFinish={handleOk}
          onFinishFailed={onFinishFailed}
          initialValues={flag == false ? form : {}}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "please set your blog's title" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Info"
            name="info"
            rules={[{ required: true, message: "please set your blog's info" }]}
          >
            <ReactQuill
              theme="snow"
              modules={modules}

              // value={value1}
              // onChange={setValue1}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
        <footer></footer>
      </Modal>
    </>
  );
}
