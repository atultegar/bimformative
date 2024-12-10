import axios from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the response data type
type Data = {message?: string, error?: string};

// Email validation schema
const EmailSchema = z
    .string()
    .email({ message: "Please enter a valid email address"});

const API_KEY = process.env.KIT_API_KEY;
const FORM_ID = process.env.KIT_FORM_ID;
const BASE_URL = "https://api.convertkit.com/v3";
const email_required_message = "Email is required";
const error_message = "There was a problem, please try again.";
const success_message = "Awesome! You have successfully subscribed!";


//Subscription handler function
export const POST = async (request: Request) => {
    
    // 1. Validate email address    
    const res = await request.json();
    const email = res.email;

    const emailValidation = EmailSchema.safeParse(email);

    if (!emailValidation.success) {
        return NextResponse.json({ error: "Please enter a valid email address"}, {status: 400});
    }
    

    if (!API_KEY || !FORM_ID) {
        return NextResponse.json(
          { error: "Kit credentials are not properly set" },
          { status: 500 }
        );
    }

    // 3. Construct Mailchimp API request URL    
    const url = [BASE_URL, 'forms', FORM_ID, 'subscribe'].join('/');

    // 4. Prepare request data
    const data =  {
        api_key: API_KEY,
        email: emailValidation.data,
    };

    // 5. Set request headers
    const options = {
        headers: {
            "Content-Type": "application/json; charset=utf-8"
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
