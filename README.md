
# BUS BOOKING API
This is a bus booking API in which customer can book tickets , cancel tickets and also get to know vacant seats in a bus.
Some requests can only be run by the admin, Reset tickets, update ticket, get all the tickets and get the closed tickets.

# INSTALLATION
Make sure you have Node , Postman and MongoDB installed.
Once you download the "backend" folder , download al the dependencies by running the command "npm i" and then just run command "node app.js".
The server will start running.
Now you can test the API using POSTMAN.

# POSTMAN COLLECTIONS
Both the admin and customer collection files can be found in the Postman_collections folder. Import these collections in postman to use the bus booking system.

# CUSTOMER AND ADMIN SCHEMAS

![](/images/1.PNG)
![](/images/2.PNG)

# OVERVIEW
There are two schemas customer and admin.
The admin table will initially have all 40 tickets with status=false i.e vacant.
The status field in admin schema tells whether the seat is booked or not, in the customer schema bookstatus can have three values i.e confirmed,admin_cancelled and customer_cancelled.The booking_id field in customer table will have value of _id of coressponding seat number in the admin table.


# ALL API REQUESTS EXPALINED 

Bearer token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmltbXkiLCJzY29wZXMiOlsiYWRtaW46YWNjZXNzIl0sImlhdCI6MTU5MzE4OTM5Nn0.PJhOXRDMg-9XZlCJMLoHZpTtl8-C3l4lXeCZfXIeXN0";

1-Book a ticket(/bookticket/:seat/:id)(PATCH)
The customer can only book a ticket if he/she has the unique id of that ticket.
We assume that he/she will have that id only after payment.
Once id is generated ticket can be booked by the above mentioned PATCH request.
It will check if there is already any ticket in the customer table which is vacant and will edit that, otherwise create a new entry.
TEST CASES-
A) Try booking a ticket that is already booked.
B) Try booking a ticket that is already in customer table but with status other than "confirm".
C) Try booking a vacant ticket.
D)Try to enter wrong credentials (name with less than 3 digits or age greator than 100)

2-Get all tickets(/tickets)(GET)
This can be only done with admin acces (you need to have the token)
TEST CASES-
A) Try running this request with and without token.

3-Admin cancels the ticket(/canceladmin/:id/:seat)(PATCH)
This can be only done with admin acces (you need to have the token).
It will change bookstatus of the coressponding ticket to "Admin_cancelled".
In the admin table ticket status will be set to false and new booking id will be generated
TEST CASES-
A) Cancel a ticket that does not exist and that exists.

4-Customer cancels the ticket(/cancelcustomer/:id/:seat)(DELETE)
Only the customer having the ticket can cancel the ticket because it requires booking_id.
It will change bookstatus of the coressponding ticket to "Customer_cancelled".
In the admin table ticket status will be set to false and new booking id will be generated
TEST CASES-
A) Cancel a ticket that does not exist and that exists.

4-Get ticket by ticket id(/tickets/:id)(GET)
Only the customer having the ticket can get the details because it requires booking_id.
TEST CASES-
A) Try entering wrong id.

5-Get all open tickets(/opentickets/)(GET)
Any one can see the tickets available.

6-Get all closed tickets(/closedtickets/)(GET)
This can be only done with admin acces (you need to have the token).

7-Update ticket(/ticketupdate/:id)(PATCH)
c
The bookstatus can't be changed with this request.
Only customer's data can be changed.
You can only update confirmed ticket.
TEST CASES-
A) Try updating a cancelled ticket.
B)Try to enter wrong credentials (name with less than 3 digits or age greator than 100)

8-Get ticket(/ticketstatus/:id)(GET)
Only the customer having the ticket can cancel the ticket because it requires booking_id.
TEST CASES-
A) Try the request with wrong id.

9-Reset all tickets(/ticketsreset/)(DELETE)
This can be only done with admin acces (you need to have the token).
This will change status of all the confirmed tickets to "Admin_cancelled" and also reset the admin schema by generating new booking id's for all 40 tickets with status=false.
TEST CASES-
A) Try the request with wrong id.


# TECHNOLOGIES USED
MongoDB , NodeJs(Express)

# AUTHOR
Adish Aggarwal





