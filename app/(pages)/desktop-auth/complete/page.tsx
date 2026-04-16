import CompleteDesktopAuthClient from "./CompleteDesktopAuthClient";

interface Props {
    searchParams: Promise<{
        token?: string;
        redirect?: string;
    }>;
}

export default async function CompleteDesktopAuth({ searchParams }: Props) {
    const { token, redirect } = await searchParams;
    
    return (
        <CompleteDesktopAuthClient
            token={token ?? null}
            redirectUrl={redirect ?? "/"}
        />
    );
}