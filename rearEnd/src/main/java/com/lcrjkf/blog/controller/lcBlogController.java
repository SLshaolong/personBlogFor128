package com.lcrjkf.blog.controller;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.lcrjkf.blog.domain.lcBlogs;
import com.lcrjkf.blog.domain.lcSetting;
import com.lcrjkf.blog.utils.fileChange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/blog")
public class lcBlogController {
  @Autowired
    fileChange fileChange;
  @Value("${upload.filePath}")
    private String uploadFilePath;
  @GetMapping("/getSetting")
  /**
   * 获取设置详情
   */

  public ObjectNode getFileSetting(){
      ObjectMapper objectMapper = new ObjectMapper();
      ObjectNode objectNode = objectMapper.createObjectNode();
      String fileName = "setting.json";
      List<lcSetting> lcSettings = fileChange.readFile(fileName, lcSetting.class);
      if(lcSettings.size()<=0){
          objectNode.put("status",500);
          objectNode.put("msg","读取配置文件失败!!!");
          return objectNode;
      }

      objectNode.put("status",200);
      ArrayNode dataArray = objectNode.putArray("data");
      for (lcSetting setting : lcSettings) {
          JsonNode settingNode = objectMapper.valueToTree(setting);
          dataArray.add(settingNode);
      }

      return objectNode;
  }

    /**
     * 修改配置文件
     * @return 返回状态码 200 成功
     */
  @PostMapping("/editSetting")
  public ObjectNode upDateSettingInfo(@RequestBody lcSetting newData){
      String fileName = "setting.json";
      ObjectMapper objectMapper = new ObjectMapper();
      ObjectNode objectNode = objectMapper.createObjectNode();
      // 删除以前的数据
     try{
         fileChange.deleteById(fileName, lcSetting.class,1); // 默认只有一条
         newData.setId(1); // 只有这一条 默认添加
        boolean flag =  fileChange.addToFile(fileName,newData);
        if (flag){
            objectNode.put("status",200);
            objectNode.put("msg","修改成功");
            return objectNode;
        }else{
            objectNode.put("status",500);
            objectNode.put("msg","修改失败!!!");
            return objectNode;
        }
     }catch (Exception e){
         System.out.println(e);
     }


      System.out.println(newData.toString());

      return objectNode;
  }

    /**
     * 上传文件
     * @param file
     * @return
     */
    @PostMapping("/upload")
    public ObjectNode handleFileUpload(@RequestParam("file") MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        if (file.isEmpty()) {
            objectNode.put("status",500);
            objectNode.put("msg","请选择文件上传");
            return objectNode;
        }
        createUploadDirectory();
        try {
            // 获取上传文件的原始文件名
            String originalFileName = file.getOriginalFilename();

            // 获取当前日期时间戳
            String timestamp = String.valueOf(System.currentTimeMillis());

            // 获取文件扩展名
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));

            // 构造新的文件名
            String newFileName = timestamp + fileExtension;

            // 保存文件到指定目录
            Path filePath = Paths.get(uploadFilePath, newFileName);
            file.transferTo(filePath.toFile());

            // 构造文件访问链接
            String fileUrl = "/blog/" + newFileName;
            objectNode.put("status",200);
            objectNode.put("msg","文件上传成功");
            objectNode.put("filePath",fileUrl);
            return objectNode;
        } catch (Exception e) {
            e.printStackTrace();
            objectNode.put("status",500);
            objectNode.put("msg", String.valueOf(e));
            return objectNode;

        }

    }

    /**
     * 读取文件
     * @param fileName
     * @return
     */
    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        Path imagePath = Paths.get(uploadFilePath, fileName);

        try {
            // 判断文件是否存在
            if (Files.exists(imagePath) && Files.isReadable(imagePath)) {
                // 设置响应头
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG);

                // 从文件系统读取图像并返回
                return ResponseEntity.ok()
                        .headers(headers)
                        .body(new FileSystemResource(imagePath));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }

    }

    /**
     * 创建上传文件目录
     */
    private void createUploadDirectory() {
        File directory = new File(uploadFilePath);
        System.out.println(directory);
        if (!directory.exists()) {
            if (directory.mkdirs()) {
                System.out.println("Upload directory created: " + uploadFilePath);
            } else {
                System.err.println("Failed to create upload directory: " + uploadFilePath);
            }
        }
    }


    @GetMapping("/blogs")
    public ObjectNode getBlogs(){
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        String fileName = "blogs.json";
        List<lcBlogs> lcBlogsList = fileChange.readFile(fileName, lcBlogs.class);
        if(lcBlogsList.size()<=0){
            objectNode.put("status",500);
            objectNode.put("msg","读取配置文件失败!!!");
            return objectNode;
        }

        objectNode.put("status",200);
        ArrayNode dataArray = objectNode.putArray("data");
        for (lcBlogs blogs : lcBlogsList) {
            JsonNode blogNode = objectMapper.valueToTree(blogs);
            dataArray.add(blogNode);
        }

        return objectNode;
    }
    @DeleteMapping("blogs/{id}")
    public ObjectNode deleteBlogById(@PathVariable Integer id){
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        String fileName = "blogs.json";
        try{
          boolean flag =   fileChange.deleteById(fileName, lcBlogs.class,id);
          if(flag){
              objectNode.put("status",200);
              objectNode.put("msg","删除成功");
          }else{
              objectNode.put("status",500);
              objectNode.put("msg","删除失败!!!");
          }
        }catch (Exception e){
            e.printStackTrace();
            objectNode.put("status",500);
            objectNode.put("msg","未知错误");
        }
        return objectNode;
    }

    @PostMapping("/blogs")
    public ObjectNode addBlog(@RequestBody lcBlogs newDate){
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        String fileName = "blogs.json";
        try {

           boolean flag =  fileChange.addToFile(fileName,newDate);
            if(flag){
                objectNode.put("status",200);
                objectNode.put("msg","添加成功");
            }else{
                objectNode.put("status",500);
                objectNode.put("msg","添加失败!!!");
            }
        }catch (Exception e){
            e.printStackTrace();
            objectNode.put("status",500);
            objectNode.put("msg","未知错误");

        }
        return  objectNode;
    }
    @PutMapping("/blogs")
    public ObjectNode upDateBlogs(@RequestBody lcBlogs newData){
        String fileName = "blogs.json";
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        // 删除以前的数据
        try{
            fileChange.deleteById(fileName, lcBlogs.class, newData.getId()); // 默认只有一条
//            newData.setId(1); // 只有这一条 默认添加
            boolean flag =  fileChange.addToFile(fileName,newData);
            if (flag){
                objectNode.put("status",200);
                objectNode.put("msg","修改成功");
                return objectNode;
            }else{
                objectNode.put("status",500);
                objectNode.put("msg","修改失败!!!");
                return objectNode;
            }
        }catch (Exception e){
            System.out.println(e);
        }


        System.out.println(newData.toString());

        return objectNode;
    }


}
