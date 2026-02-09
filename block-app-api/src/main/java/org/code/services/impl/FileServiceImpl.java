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
    public String uploadImage(String path, MultipartFile file) throws IOException {
        // Handle null or empty filename
        String originalFilename = file.getOriginalFilename();
        System.out.println("Original filename: " + originalFilename);
        
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IOException("File name is empty");
        }
        
        String randomId = UUID.randomUUID().toString();
        
        // Safely get extension
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf(".");
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        } else {
            extension = ".jpg"; // Default extension
        }
        
        String fileName = randomId + extension;
        
        // Use absolute path from user directory if relative path given
        String normalizedPath = path;
        if (!new File(path).isAbsolute()) {
            normalizedPath = System.getProperty("user.dir") + File.separator + path;
        }
        
        // Remove trailing slashes
        if (normalizedPath.endsWith("/") || normalizedPath.endsWith("\\")) {
            normalizedPath = normalizedPath.substring(0, normalizedPath.length() - 1);
        }
        
        String filePath = normalizedPath + File.separator + fileName;
        
        // Create directory if it doesn't exist
        File directory = new File(normalizedPath);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            System.out.println("Created directory: " + normalizedPath + " - " + created);
        }
        
        // Copy file
        System.out.println("Saving file to: " + filePath);
        Files.copy(file.getInputStream(), Paths.get(filePath));
        System.out.println("File saved successfully: " + fileName);
        
        return fileName;
    }


    @Override
    public InputStream getSource(String path, String fileName) throws FileNotFoundException, IOException {
        // Use absolute path if relative
        String normalizedPath = path;
        if (!new File(path).isAbsolute()) {
            normalizedPath = System.getProperty("user.dir") + File.separator + path;
        }
        if (normalizedPath.endsWith("/") || normalizedPath.endsWith("\\")) {
            normalizedPath = normalizedPath.substring(0, normalizedPath.length() - 1);
        }
        
        String fullPath = normalizedPath + File.separator + fileName;
        System.out.println("Reading file from: " + fullPath);
        return new FileInputStream(fullPath);
    }
}
