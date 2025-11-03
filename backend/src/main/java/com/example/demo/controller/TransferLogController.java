package com.example.demo.controller;

import com.example.demo.entity.TransferLog;
import com.example.demo.repository.TransferLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfer-logs")
@CrossOrigin(origins = "*")
public class TransferLogController {

    private final TransferLogRepository transferLogRepository;

    public TransferLogController(TransferLogRepository transferLogRepository) {
        this.transferLogRepository = transferLogRepository;
    }

    @GetMapping
    public List<TransferLog> getAllTransferLogs() {
        return transferLogRepository.findAll();
    }
}
