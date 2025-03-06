package com.meeple.meeple_back.aws.s3.controller;

import com.meeple.meeple_back.aws.s3.service.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
@AllArgsConstructor
public class S3Controller {
    private final S3Service s3Service;

    /**
     * 파일 업로드 엔드포인트
     * URL: POST /api/files/upload
     *
     * @param file 업로드할 파일 (multipart/form-data)
     * @return 업로드된 파일의 S3 URL
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = s3Service.uploadFile(file);
        return new ResponseEntity<>(fileUrl, HttpStatus.OK);
    }
}
