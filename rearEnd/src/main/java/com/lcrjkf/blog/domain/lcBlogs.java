package com.lcrjkf.blog.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class lcBlogs {
    private int id;
    private String title;
    private String info;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+0")
    private Date createTime;

    public lcBlogs() {
    }

    @Override
    public String toString() {
        return "lcBlogs{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", info='" + info + '\'' +
                ", createTime=" + createTime +
                '}';
    }

    public lcBlogs(int id, String title, String info, Date createTime) {
        this.id = id;
        this.title = title;
        this.info = info;
        this.createTime = createTime;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
