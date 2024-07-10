/*
    TO GOD BE THE GLORY,
    DUTIES APP,
    By Israel Mafabi Emmanuel

    CREATING
    READING
    UPDATING
    DELETING
*/

document.addEventListener('DOMContentLoaded', function() {
    const user_form    = document.getElementById('user_form');
    const user_name    = document.getElementById('name');
    const user_time    = document.getElementById('time');
    const user_duty    = document.getElementById('duty');
    const user_add     = document.getElementById('add_user');
    const duty_table   = document.querySelector('#duty_table tbody');
    const hidden_field = document.getElementById('hidden_field');

    (function() {
        // get the data from the database
        fetch('https://mafabi-server.onrender.com/users').then(function(response) {
            return response.json();
        }).then(function(data) {
            data.forEach(function(person) {
                const table_row = document.createElement('tr')
                table_row.innerHTML = `
                    <td>${person.name}</td>
                    <td>${person.duty_time}</td>
                    <td>${person.duty}</td>
                    <td>
                        <button class="duty_edit" data-id="${person.id}">Edit</button>
                        <button class="duty_delete" data-id="${person.id}">Delete</button>
                    </td>
                `
                duty_table.appendChild(table_row);
                // for debugging purposes
                // console.log(person.name);
            });
            //table_body.appendChild(table_row);
            // for debugging purposes
            // console.log(data)
        }).catch(function(error) {
            alert('failed to load data.')
        });
    })();

    user_form.addEventListener('submit', function(submit_event) {
        submit_event.preventDefault()
        // our form data and getting form data
        const formData = new FormData(user_form)
        const person = {
            name: formData.get('user_name'),
            duty_time: formData.get('user_time'),
            duty: formData.get('user_duty')
        }

        // get data from the form to be used in updating data
        const data_id = formData.get('user_duty_id')
        if(data_id) {
            // if the id is available - it's an update
            // UPDATE/PUT Method
            fetch(`https://mafabi-server.onrender.com/users/${data_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(person)
            }).then(function(response) {
                return response.json()
            }).then(function() {
                console.log('success!')
                // alert('Update Success!')
                user_add.innerText = "Add"
                window.location.reload()
            }).catch(function() {
                alert('Failed to Send Update Data')
            });
        } else {
            // it's a new person
            // POST Method
            // sending the data above to the server
            fetch('https://mafabi-server.onrender.com/users', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(person)
            }).then(function(response) {
                return response.json()
            }).then(function() {
                console.log('success!')
                // alert('Success!')
                window.location.reload()
            }).catch(function() {
                alert('Failed to Send Data')
            });
        }
    });

    // editting our form on the table body
    duty_table.addEventListener('click', function(click_event) {
        // for debugging purposes
        // console.log(click_event.target)
        const target_ = click_event.target
        const id = target_.dataset.id
        //console.log(id)
        // populating the form for editing
        fetch(`https://mafabi-server.onrender.com/users/${id}`).then(function(response) {
            return response.json()
        }).then(function(data) {
            // separating the delete and edit
            if(target_.className === "duty_edit") {
                // edit routine
                // console.log(data)
                user_name.value = data.name
                user_time.value = data.duty_time
                user_duty.value = data.duty
                hidden_field.value = data.id
                user_add.innerText = "Update"
            } else if(target_.className === "duty_delete") {
                // delete routine
                fetch(`https://mafabi-server.onrender.com/users/${data.id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(function(response) {
                    return response;
                }).then(function(data) {
                    //alert('Record Removed!')
                    window.location.reload();
                }).catch(function(error) {
                    console.error('failed to perform deletion.')
                    window.location.reload();
                });
            }
        });
    });
});