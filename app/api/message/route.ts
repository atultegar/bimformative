import axios from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the response data type
type Data = {message?: string, error?: string};

// Email validation schema
const EmailSchema = z
    .string()
    .email({ message: "Please enter a valid email address"});

const BEARER_TOKEN = process.env.SANITY_BEARER_TOKEN;
const url = "https://wlb0lt21.api.sanity.io/v2024-01-01/data/mutate/production";
const error_message = "There was a problem, please try again.";
const success_message = "Awesome! Message sent successfully!";


//Subscription handler function
export const POST = async (request: Request) => {
    
    // 1. Validate email address    
    const res = await request.json();
    const email = res.email;

    const emailValidation = EmailSchema.safeParse(email);

    if (!emailValidation.success) {
        return NextResponse.json({ error: "Please enter a valid email address"}, {status: 400});
    }
    

    if (!BEARER_TOKEN) {
        return NextResponse.json(
          { error: "Sanity credentials are not properly set" },
          { status: 500 }
        );
    }

    
    // 4. Prepare request data
    
    const data = {
        mutations: [
            {
                createOrReplace: {
                    _type: "contactmessage",
                    createdAt: new Date().toISOString(),
                    name: res.name,
                    email: emailValidation.data,
                    subject: res.subject,
                    message: res.message,
                    newsletter: res.newsletter || false,
                }
            }
        ]
    };

    // 5. Set request headers
    const options = {
        headers: {
            "Authorization": `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json"
        },
    };

    // 6. Send POST request to Mailchimp API
    try {
        const response = await axios.post(url, data, options);
        if (response.status === 200){
            return NextResponse.json({
                message: success_message,
            }, { status: 200});
        } else {
            return NextResponse.json({
                message: error_message,
            }, {status: 500});
        }
    } catch (e) {
        return NextResponse.json({
            message: error_message,
        }, {status:500});
    }    
};
