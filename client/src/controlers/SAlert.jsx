
import Swal from 'sweetalert2';

const SAlert = (title='', text='', html='', icon='', fun_then='', ic_html='', c_b_text='אישור') => {
   
   
    const make_alert = () => {
        Swal.fire({
            title: title,
            text: text,
            html: html,
            icon: icon,
            iconHtml: ic_html,
            confirmButtonText: c_b_text,
        })
        .then(() => fun_then && fun_then())
    }
    
    return ( 
        make_alert()
    );
    
}
 
export default SAlert;