package marketplace.neighbourhood.backend.controller;




import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;


@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:5173")
public class CloudinaryController {


    private final Cloudinary cloudinary;


    public CloudinaryController(Cloudinary cloudinary){

        this.cloudinary = cloudinary;

    }



    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile file
    ){

        try{


            Map uploadResult =
                    cloudinary.uploader()
                    .upload(
                        file.getBytes(),
                        ObjectUtils.emptyMap()
                    );


            return ResponseEntity.ok(
                    Map.of(
                        "imageUrl",
                        uploadResult.get("secure_url")
                    )
            );


        }
        catch(Exception e){

            return ResponseEntity
                    .badRequest()
                    .body(
                        Map.of(
                            "error",
                            e.getMessage()
                        )
                    );

        }

    }

}
