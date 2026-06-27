package marketplace.neighbourhood.backend.dto;

import marketplace.neighbourhood.backend.entities.BookingStatus;
import java.time.LocalDateTime;

public class BookingDTO {

    public Long id;

    public String notes;

    public BookingStatus status;

    public LocalDateTime bookingTime;


    public Long requestId;

    public String requestTitle;


    public SimpleUserDTO customer;

    public SimpleUserDTO provider;


    public String providerName;

    public String providerPhone;

}