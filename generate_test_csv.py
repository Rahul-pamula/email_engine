import csv

# NOTE: Replace "rahul" with whatever namespace Testmail.app gives you!
NAMESPACE = "rahul"
DOMAIN = "inbox.testmail.app"
TOTAL_CONTACTS = 1000  # Number of fake emails to generate

filename = "testmail_contacts.csv"

# The header format ShRMail expects when uploading a CSV
fields = ["Email", "First Name", "Last Name"]

with open(filename, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(fields)
    
    for i in range(1, TOTAL_CONTACTS + 1):
        # Create a unique email: rahul.1@inbox.testmail.app, rahul.2@...
        email_address = f"{NAMESPACE}.{i}@{DOMAIN}"
        first_name = "Test"
        last_name = f"User {i}"
        
        writer.writerow([email_address, first_name, last_name])

print(f"Successfully generated {TOTAL_CONTACTS} fake contacts in {filename}!")
