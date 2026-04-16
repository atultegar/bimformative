interface Props {
    searchParams: Promise<{
        token?: string;
    }>;
}

export default async function DesktopAuthDonePage({ searchParams }: Props) {
    
    const { token } = await searchParams;

    return (
        <div className="p-32">
            <h2>Signed in successfully ✅</h2>
            <p>You may now return to the BIMformative Script Manager.</p>
            {token && <p className="mt-4 text-sm opacity-60">Token received.</p>}
        </div>
    );
}