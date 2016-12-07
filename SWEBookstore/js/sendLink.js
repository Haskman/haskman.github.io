/**
 * Created by Victor on 12/7/2016.
 * Credit to rahulroy9202
 */

function sendLink(email) {
    $.ajax({
        type: 'POST',
        url: 'https://mandrillapp.com/api/1.0/messages/send.json',
        data: {
            'key': 'HCJEKdTLRMtb3ThacDnBKw',
            'message': {
                'from_email': 'bookstore@kennesaw.edu',
                'to': [
                    {
                        'email': email,
                        'name': 'Our Customer',
                        'type': 'to'
                    }
                ],
                'autotext': 'true',
                'subject': 'Your e-book download link',
                'html': 'Thank you for shopping with us at KSU Online Bookstore! You can now download your e-books from the link below: \n https://thepiratebay.se'
            }
        }
    }).done(function(response) {
        console.log(response); // if you're into that sorta thing
    });
}
