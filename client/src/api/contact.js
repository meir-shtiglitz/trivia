import Swal from "sweetalert2";
import axios from "axios";
import { ApiUrl } from "./apiUrl";

export const sendMailContact = (state, updateState) => {
    const { name, email, subject, msg } = state;
    axios.get(`${ApiUrl}/contact`, {
        params: { name, email, subject, msg }
    }, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    })
        .then(function (callback) {
            Swal.fire({
                title: 'פנייתכם נשלחה בהצלחה',
                icon: 'success',
                confirmButtonText: 'בחזרה לאתר'
            })
                .then(function (result) {
                    updateState({
                        name: '', email: '', subject: '', msg: '',
                    })
                })
        })
}