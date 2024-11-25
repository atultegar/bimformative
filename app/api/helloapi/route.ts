import axios from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the response data type
type Data = {message?: string, error?: string};

// Email validation schema
const EmailSchema = z
    .string()
    .email({ message: "Please enter a valid email address"});


//Subscription handler function
export const POST = async (request: Request) => {
    
    // 1. Validate email address
    let email: string;
    const res = await request.json();
    email = res.email;

    const emailValidation = EmailSchema.safeParse(email);

    if (!emailValidation.success) {
        return NextResponse.json({ error: "Please enter a valid email address"}, {status: 400});
    }

    // 2. Retrieve Mailchimp credentials from environment variables
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const API_SERVER = process.env.MAILCHIMP_API_SERVER;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!API_KEY || !API_SERVER || !AUDIENCE_ID) {
        return NextResponse.json(
          { error: "Mailchimp credentials are not properly set" },
          { status: 500 }
        );
    }

    // 3. Construct Mailchimp API request URL    
    const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    // 4. Prepare request data
    const data =  {
        email_address: emailValidation.data,
        status: "subscribed",
    };

    // 5. Set request headers
    const options = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `api_key ${API_KEY}`,
        },
    };

    // 6. Send POST request to Mailchimp API
    try {
        const response = await axios.post(url, data, options);
        if (response.status === 200 || response.status === 201){
            return NextResponse.json({
                message: "Awesome! You have successfully subscribed!",
            }, { status: 201});
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.title || "Unknown error";
            const errorDetail = error.response?.data?.detail || "No additional details";

            if (error.response?.data.title === "Member Exists") {
                return NextResponse.json(
                    {error: "Uh oh, it looks like this email's already subscribed"},
                    { status: 400 }
                );
            }

            console.error(`Error: ${errorMessage}, Detail: ${errorDetail}`);
        }
        return NextResponse.json({
            error: "Oops! There was an error subscribing you to the newsletter. Please email me at atul.tegar@gmail.com and I'll add you to the list.",
        },
        {status : 500}
        );
    }    
};