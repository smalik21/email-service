# Email Service API

This API allows you to submit form data and send it via email to a specified recipient. It's designed to be easily integrated with frontend applications.

## API Endpoint

The API is hosted at: https://email-service-9f6r.onrender.com

## Usage

### Example Usage (Frontend)

Here's how you can use this API in your frontend code:

```javascript

const onSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  // Add page information using these keywords ( "pageTitle", "pageUrl" )
  formData.append("pageTitle", "Contact Form - Homepage");
  formData.append("pageUrl", window.location.href);

  const recipientEmail = 'enter the recipient email'

  try {
    const response = await fetch(`https://email-service-9f6r.onrender.com/send-email/${encodeURIComponent(recipientEmail)}`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Form submitted successfully");
    } else {
      console.error("Error submitting form:", data.message);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
```

### Endpoint

`POST /send-email/:recipientEmail`

### Parameters

- `:recipientEmail` (URL parameter): The email address where the form data should be sent.

### Request Body

The request body should be `multipart/form-data` and can include any form fields you want to send. Two special fields are:

- `pageTitle`: The title of the page where the form was submitted (optional).
- `pageUrl`: The URL of the page where the form was submitted (optional).

All other fields will be included in the email as form data.

