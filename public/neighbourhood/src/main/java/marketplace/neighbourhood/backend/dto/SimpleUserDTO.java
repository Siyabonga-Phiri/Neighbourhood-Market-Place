package marketplace.neighbourhood.backend.dto;

public class SimpleUserDTO {

    public Long id;

    public String name;

    public String phone;


    public SimpleUserDTO(
            Long id,
            String name,
            String phone
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
    }
}