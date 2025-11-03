package com.example.demo.dto;

import lombok.Data;

@Data
public class RequestDTO {
    private String uniqueId;
    private String action;
    private String inputFileName;
    private String fileType;
    private String outputFolderPath;
}
