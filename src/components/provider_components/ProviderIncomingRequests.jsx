import { useEffect, useState } from "react";


export default function ProviderIncomingRequests({ providerId }) {


const [bookings,setBookings] = useState([]);

const [loading,setLoading] = useState(true);



useEffect(()=>{
    


if(!providerId) return;



fetch(
`http://localhost:8081/api/bookings/provider/${providerId}`
)


.then(res=>res.json())


.then(data=>{


setBookings(data);

setLoading(false);


})


.catch(err=>{


console.error(
"Failed to load provider bookings",
err
);


setLoading(false);


});


},[providerId]);






const handleWhatsApp=(phone,name)=>{


if(!phone)return;


let number =
phone.replace(/\D/g,"");



if(number.startsWith("0")){

number =
"27"+number.substring(1);

}



const url =
`https://wa.me/${number}?text=Hi ${name}, I accepted your request.`;


window.open(url,"_blank");


};





if(loading)
return <p>Loading incoming requests...</p>;






return(


<div className="provider-container">


<h2>
Incoming Requests
</h2>



{
bookings.length===0 &&

<p>
No incoming requests.
</p>

}




{

bookings.map(booking=>(


<div
key={booking.id}
className="provider-card"
>



<h3>
{booking.request?.title}
</h3>



<p>
{booking.request?.description}
</p>



<hr/>



<h4>
Client
</h4>




<p>

<strong>Name:</strong>

{" "}

{booking.customer?.name}

</p>





<p>

<strong>Status:</strong>

{" "}

{booking.status}

</p>







{

booking.status==="ACCEPTED" &&


<div className="contact-box">


<p>

<strong>Phone:</strong>

{" "}

{booking.customer?.phone}

</p>





<button

onClick={()=>handleWhatsApp(

booking.customer?.phone,

booking.customer?.name

)}

>

WhatsApp Client

</button>



</div>


}







{

booking.status==="PENDING" &&

<p>

Awaiting acceptance

</p>


}





{

booking.status==="REJECTED" &&

<p>

You rejected this request

</p>


}




</div>


))


}




</div>


);


}