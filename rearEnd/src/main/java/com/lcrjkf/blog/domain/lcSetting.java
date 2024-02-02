package com.lcrjkf.blog.domain;

public class lcSetting {
    // id
    private int id;
    // 个人头像
    private String avatarImg;
    // 个人介绍
    private String introduce;
    // 背景图片
    private String bacPic;
    // 内容栏
    private String internalInfo;
    // 文章超链接地址
    private String documentLink;
    // 其他超链接地址
    private String otherLink;

    public lcSetting(int id, String avatarImg, String introduce, String bacPic, String internalInfo, String documentLink, String otherLink) {
        this.id = id;
        this.avatarImg = avatarImg;
        this.introduce = introduce;
        this.bacPic = bacPic;
        this.internalInfo = internalInfo;
        this.documentLink = documentLink;
        this.otherLink = otherLink;
    }

    public lcSetting() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAvatarImg() {
        return avatarImg;
    }

    public void setAvatarImg(String avatarImg) {
        this.avatarImg = avatarImg;
    }

    public String getIntroduce() {
        return introduce;
    }

    public void setIntroduce(String introduce) {
        this.introduce = introduce;
    }

    public String getBacPic() {
        return bacPic;
    }

    public void setBacPic(String bacPic) {
        this.bacPic = bacPic;
    }

    public String getInternalInfo() {
        return internalInfo;
    }

    public void setInternalInfo(String internalInfo) {
        this.internalInfo = internalInfo;
    }

    public String getDocumentLink() {
        return documentLink;
    }

    public void setDocumentLink(String documentLink) {
        this.documentLink = documentLink;
    }

    public String getOtherLink() {
        return otherLink;
    }

    public void setOtherLink(String otherLink) {
        this.otherLink = otherLink;
    }

    @Override
    public String toString() {
        return "{" +
                "id=" + id +
                ", avatarImg='" + avatarImg + '\'' +
                ", introduce='" + introduce + '\'' +
                ", bacPic='" + bacPic + '\'' +
                ", internalInfo='" + internalInfo + '\'' +
                ", documentLink='" + documentLink + '\'' +
                ", otherLink='" + otherLink + '\'' +
                '}';
    }
}
