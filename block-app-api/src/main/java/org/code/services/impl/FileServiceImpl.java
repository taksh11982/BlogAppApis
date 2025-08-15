package org.code.services.impl;

import org.code.services.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;
@Service
public class FileServiceImpl implements FileService {
    @Override
    public String uploadImage(String path, MultipartFile file) throws FileNotFoundException, IOException {
        String name=file.getOriginalFilename();
        String randomId = UUID.randomUUID().toString();
        String concat = randomId.concat(name.substring(name.lastIndexOf(".")));
        String filePath=path+File.separator+concat;
        File f=new File(path);
        if(!f.exists()) {
            f.mkdirs();
        }
        try {
            Files.copy(file.getInputStream(), Paths.get(filePath));
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }


        return randomId;
    }


    @Override
    public InputStream getSource(String path, String fileName) throws FileNotFoundException, IOException {
        String fullPath = path + File.separator + fileName;
        InputStream is = null;
        try {
            is = new FileInputStream(fullPath);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return is;
    }
}
