"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import CookieConsentBanner from "@/components/ui/cookie-consent-banner";

export default function CookieBanner() {
    return (
        <CookieConsent
            location="bottom"
            cookieName="bimformative-cookie-consent"
            buttonText="Accept"
            expires={180}
            enableDeclineButton
            overlay={false}
            onAccept={() => {
                // future: enable analytics / ads
                console.log("Cookies accepted");
            }}
            onDecline={() => {
                console.log("Cookies declined");
            }}
            style={{ background: "transparent", padding: 0 }}
            contentStyle={{ margin: 0 }}
            buttonStyle={{ display: "none" }} // hide default buttons
            declineButtonStyle={{ display: "none" }}
        >
            <CookieConsentBanner
                variant="default"
                description="We use cookies for analytics and advertising purposes to improve our services."
                learnMoreHref="/privacy-policy"
            />
        </CookieConsent>
    );
}