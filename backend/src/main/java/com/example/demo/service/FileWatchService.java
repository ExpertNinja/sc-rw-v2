package com.example.demo.service;

import com.example.demo.dto.RequestDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@Slf4j
public class FileWatchService implements CommandLineRunner {

    @Value("${file.transfer.source.base:source_system/StoragePath}")
    private String storagePath;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public void run(String... args) throws Exception {
        watchDirectory();
    }

    private void watchDirectory() throws IOException, InterruptedException {
        Path path = Paths.get(storagePath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
            log.info("Created storage directory: {}", storagePath);
        }

        WatchService watchService = FileSystems.getDefault().newWatchService();
        path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);

        log.info("Watching directory: {}", storagePath);

        while (true) {
            WatchKey key = watchService.take();

            for (WatchEvent<?> event : key.pollEvents()) {
                WatchEvent.Kind<?> kind = event.kind();

                if (kind == StandardWatchEventKinds.ENTRY_CREATE) {
                    Path fileName = (Path) event.context();
                    log.info("New file detected: {}", fileName);

                    // Process the file
                    processNewFile(fileName.toString());
                }
            }

            boolean valid = key.reset();
            if (!valid) {
                break;
            }
        }
    }

    private void processNewFile(String fileName) {
        try {
            // Extract details from filename (assuming format: ReportType_YYYYMMDD_Suffix.ext)
            String[] parts = fileName.split("_");
            String reportType = parts.length > 0 ? parts[0] : "Unknown";
            String fileType = fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".") + 1) : "unknown";

            // Create request DTO
            RequestDTO requestDTO = new RequestDTO();
            requestDTO.setUniqueId(UUID.randomUUID().toString());
            requestDTO.setAction("New");
            requestDTO.setInputFileName(fileName);
            requestDTO.setFileType(fileType.toUpperCase());
            requestDTO.setOutputFolderPath("SG/Retail/" + reportType); // Default path, can be customized

            // Call the API internally
            String apiUrl = "http://localhost:8080/api/requests";
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestDTO, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Successfully processed file: {}", fileName);
            } else {
                log.error("Failed to process file: {} - Status: {}", fileName, response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("Error processing new file {}: {}", fileName, e.getMessage(), e);
        }
    }
}
