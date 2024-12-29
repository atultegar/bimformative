import { useEffect, useState } from "react";
import { MouseParallax} from "react-just-parallax";

export const Rings = () => {
    return (
      <>
        <div className="absolute top-1/2 left-1/2 w-[65.875rem] h-[65.875rem] border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[51.375rem] h-[51.375rem] border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[36.125rem] h-[36.125rem] border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[23.125rem] h-[23.125rem] border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </>
    );
  };

export const BackgroundGlow = () => {
    return (
        <div className="absolute top-1/2 left-1/2 w-[70rem] h-[70rem] bg-gradient-to-r from-blue-400/20 via-blue-200/10 to-transparent rounded-full -translate-x-1/2 -tranlate-y-1/2 blur-3xl"/>
    )
}

export const FloatingDots = () => {
    return (
        <>
            {[...Array(50)].map((_: any, index: number) => (
                <div 
                    key={index}
                    className="absolute w-2 h-2 bg-gray-500/20 rounded-full blur-sm animate-pulse"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 2 + 1}s`,
                    }} />
            ))}
        </>
    )
}

export const GeometricShapes = () => {
    return (
        <>
            {[...Array(20)].map((_: any, index: number) => (
                <div 
                    key={index}
                    className="absolute w-8 h-8 bg-gray-600/10 rounded-lg"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }} />
            ))}
        </>
    )
}



export const BackgroundCircles = () => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="absolute -top-[42.375rem] left-1/2 w-[90vw] max-w-[78rem] h-[90vw] max-h-[78rem] border border-n-2/5 rounded-full -translate-x-1/2 sm:-top-[38.5rem] xl:-top-[32rem] -z-10">
            <Rings />  
        </div>
    )
}