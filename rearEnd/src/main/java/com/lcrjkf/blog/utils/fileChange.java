package com.lcrjkf.blog.utils;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.type.TypeFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Component
public class fileChange {
    @Value("${output.file}")
    private String filePath;

    public <T> List<T> readFile(String fileName, Class<T> tClass) {
        ObjectMapper objectMapper = new ObjectMapper();
        System.out.println(filePath);
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

        try{
            Path directoryPath = FileSystems.getDefault().getPath(filePath);
            if (!Files.exists(directoryPath) || !Files.isDirectory(directoryPath)) {
                Files.createDirectories(directoryPath);

            }

            // 检查文件是否存在
            Path filePathObj = FileSystems.getDefault().getPath(filePath, fileName);
            if (!Files.exists(filePathObj) || !Files.isRegularFile(filePathObj)) {
                Files.createFile(filePathObj);
                objectMapper.writeValue(new FileOutputStream(filePathObj.toFile()), Collections.emptyList());
            }
        }catch (Exception e){
            e.printStackTrace();
            return  Collections.emptyList();
        }
        try (InputStream inputStream = new FileInputStream(filePath + "/" + fileName)) {
            if (inputStream != null) {
                // 使用 TypeFactory 构建 JavaType
                TypeFactory typeFactory = objectMapper.getTypeFactory();
                JavaType javaType = typeFactory.constructCollectionType(List.class, tClass);

                return objectMapper.readValue(inputStream, javaType);
            } else {
                System.err.println("File not found: " + fileName);
                return Collections.emptyList();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
    public <T> boolean addFile(String fileName, List<T> data) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

        try (OutputStream outputStream = new FileOutputStream(filePath + "/" + fileName)) {
            objectMapper.writeValue(outputStream, data);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    public <T> boolean deleteById(String fileName, Class<T> tClass, int id) {
        List<T> dataList = readFile(fileName, tClass);
        List<T> newDataList = new ArrayList<>();

        for (T item : dataList) {
            // 假设实体类有 getId 方法，根据实际情况调整
            int itemId = getIdFromEntity(item);
            if (itemId != id) {
                newDataList.add(item);
            }
        }

        // 保存更新后的数据
        boolean flag = addFile(fileName, newDataList);
        if(flag){
            return true;
        }else{
            return  false;
        }
    }
    private <T> int getIdFromEntity(T entity) {
        // 假设实体类有 getId 方法，根据实际情况调整
        // 示例中假设 getId 返回 int 类型的ID
        // 如果实体类的ID是其他类型，需要适配
        try {
            Method getIdMethod = entity.getClass().getMethod("getId");
            return (int) getIdMethod.invoke(entity);
        } catch (Exception e) {
            e.printStackTrace();
            return -1; // 返回一个无效的ID，表示未找到
        }
    }

    public <T> boolean addToFile(String fileName, T newData) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

        try {
            File file = new File(filePath + "/" + fileName);
            List<T> dataList;

            if (file.exists()) {
                // 如果文件存在，读取现有数据
                dataList = readFile(fileName, (Class<T>) newData.getClass());
            } else {
                // 如果文件不存在，创建一个新的空列表
                dataList = new ArrayList<>();
            }
                // 存在此数据
            // 获取新数据的ID，确保自增
            int newId = getNewId(dataList);
            System.out.println(getIdFromEntity(newData));
            if(getIdHasExit( fileName, newData) != -1){
                setId(newData, newId);

                // 添加新的数据
                dataList.add(newData);

                // 写入文件
                try (OutputStream outputStream = new FileOutputStream(file)) {
                    objectMapper.writeValue(outputStream, dataList);
                    return true;
                } catch (IOException e) {
                    e.printStackTrace();
                    return false;
                }
            }else{

                // 添加新的数据
                dataList.add(newData);

                // 写入文件
                try (OutputStream outputStream = new FileOutputStream(file)) {
                    objectMapper.writeValue(outputStream, dataList);
                    return true;
                } catch (IOException e) {
                    e.printStackTrace();
                    return false;
                }
            }
            // 设置新数据的ID字段

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 获取新的ID，确保自增
    private <T> int getNewId(List<T> dataList) {
        if (dataList.isEmpty()) {
            return 1; // 如果列表为空，返回1作为初始ID
        }

        // 获取列表中最大的ID，并加1
        return (int) (dataList.stream()
                        .mapToLong(data -> getIdFromData(data))
                        .max()
                        .orElse(0) + 1);
    }

    // 设置新数据的ID字段
    private <T> void setId(T newData, int newId) {
        try {
            // 查找ID字段
            Field idField = newData.getClass().getDeclaredField("id");
            idField.setAccessible(true);

            // 设置ID值
            idField.set(newData, newId);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }
    private <T> int getIdFromData(T data) {
        // 获取实体类的ID值的逻辑，假设实体类有名为 "id" 的字段
        try {
            Field idField = data.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            return (int) idField.get(data);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
            return 0;
        }
    }
    private <T>int getIdHasExit(String fileName, T newData){
        List<T> dataList = readFile(fileName, (Class<T>) newData.getClass());
        int i = -1;
        for (T line: dataList
             ) {
            int id = getIdFromEntity(line);
            System.out.println(id);
            if(id==getIdFromEntity(newData)){
                i = 0;
            }
        }
        return i;
    }




}
